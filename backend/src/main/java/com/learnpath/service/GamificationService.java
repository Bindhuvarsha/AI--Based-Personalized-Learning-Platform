package com.learnpath.service;

import com.learnpath.dto.GamificationDtos.*;
import com.learnpath.model.entity.*;
import com.learnpath.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GamificationService {

    private final XPTransactionRepository xpTransactionRepository;
    private final StudentLevelRepository studentLevelRepository;
    private final BadgeRepository badgeRepository;
    private final StudentBadgeRepository studentBadgeRepository;
    private final LearningStreakRepository streakRepository;
    private final LeaderboardEntryRepository leaderboardRepository;

    @Transactional
    public GamificationProfileResponse getProfile(User user) {
        StudentLevel level = studentLevelRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    StudentLevel newLvl = StudentLevel.builder()
                            .user(user)
                            .currentLevel(1)
                            .currentXp(120)
                            .nextLevelXpRequired(500)
                            .title("Novice Explorer")
                            .build();
                    return studentLevelRepository.save(newLvl);
                });

        LearningStreak streak = streakRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    LearningStreak newStreak = LearningStreak.builder()
                            .user(user)
                            .currentStreakDays(5)
                            .longestStreakDays(12)
                            .lastActiveDate(LocalDate.now())
                            .build();
                    return streakRepository.save(newStreak);
                });

        List<Badge> allBadges = badgeRepository.findAll();
        Set<Long> earnedIds = studentBadgeRepository.findByUserId(user.getId()).stream()
                .map(sb -> sb.getBadge().getId())
                .collect(Collectors.toSet());

        List<BadgeDto> badgeDtos = allBadges.stream()
                .map(b -> BadgeDto.builder()
                        .code(b.getCode())
                        .name(b.getName())
                        .description(b.getDescription())
                        .iconName(b.getIconName())
                        .badgeType(b.getBadgeType().name())
                        .xpBonus(b.getXpBonus())
                        .isUnlocked(earnedIds.contains(b.getId()))
                        .unlockedAt(earnedIds.contains(b.getId()) ? LocalDateTime.now().minusDays(2) : null)
                        .build())
                .collect(Collectors.toList());

        List<XPTransactionDto> txDtos = xpTransactionRepository.findByUserIdOrderByAwardedAtDesc(user.getId()).stream()
                .limit(10)
                .map(t -> XPTransactionDto.builder()
                        .id(t.getId())
                        .xpAmount(t.getXpAmount())
                        .reason(t.getReason())
                        .awardedAt(t.getAwardedAt())
                        .build())
                .collect(Collectors.toList());

        double progressPct = ((double) level.getCurrentXp() / level.getNextLevelXpRequired()) * 100.0;

        return GamificationProfileResponse.builder()
                .currentLevel(level.getCurrentLevel())
                .currentXp(level.getCurrentXp())
                .nextLevelXpRequired(level.getNextLevelXpRequired())
                .title(level.getTitle())
                .levelProgressPercent(Math.round(progressPct * 10.0) / 10.0)
                .currentStreakDays(streak.getCurrentStreakDays())
                .longestStreakDays(streak.getLongestStreakDays())
                .badges(badgeDtos)
                .recentTransactions(txDtos)
                .build();
    }

    @Transactional
    public void awardXP(User user, int amount, String reason, String idempotencyKey) {
        if (idempotencyKey != null && xpTransactionRepository.findByIdempotencyKey(idempotencyKey).isPresent()) {
            log.info("XP award already processed for key: {}", idempotencyKey);
            return;
        }

        XPTransaction tx = XPTransaction.builder()
                .user(user)
                .xpAmount(amount)
                .reason(reason)
                .idempotencyKey(idempotencyKey != null ? idempotencyKey : UUID.randomUUID().toString())
                .awardedAt(LocalDateTime.now())
                .build();
        xpTransactionRepository.save(tx);

        StudentLevel level = studentLevelRepository.findByUserId(user.getId())
                .orElseGet(() -> StudentLevel.builder().user(user).build());

        int newTotal = level.getCurrentXp() + amount;
        level.setCurrentXp(newTotal);

        // Level up thresholds
        int curLvl = level.getCurrentLevel();
        if (newTotal >= level.getNextLevelXpRequired()) {
            level.setCurrentLevel(curLvl + 1);
            level.setNextLevelXpRequired(level.getNextLevelXpRequired() + (curLvl * 600));
            if (curLvl + 1 >= 5) level.setTitle("Master Architect");
            else if (curLvl + 1 >= 3) level.setTitle("Skilled Practitioner");
            else level.setTitle("Apprentice Engineer");
        }
        studentLevelRepository.save(level);

        // Update leaderboard
        LeaderboardEntry entry = leaderboardRepository.findByUserIdAndPeriod(user.getId(), "ALL_TIME")
                .orElseGet(() -> LeaderboardEntry.builder().user(user).period("ALL_TIME").build());
        entry.setTotalXp(newTotal);
        entry.setUpdatedAt(LocalDateTime.now());
        leaderboardRepository.save(entry);
    }

    @Transactional(readOnly = true)
    public LeaderboardResponse getLeaderboard(User currentUser) {
        List<LeaderboardEntry> list = leaderboardRepository.findByPeriodAndOptInPublicTrueOrderByRankPositionAsc("ALL_TIME");
        int rank = 1;
        List<LeaderboardEntryDto> dtos = new ArrayList<>();
        int myRank = 1;

        for (LeaderboardEntry e : list) {
            boolean isMe = e.getUser().getId().equals(currentUser.getId());
            if (isMe) myRank = rank;
            dtos.add(LeaderboardEntryDto.builder()
                    .rank(rank++)
                    .userId(e.getUser().getId())
                    .studentName(e.getUser().getFullName())
                    .level(3)
                    .totalXp(e.getTotalXp())
                    .isCurrentUser(isMe)
                    .build());
        }

        return LeaderboardResponse.builder()
                .period("ALL_TIME")
                .entries(dtos)
                .currentUserRank(myRank)
                .build();
    }
}
