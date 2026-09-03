package com.learnpath.repository;

import com.learnpath.model.entity.GroupMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupMessageRepository extends JpaRepository<GroupMessage, Long> {
    List<GroupMessage> findByStudyGroupIdAndIsFlaggedFalseOrderBySentAtAsc(Long groupId);
    List<GroupMessage> findTop50ByStudyGroupIdOrderBySentAtDesc(Long groupId);
}
