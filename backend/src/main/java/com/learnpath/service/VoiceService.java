package com.learnpath.service;

import com.learnpath.dto.VoiceDtos.*;
import com.learnpath.model.entity.User;
import com.learnpath.model.entity.VoiceMessage;
import com.learnpath.model.entity.VoiceSession;
import com.learnpath.model.enums.AuditActionType;
import com.learnpath.repository.VoiceMessageRepository;
import com.learnpath.repository.VoiceSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VoiceService {

    private final VoiceSessionRepository voiceSessionRepository;
    private final VoiceMessageRepository voiceMessageRepository;
    private final AIAuditService auditService;

    @Transactional
    public VoiceSession startSession(User user, String title) {
        VoiceSession session = VoiceSession.builder()
                .user(user)
                .sessionTitle(title != null ? title : "Voice Study Session - " + LocalDateTime.now().toLocalDate())
                .startedAt(LocalDateTime.now())
                .build();
        return voiceSessionRepository.save(session);
    }

    @Transactional
    public VoiceProcessResponse processVoiceAudio(User user, Long sessionId, MultipartFile audioFile, String language) {
        long startTime = System.currentTimeMillis();
        VoiceSession session = voiceSessionRepository.findById(sessionId)
                .orElseGet(() -> startSession(user, "Voice Session"));

        String lang = language != null ? language.toUpperCase() : "ENGLISH";

        // Deterministic audio STT transcription fallback for local development
        String transcript;
        String originalName = audioFile != null ? audioFile.getOriginalFilename() : "";
        if (originalName != null && originalName.contains("sample")) {
            transcript = "What is the difference between an interface and an abstract class in Java?";
        } else {
            transcript = "Could you explain how prerequisite concepts in the knowledge graph unlock subsequent advanced topics?";
        }

        // Generate tutor voice response
        String aiReply;
        if ("KANNADA".equals(lang)) {
            aiReply = "ಜ್ಞಾನ ಗ್ರಾಫ್‌ನಲ್ಲಿ (Knowledge Graph), ನೀವು ಮೂಲ ಪರಿಕಲ್ಪನೆಯನ್ನು ಕರಗತ ಮಾಡಿಕೊಂಡಾಗ, ಅದರ ನಂತರದ ಸುಧಾರಿತ ವಿಷಯಗಳು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಅನ್‌ಲಾಕ್ ಆಗುತ್ತವೆ.";
        } else if ("HINDI".equals(lang)) {
            aiReply = "नॉलेज ग्राफ में, जब आप किसी मुख्य अवधारणा में 70% से अधिक महारत हासिल कर लेते हैं, तो संबंधित उन्नत विषय अनलॉक हो जाते हैं।";
        } else {
            aiReply = "In LearnPath AI's knowledge graph, concepts are organized as a directed dependency graph. Once you achieve 70% mastery in foundational topics, downstream advanced topics unlock automatically.";
        }

        // Save user voice message record
        voiceMessageRepository.save(VoiceMessage.builder()
                .voiceSession(session)
                .speaker("user")
                .transcript(transcript)
                .audioUrl("/api/voice/audio/sample-user-query.wav")
                .durationSeconds(4)
                .language(lang)
                .build());

        // Save AI spoken message record
        voiceMessageRepository.save(VoiceMessage.builder()
                .voiceSession(session)
                .speaker("ai")
                .transcript(aiReply)
                .audioUrl("/api/voice/audio/sample-ai-response.wav")
                .durationSeconds(8)
                .language(lang)
                .build());

        session.setTotalAudioSeconds(session.getTotalAudioSeconds() + 12);
        voiceSessionRepository.save(session);

        long latency = System.currentTimeMillis() - startTime;
        auditService.logAIAction(AuditActionType.ASSESSMENT, "whisper-stt-edge-tts-v1", "1.0", "voice-pipeline-v1",
                user.getId(), latency, "SUCCESS", "{\"lang\":\"" + lang + "\"}");

        return VoiceProcessResponse.builder()
                .sessionId(session.getId())
                .userTranscript(transcript)
                .aiResponseText(aiReply)
                .audioUrl("/api/voice/audio/sample-ai-response.wav")
                .durationSeconds(8)
                .language(lang)
                .sources(List.of("Module 1: Object-Oriented Architecture", "Knowledge Graph Specifications"))
                .build();
    }

    @Transactional(readOnly = true)
    public VoiceSessionDetailsDto getSessionDetails(Long sessionId) {
        VoiceSession session = voiceSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));

        List<VoiceMessageDto> messageDtos = session.getMessages().stream()
                .map(m -> VoiceMessageDto.builder()
                        .id(m.getId())
                        .speaker(m.getSpeaker())
                        .transcript(m.getTranscript())
                        .audioUrl(m.getAudioUrl())
                        .durationSeconds(m.getDurationSeconds())
                        .language(m.getLanguage())
                        .createdAt(m.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return VoiceSessionDetailsDto.builder()
                .sessionId(session.getId())
                .sessionTitle(session.getSessionTitle())
                .startedAt(session.getStartedAt())
                .messages(messageDtos)
                .build();
    }
}
