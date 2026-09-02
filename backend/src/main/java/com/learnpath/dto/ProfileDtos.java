package com.learnpath.dto;

import com.learnpath.model.enums.DifficultyLevel;
import com.learnpath.model.enums.LanguagePreference;
import lombok.*;

import java.util.List;

public class ProfileDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProfileResponse {
        private Long id;
        private Long userId;
        private String email;
        private String fullName;
        private String educationLevel;
        private List<String> subjectsOfInterest;
        private List<String> currentSkills;
        private String learningGoals;
        private DifficultyLevel preferredDifficulty;
        private LanguagePreference preferredLanguage;
        private Integer weeklyStudyTargetMinutes;
        private Integer currentStreakDays;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateProfileRequest {
        private String educationLevel;
        private List<String> subjectsOfInterest;
        private List<String> currentSkills;
        private String learningGoals;
        private DifficultyLevel preferredDifficulty;
        private LanguagePreference preferredLanguage;
        private Integer weeklyStudyTargetMinutes;
    }
}
