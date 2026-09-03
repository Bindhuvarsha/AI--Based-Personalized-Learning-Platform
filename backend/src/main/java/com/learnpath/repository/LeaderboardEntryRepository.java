package com.learnpath.repository;

import com.learnpath.model.entity.LeaderboardEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaderboardEntryRepository extends JpaRepository<LeaderboardEntry, Long> {

    @Query("SELECT e FROM LeaderboardEntry e WHERE e.period = :period AND e.optInPublic = true ORDER BY e.rankPosition ASC")
    List<LeaderboardEntry> findByPeriodAndOptInPublicTrueOrderByRankPositionAsc(@Param("period") String period);

    @Query("SELECT e FROM LeaderboardEntry e WHERE e.user.id = :userId AND e.period = :period")
    Optional<LeaderboardEntry> findByUserIdAndPeriod(@Param("userId") Long userId, @Param("period") String period);
}
