package com.learnpath.repository;

import com.learnpath.model.entity.Progress;
import com.learnpath.model.entity.Topic;
import com.learnpath.model.entity.User;
import com.learnpath.model.enums.KnowledgeLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {

    Optional<Progress> findByUserAndTopic(User user, Topic topic);

    @Query("SELECT p FROM Progress p WHERE p.user.id = :userId AND p.topic.id = :topicId")
    Optional<Progress> findByUserIdAndTopicId(@Param("userId") Long userId, @Param("topicId") Long topicId);

    @Query("SELECT p FROM Progress p WHERE p.user.id = :userId")
    List<Progress> findByUserId(@Param("userId") Long userId);

    @Query("SELECT p FROM Progress p WHERE p.user.id = :userId AND p.knowledgeLevel = :knowledgeLevel")
    List<Progress> findByUserIdAndKnowledgeLevel(@Param("userId") Long userId, @Param("knowledgeLevel") KnowledgeLevel knowledgeLevel);
}
