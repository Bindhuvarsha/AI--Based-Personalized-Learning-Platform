package com.learnpath.repository;

import com.learnpath.model.entity.StudyGroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudyGroupMemberRepository extends JpaRepository<StudyGroupMember, Long> {

    @Query("SELECT m FROM StudyGroupMember m WHERE m.studyGroup.id = :groupId AND m.user.id = :userId")
    Optional<StudyGroupMember> findByStudyGroupIdAndUserId(@Param("groupId") Long groupId, @Param("userId") Long userId);

    @Query("SELECT m FROM StudyGroupMember m WHERE m.user.id = :userId")
    List<StudyGroupMember> findByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(m) FROM StudyGroupMember m WHERE m.studyGroup.id = :groupId")
    int countByStudyGroupId(@Param("groupId") Long groupId);
}
