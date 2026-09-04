package com.learnpath.repository;

import com.learnpath.model.entity.Recommendation;
import com.learnpath.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {

    @Query("SELECT r FROM Recommendation r WHERE r.user.id = :userId AND r.dismissed = false ORDER BY r.priorityScore DESC, r.createdAt DESC")
    List<Recommendation> findByUserIdAndDismissedFalseOrderByPriorityScoreDescCreatedAtDesc(@Param("userId") Long userId);

    List<Recommendation> findByUser(User user);

    void deleteByUser(User user);
}
