package com.learnpath.service;

import com.learnpath.dto.GamificationDtos.*;
import com.learnpath.model.entity.*;
import com.learnpath.model.enums.BadgeType;
import com.learnpath.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GamificationServiceTest {

    @Mock
    private XPTransactionRepository xpTransactionRepository;

    @Mock
    private StudentLevelRepository studentLevelRepository;

    @Mock
    private BadgeRepository badgeRepository;

    @Mock
    private StudentBadgeRepository studentBadgeRepository;

    @Mock
    private LearningStreakRepository streakRepository;

    @Mock
    private LeaderboardEntryRepository leaderboardRepository;

    @InjectMocks
    private GamificationService gamificationService;

    private User testUser;
    private StudentLevel testLevel;
    private LearningStreak testStreak;
    private Badge testBadge;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).email("student@example.com").fullName("Test Student").build();

        testLevel = StudentLevel.builder()
                .id(1L)
                .user(testUser)
                .currentLevel(2)
                .currentXp(400)
                .nextLevelXpRequired(500)
                .title("Apprentice Engineer")
                .build();

        testStreak = LearningStreak.builder()
                .id(1L)
                .user(testUser)
                .currentStreakDays(7)
                .longestStreakDays(14)
                .lastActiveDate(LocalDate.now())
                .build();

        testBadge = Badge.builder()
                .id(1L)
                .code("FIRST_QUIZ")
                .name("First Step")
                .description("Completed your very first adaptive quiz.")
                .iconName("CheckCircle2")
                .badgeType(BadgeType.ACHIEVEMENT)
                .xpBonus(50)
                .build();
    }

    @Test
    void testGetProfile_Success() {
        when(studentLevelRepository.findByUserId(1L)).thenReturn(Optional.of(testLevel));
        when(streakRepository.findByUserId(1L)).thenReturn(Optional.of(testStreak));
        when(badgeRepository.findAll()).thenReturn(List.of(testBadge));
        when(studentBadgeRepository.findByUserId(1L)).thenReturn(List.of());
        when(xpTransactionRepository.findByUserIdOrderByAwardedAtDesc(1L)).thenReturn(List.of());

        GamificationProfileResponse response = gamificationService.getProfile(testUser);

        assertNotNull(response);
        assertEquals(2, response.getCurrentLevel());
        assertEquals(400, response.getCurrentXp());
        assertEquals(7, response.getCurrentStreakDays());
        assertEquals(1, response.getBadges().size());
        assertFalse(response.getBadges().get(0).getIsUnlocked());
    }

    @Test
    void testAwardXP_LevelUpTriggered() {
        when(xpTransactionRepository.findByIdempotencyKey("quiz_done_101")).thenReturn(Optional.empty());
        when(studentLevelRepository.findByUserId(1L)).thenReturn(Optional.of(testLevel));
        when(leaderboardRepository.findByUserIdAndPeriod(1L, "ALL_TIME")).thenReturn(Optional.empty());

        // Award 150 XP -> 400 + 150 = 550 >= 500 (Level Up!)
        gamificationService.awardXP(testUser, 150, "Completed Quiz with 100% Score", "quiz_done_101");

        verify(xpTransactionRepository, times(1)).save(any(XPTransaction.class));
        verify(studentLevelRepository, times(1)).save(testLevel);
        assertEquals(3, testLevel.getCurrentLevel());
        assertEquals(550, testLevel.getCurrentXp());
    }

    @Test
    void testAwardXP_IdempotencyKeySkipsDuplicate() {
        XPTransaction existingTx = XPTransaction.builder()
                .id(99L)
                .idempotencyKey("already_awarded_key")
                .build();
        when(xpTransactionRepository.findByIdempotencyKey("already_awarded_key")).thenReturn(Optional.of(existingTx));

        gamificationService.awardXP(testUser, 100, "Duplicate Call", "already_awarded_key");

        verify(xpTransactionRepository, never()).save(any(XPTransaction.class));
        verify(studentLevelRepository, never()).save(any(StudentLevel.class));
    }
}
