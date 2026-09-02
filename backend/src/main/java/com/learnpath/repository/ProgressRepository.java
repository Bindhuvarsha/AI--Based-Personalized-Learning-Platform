package com.learnpath.repository;

import com.learnpath.model.entity.Progress;
import com.learnpath.model.entity.Topic;
import com.learnpath.model.entity.User;
import com.learnpath.model.enums.KnowledgeLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {
    Optional<Progress> findByUserAndTopic(User user, Topic topic);
    Optional<Progress> findByUserIdAndTopicId(Long userId, Long topicId);
    List<Progress> findByUserId(Long userId);
    List<Progress> findByUserIdAndKnowledgeLevel(Long userId, KnowledgeLevel knowledgeLevel);
}
