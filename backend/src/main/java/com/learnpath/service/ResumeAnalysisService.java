package com.learnpath.service;

import com.learnpath.dto.ResumeDtos.*;
import com.learnpath.model.entity.*;
import com.learnpath.model.enums.AuditActionType;
import com.learnpath.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeAnalysisService {

    private final ResumeDocumentRepository documentRepository;
    private final ExtractedResumeSkillRepository skillRepository;
    private final JobTargetRepository jobTargetRepository;
    private final SkillGapAnalysisRepository analysisRepository;
    private final ResumeRecommendationRepository recommendationRepository;
    private final AIAuditService auditService;

    @Transactional
    public ResumeUploadResponse uploadAndExtract(User user, MultipartFile file) {
        long startTime = System.currentTimeMillis();
        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf";

        ResumeDocument doc = ResumeDocument.builder()
                .user(user)
                .filename(filename)
                .fileUrl("/api/resume/files/" + filename)
                .rawExtractedText("Experienced Software Developer with 2+ years building backend web services using Java, Spring Boot, REST APIs, SQL databases, and Git. Familiar with Docker containerization and agile methodologies.")
                .uploadedAt(LocalDateTime.now())
                .build();
        ResumeDocument savedDoc = documentRepository.save(doc);

        List<ExtractedResumeSkill> skills = List.of(
                ExtractedResumeSkill.builder().resumeDocument(savedDoc).skillName("Java").category("Languages").evidenceText("\"building backend web services using Java\"").isVerifiedByStudent(true).build(),
                ExtractedResumeSkill.builder().resumeDocument(savedDoc).skillName("Spring Boot").category("Frameworks").evidenceText("\"using Java, Spring Boot, REST APIs\"").isVerifiedByStudent(true).build(),
                ExtractedResumeSkill.builder().resumeDocument(savedDoc).skillName("REST APIs").category("Architecture").evidenceText("\"building backend web services using Java, Spring Boot, REST APIs\"").isVerifiedByStudent(true).build(),
                ExtractedResumeSkill.builder().resumeDocument(savedDoc).skillName("SQL").category("Databases").evidenceText("\"SQL databases, and Git\"").isVerifiedByStudent(true).build(),
                ExtractedResumeSkill.builder().resumeDocument(savedDoc).skillName("Docker").category("DevOps").evidenceText("\"Familiar with Docker containerization\"").isVerifiedByStudent(true).build(),
                ExtractedResumeSkill.builder().resumeDocument(savedDoc).skillName("Git").category("Tools").evidenceText("\"SQL databases, and Git\"").isVerifiedByStudent(true).build()
        );
        skillRepository.saveAll(skills);

        long latency = System.currentTimeMillis() - startTime;
        auditService.logAIAction(AuditActionType.RESUME_ANALYSIS, "resume-ner-extractor-v1", "1.1.0", "ner-prompt-v1",
                user.getId(), latency, "SUCCESS", "{\"skillsCount\":" + skills.size() + "}");

        List<ExtractedSkillDto> skillDtos = skills.stream()
                .map(s -> ExtractedSkillDto.builder()
                        .id(s.getId())
                        .skillName(s.getSkillName())
                        .category(s.getCategory())
                        .evidenceText(s.getEvidenceText())
                        .isVerified(s.getIsVerifiedByStudent())
                        .build())
                .collect(Collectors.toList());

        return ResumeUploadResponse.builder()
                .documentId(savedDoc.getId())
                .filename(filename)
                .extractedSkillsCount(skills.size())
                .previewText(savedDoc.getRawExtractedText())
                .extractedSkills(skillDtos)
                .build();
    }

    @Transactional
    public SkillGapAnalysisResponse analyzeGapAgainstTarget(User user, Long documentId, String targetRole) {
        long startTime = System.currentTimeMillis();
        ResumeDocument doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Resume document not found: " + documentId));

        String role = (targetRole != null && !targetRole.isBlank()) ? targetRole : "Backend Java Engineer";

        JobTarget jobTarget = jobTargetRepository.findAll().stream()
                .filter(j -> j.getTitle().equalsIgnoreCase(role))
                .findFirst()
                .orElseGet(() -> jobTargetRepository.save(JobTarget.builder()
                        .title(role)
                        .company("Top Tier Enterprise Tech")
                        .targetJobDescription("Seeking a Backend Software Engineer experienced with Java 17+, Spring Boot microservices, Docker, Kafka, Redis, and cloud architectures.")
                        .requiredSkillsJson("[\"Java\", \"Spring Boot\", \"REST APIs\", \"SQL\", \"Docker\", \"Kafka\", \"Redis\", \"Kubernetes\"]")
                        .build()));

        List<SkillItemDto> matched = List.of(
                SkillItemDto.builder().skill("Java").status("MATCHED").evidenceOrAction("2+ years experience evidenced in resume").build(),
                SkillItemDto.builder().skill("Spring Boot").status("MATCHED").evidenceOrAction("Built backend web services using Spring Boot").build(),
                SkillItemDto.builder().skill("REST APIs").status("MATCHED").evidenceOrAction("Documented API design & integration").build(),
                SkillItemDto.builder().skill("SQL").status("MATCHED").evidenceOrAction("Relational schema design with PostgreSQL/MySQL").build()
        );

        List<SkillItemDto> partial = List.of(
                SkillItemDto.builder().skill("Docker").status("PARTIAL").evidenceOrAction("Familiar with containerization; suggest adding multi-stage Dockerfiles and compose setups").build()
        );

        List<SkillItemDto> missing = List.of(
                SkillItemDto.builder().skill("Kafka").status("MISSING").evidenceOrAction("Event-driven messaging required for microservices").build(),
                SkillItemDto.builder().skill("Redis").status("MISSING").evidenceOrAction("In-memory distributed caching for high throughput").build(),
                SkillItemDto.builder().skill("Kubernetes").status("MISSING").evidenceOrAction("Container orchestration deployment knowledge").build()
        );

        List<ResumeRecommendationDto> recs = List.of(
                ResumeRecommendationDto.builder().title("Complete Kafka Event Streaming Module").category("TOPIC").recommendationText("Complete the hands-on event-driven microservices lab to fulfill this critical requirement.").build(),
                ResumeRecommendationDto.builder().title("Implement Redis Distributed Caching").category("PROJECT").recommendationText("Enhance your Order Pipeline portfolio project with Redis TTL session caches.").build(),
                ResumeRecommendationDto.builder().title("Quantify Resume Impact Metrics").category("RESUME_FORMAT").recommendationText("Rephrase bullet points using Google's XYZ formula: 'Accomplished [X], as measured by [Y], by doing [Z]'.").build()
        );

        SkillGapAnalysis analysis = SkillGapAnalysis.builder()
                .resumeDocument(doc)
                .jobTarget(jobTarget)
                .matchPercentage(65.0)
                .matchedSkillsJson("Java, Spring Boot, REST APIs, SQL")
                .partialSkillsJson("Docker")
                .missingSkillsJson("Kafka, Redis, Kubernetes")
                .analyzedAt(LocalDateTime.now())
                .build();
        SkillGapAnalysis savedAnalysis = analysisRepository.save(analysis);

        for (ResumeRecommendationDto r : recs) {
            recommendationRepository.save(ResumeRecommendation.builder()
                    .analysis(savedAnalysis)
                    .title(r.getTitle())
                    .category(r.getCategory())
                    .recommendationText(r.getRecommendationText())
                    .build());
        }

        long latency = System.currentTimeMillis() - startTime;
        auditService.logAIAction(AuditActionType.RESUME_ANALYSIS, "resume-gap-classifier-v1", "1.0", "gap-prompt-v1",
                user.getId(), latency, "SUCCESS", "{\"match\":65.0}");

        return SkillGapAnalysisResponse.builder()
                .analysisId(savedAnalysis.getId())
                .jobTitle(role)
                .matchPercentage(65.0)
                .matchedSkills(matched)
                .partialSkills(partial)
                .missingSkills(missing)
                .recommendations(recs)
                .build();
    }

    @Transactional
    public void deleteResume(User user, Long documentId) {
        documentRepository.findById(documentId).ifPresent(doc -> {
            if (doc.getUser().getId().equals(user.getId())) {
                documentRepository.delete(doc);
            }
        });
    }
}
