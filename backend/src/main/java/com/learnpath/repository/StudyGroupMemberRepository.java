package com.learnpath.repository;

import com.learnpath.model.entity.StudyGroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudyGroupMemberRepository extends JpaRepository<StudyGroupMember, Long> {
    Optional<StudyGroupMember> findByStudyGroupIdAndUserId(Long groupId, Long userId);
    List<StudyGroupMember> findByUserId(Long userId);
    int countByStudyGroupId(Long groupId);
}
