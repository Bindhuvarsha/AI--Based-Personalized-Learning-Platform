package com.learnpath.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class GamificationDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BadgeDto {
        private String code;
        private String name;
        private String description;
        private String iconName;
        private String badgeType;
        private Integer xpBonus;
        private Boolean isUnlocked;
        private LocalDateTime unlockedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class XPTransactionDto {
        private Long id;
        private Integer xpAmount;
        private String reason;
        private LocalDateTime awardedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GamificationProfileResponse {
        private Integer currentLevel;
        private Integer currentXp;
        private Integer nextLevelXpRequired;
        private String title;
        private Double levelProgressPercent;
        private Integer currentStreakDays;
        private Integer longestStreakDays;
        private List<BadgeDto> badges;
        private List<XPTransactionDto> recentTransactions;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LeaderboardEntryDto {
        private Integer rank;
        private Long userId;
        private String studentName;
        private Integer level;
        private Integer totalXp;
        private Boolean isCurrentUser;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LeaderboardResponse {
        private String period; // ALL_TIME, WEEKLY
        private List<LeaderboardEntryDto> entries;
        private Integer currentUserRank;
    }
}
