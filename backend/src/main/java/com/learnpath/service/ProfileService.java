package com.learnpath.service;

import com.learnpath.dto.ProfileDtos.*;
import com.learnpath.exception.ResourceNotFoundException;
import com.learnpath.model.entity.StudentProfile;
import com.learnpath.model.entity.User;
import com.learnpath.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final StudentProfileRepository profileRepository;

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(User user) {
        StudentProfile profile = profileRepository.findByUser(user)
                .orElseGet(() -> createDefaultProfile(user));

        return mapToDto(profile);
    }

    @Transactional
    public ProfileResponse updateProfile(User user, UpdateProfileRequest request) {
        StudentProfile profile = profileRepository.findByUser(user)
                .orElseGet(() -> createDefaultProfile(user));

        if (request.getEducationLevel() != null) profile.setEducationLevel(request.getEducationLevel());
        if (request.getSubjectsOfInterest() != null) {
            profile.setSubjectsOfInterest(String.join(", ", request.getSubjectsOfInterest()));
        }
        if (request.getCurrentSkills() != null) {
            profile.setCurrentSkills(String.join(", ", request.getCurrentSkills()));
        }
        if (request.getLearningGoals() != null) profile.setLearningGoals(request.getLearningGoals());
        if (request.getPreferredDifficulty() != null) profile.setPreferredDifficulty(request.getPreferredDifficulty());
        if (request.getPreferredLanguage() != null) profile.setPreferredLanguage(request.getPreferredLanguage());
        if (request.getWeeklyStudyTargetMinutes() != null) profile.setWeeklyStudyTargetMinutes(request.getWeeklyStudyTargetMinutes());

        profile.setLastActiveDate(LocalDateTime.now());
        StudentProfile saved = profileRepository.save(profile);
        return mapToDto(saved);
    }

    @Transactional
    public StudentProfile createDefaultProfile(User user) {
        StudentProfile profile = StudentProfile.builder()
                .user(user)
                .educationLevel("Undergraduate")
                .subjectsOfInterest("Computer Science, AI")
                .currentSkills("Beginner")
                .learningGoals("Build modern AI-powered applications")
                .build();
        return profileRepository.save(profile);
    }

    private ProfileResponse mapToDto(StudentProfile p) {
        List<String> subjects = p.getSubjectsOfInterest() != null && !p.getSubjectsOfInterest().isBlank()
                ? Arrays.stream(p.getSubjectsOfInterest().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList())
                : Collections.emptyList();

        List<String> skills = p.getCurrentSkills() != null && !p.getCurrentSkills().isBlank()
                ? Arrays.stream(p.getCurrentSkills().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList())
                : Collections.emptyList();

        return ProfileResponse.builder()
                .id(p.getId())
                .userId(p.getUser().getId())
                .email(p.getUser().getEmail())
                .fullName(p.getUser().getFullName())
                .educationLevel(p.getEducationLevel())
                .subjectsOfInterest(subjects)
                .currentSkills(skills)
                .learningGoals(p.getLearningGoals())
                .preferredDifficulty(p.getPreferredDifficulty())
                .preferredLanguage(p.getPreferredLanguage())
                .weeklyStudyTargetMinutes(p.getWeeklyStudyTargetMinutes())
                .currentStreakDays(p.getCurrentStreakDays())
                .build();
    }
}
