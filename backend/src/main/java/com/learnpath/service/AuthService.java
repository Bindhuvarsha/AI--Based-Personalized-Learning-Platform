package com.learnpath.service;

import com.learnpath.dto.AuthDtos.*;
import com.learnpath.exception.BadRequestException;
import com.learnpath.exception.ResourceNotFoundException;
import com.learnpath.model.entity.RefreshToken;
import com.learnpath.model.entity.Role;
import com.learnpath.model.entity.StudentProfile;
import com.learnpath.model.entity.User;
import com.learnpath.model.enums.RoleType;
import com.learnpath.repository.RefreshTokenRepository;
import com.learnpath.repository.RoleRepository;
import com.learnpath.repository.StudentProfileRepository;
import com.learnpath.repository.UserRepository;
import com.learnpath.security.JwtService;
import com.learnpath.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final StudentProfileRepository profileRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Value("${app.jwt.refresh-expiration-ms:604800000}")
    private Long refreshExpirationMs;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("Email is already registered");
        }

        Set<Role> roles = new HashSet<>();
        if ("ADMIN".equalsIgnoreCase(request.getRole())) {
            Role adminRole = roleRepository.findByName(RoleType.ROLE_ADMIN)
                    .orElseGet(() -> roleRepository.save(Role.builder().name(RoleType.ROLE_ADMIN).build()));
            roles.add(adminRole);
        } else {
            Role studentRole = roleRepository.findByName(RoleType.ROLE_STUDENT)
                    .orElseGet(() -> roleRepository.save(Role.builder().name(RoleType.ROLE_STUDENT).build()));
            roles.add(studentRole);
        }

        User user = User.builder()
                .fullName(request.getFullName().trim())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .active(true)
                .roles(roles)
                .build();

        User savedUser = userRepository.save(user);

        // Auto-create initial profile for students
        boolean isStudent = roles.stream().anyMatch(r -> r.getName() == RoleType.ROLE_STUDENT);
        if (isStudent) {
            StudentProfile profile = StudentProfile.builder()
                    .user(savedUser)
                    .educationLevel("Undergraduate")
                    .subjectsOfInterest("Computer Science, Artificial Intelligence")
                    .currentSkills("Basics")
                    .learningGoals("Master modern full-stack development and AI")
                    .build();
            profileRepository.save(profile);
        }

        return authenticateUser(request.getEmail(), request.getPassword());
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        return authenticateUser(request.getEmail(), request.getPassword());
    }

    @Transactional
    public AuthResponse authenticateUser(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email.toLowerCase().trim(), password)
        );

        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal)) {
            throw new BadRequestException("Authentication failed: invalid user credentials");
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        if (userPrincipal.getId() == null) {
            throw new BadRequestException("Authentication failed: user identifier is missing");
        }

        // Verify user exists in database; fail with clear authentication error before creating tokens
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new BadRequestException("Authentication failed: user record not found"));

        String accessToken = jwtService.generateToken(authentication);
        RefreshToken refreshToken = createRefreshToken(user);

        boolean onboardingCompleted = user.getStudentProfile() != null &&
                user.getStudentProfile().getLearningGoals() != null &&
                !user.getStudentProfile().getLearningGoals().isBlank();

        UserSummaryDto summary = UserSummaryDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toList()))
                .onboardingCompleted(onboardingCompleted)
                .build();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .expiresIn(jwtService.getExpirationMs())
                .user(summary)
                .build();
    }

    @Transactional
    public RefreshToken createRefreshToken(User user) {
        if (user == null || user.getId() == null) {
            throw new BadRequestException("Cannot create refresh token: user is null or not persisted");
        }

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshExpirationMs))
                .revoked(false)
                .build();

        RefreshToken savedToken = refreshTokenRepository.save(refreshToken);
        return savedToken != null ? savedToken : refreshToken;
    }

    @Transactional
    public TokenRefreshResponse refreshAccessToken(TokenRefreshRequest request) {
        RefreshToken token = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new BadRequestException("Invalid refresh token"));

        if (token.isRevoked() || token.getExpiryDate().isBefore(Instant.now())) {
            throw new BadRequestException("Refresh token was expired or revoked. Please log in again");
        }

        User user = token.getUser();
        if (user == null || user.getId() == null) {
            throw new BadRequestException("Refresh token is not associated with a valid user");
        }

        // Revoke the specific token being rotated
        token.setRevoked(true);
        refreshTokenRepository.save(token);

        // Issue new rotated token
        RefreshToken newRefreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshExpirationMs))
                .revoked(false)
                .build();
        refreshTokenRepository.save(newRefreshToken);

        String newAccessToken = jwtService.generateTokenFromUsername(user.getEmail(), user.getId());

        return TokenRefreshResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken.getToken())
                .tokenType("Bearer")
                .build();
    }

    @Transactional
    public void logout(Long userId) {
        if (userId != null) {
            userRepository.findById(userId).ifPresent(user -> {
                List<RefreshToken> activeTokens = refreshTokenRepository.findActiveTokensByUser(user);
                for (RefreshToken t : activeTokens) {
                    t.setRevoked(true);
                }
                refreshTokenRepository.saveAll(activeTokens);
            });
        }
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal)) {
            throw new BadRequestException("Not authenticated");
        }
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
