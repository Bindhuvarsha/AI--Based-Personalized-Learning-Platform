package com.learnpath.model.entity;

import com.learnpath.model.enums.StudyGroupRole;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "study_group_members", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"study_group_id", "user_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyGroupMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_group_id", nullable = false)
    private StudyGroup studyGroup;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    @Builder.Default
    private StudyGroupRole role = StudyGroupRole.MEMBER;

    @Builder.Default
    private Boolean isMuted = false;

    @Builder.Default
    private LocalDateTime joinedAt = LocalDateTime.now();
}
