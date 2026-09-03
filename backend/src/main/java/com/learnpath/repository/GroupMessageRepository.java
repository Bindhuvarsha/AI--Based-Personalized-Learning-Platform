package com.learnpath.repository;

import com.learnpath.model.entity.GroupMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupMessageRepository extends JpaRepository<GroupMessage, Long> {

    @Query("SELECT m FROM GroupMessage m WHERE m.studyGroup.id = :groupId AND m.isFlagged = false ORDER BY m.sentAt ASC")
    List<GroupMessage> findByStudyGroupIdAndIsFlaggedFalseOrderBySentAtAsc(@Param("groupId") Long groupId);

    List<GroupMessage> findTop50ByStudyGroupIdOrderBySentAtDesc(Long groupId);
}
