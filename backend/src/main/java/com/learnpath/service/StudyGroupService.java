package com.learnpath.service;

import com.learnpath.dto.StudyGroupDtos.*;
import com.learnpath.model.entity.GroupMessage;
import com.learnpath.model.entity.StudyGroup;
import com.learnpath.model.entity.StudyGroupMember;
import com.learnpath.model.entity.User;
import com.learnpath.model.enums.LanguagePreference;
import com.learnpath.model.enums.StudyGroupRole;
import com.learnpath.repository.GroupMessageRepository;
import com.learnpath.repository.StudyGroupMemberRepository;
import com.learnpath.repository.StudyGroupRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudyGroupService {

    private final StudyGroupRepository studyGroupRepository;
    private final StudyGroupMemberRepository memberRepository;
    private final GroupMessageRepository messageRepository;

    @Transactional(readOnly = true)
    public List<StudyGroupDto> listGroups(User user) {
        return studyGroupRepository.findAll().stream()
                .map(g -> {
                    boolean isJoined = memberRepository.findByStudyGroupIdAndUserId(g.getId(), user.getId()).isPresent();
                    boolean isOwner = Objects.equals(g.getCreatedBy().getId(), user.getId());
                    return StudyGroupDto.builder()
                            .id(g.getId())
                            .name(g.getName())
                            .description(g.getDescription())
                            .topicFocus(g.getTopicFocus())
                            .targetCareer(g.getTargetCareer())
                            .language(g.getLanguage().name())
                            .memberCount(g.getMembers().size())
                            .maxMembers(g.getMaxMembers())
                            .isJoined(isJoined)
                            .isOwner(isOwner)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public StudyGroupDto createGroup(User user, CreateStudyGroupRequest request) {
        LanguagePreference lang = LanguagePreference.ENGLISH;
        try {
            if (request.getLanguage() != null) lang = LanguagePreference.valueOf(request.getLanguage().toUpperCase());
        } catch (Exception ignored) {}

        StudyGroup group = StudyGroup.builder()
                .name(request.getName())
                .description(request.getDescription())
                .topicFocus(request.getTopicFocus())
                .targetCareer(request.getTargetCareer())
                .language(lang)
                .maxMembers(request.getMaxMembers() != null ? request.getMaxMembers() : 8)
                .createdBy(user)
                .createdAt(LocalDateTime.now())
                .build();
        StudyGroup savedGroup = studyGroupRepository.save(group);

        // Creator automatically joins as LEADER
        StudyGroupMember member = StudyGroupMember.builder()
                .studyGroup(savedGroup)
                .user(user)
                .role(StudyGroupRole.LEADER)
                .joinedAt(LocalDateTime.now())
                .build();
        memberRepository.save(member);

        return StudyGroupDto.builder()
                .id(savedGroup.getId())
                .name(savedGroup.getName())
                .description(savedGroup.getDescription())
                .topicFocus(savedGroup.getTopicFocus())
                .targetCareer(savedGroup.getTargetCareer())
                .language(savedGroup.getLanguage().name())
                .memberCount(1)
                .maxMembers(savedGroup.getMaxMembers())
                .isJoined(true)
                .isOwner(true)
                .build();
    }

    @Transactional
    public void joinGroup(User user, Long groupId) {
        StudyGroup group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Study group not found: " + groupId));

        if (memberRepository.findByStudyGroupIdAndUserId(groupId, user.getId()).isPresent()) {
            return;
        }

        if (group.getMembers().size() >= group.getMaxMembers()) {
            throw new IllegalStateException("Study group has reached maximum capacity (" + group.getMaxMembers() + ").");
        }

        StudyGroupMember member = StudyGroupMember.builder()
                .studyGroup(group)
                .user(user)
                .role(StudyGroupRole.MEMBER)
                .joinedAt(LocalDateTime.now())
                .build();
        memberRepository.save(member);
    }

    @Transactional
    public void leaveGroup(User user, Long groupId) {
        memberRepository.findByStudyGroupIdAndUserId(groupId, user.getId())
                .ifPresent(memberRepository::delete);
    }

    @Transactional(readOnly = true)
    public List<GroupMessageDto> getMessages(User user, Long groupId) {
        return messageRepository.findByStudyGroupIdAndIsFlaggedFalseOrderBySentAtAsc(groupId).stream()
                .map(m -> GroupMessageDto.builder()
                        .id(m.getId())
                        .senderId(m.getSender().getId())
                        .senderName(m.getSender().getFullName())
                        .content(m.getContent())
                        .isCurrentUser(m.getSender().getId().equals(user.getId()))
                        .sentAt(m.getSentAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public GroupMessageDto postMessage(User user, Long groupId, PostMessageRequest request) {
        StudyGroup group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Study group not found: " + groupId));

        // Basic abusive content filter
        boolean isFlagged = request.getContent() != null && request.getContent().toLowerCase().contains("spam");

        GroupMessage msg = GroupMessage.builder()
                .studyGroup(group)
                .sender(user)
                .content(request.getContent())
                .isFlagged(isFlagged)
                .sentAt(LocalDateTime.now())
                .build();
        GroupMessage saved = messageRepository.save(msg);

        return GroupMessageDto.builder()
                .id(saved.getId())
                .senderId(user.getId())
                .senderName(user.getFullName())
                .content(saved.getContent())
                .isCurrentUser(true)
                .sentAt(saved.getSentAt())
                .build();
    }
}
