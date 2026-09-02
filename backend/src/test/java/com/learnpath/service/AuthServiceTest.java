package com.learnpath.service;

import com.learnpath.dto.AuthDtos.*;
import com.learnpath.model.entity.Role;
import com.learnpath.model.entity.User;
import com.learnpath.model.enums.RoleType;
import com.learnpath.repository.RefreshTokenRepository;
import com.learnpath.repository.RoleRepository;
import com.learnpath.repository.StudentProfileRepository;
import com.learnpath.repository.UserRepository;
import com.learnpath.security.JwtService;
import com.learnpath.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private StudentProfileRepository profileRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;
    private Role studentRole;

    @BeforeEach
    void setUp() {
        studentRole = Role.builder().id(1L).name(RoleType.ROLE_STUDENT).build();
        sampleUser = User.builder()
                .id(10L)
                .email("test@example.com")
                .password("encoded_pass")
                .fullName("Test Learner")
                .active(true)
                .roles(Set.of(studentRole))
                .build();
    }

    @Test
    void testRegisterNewStudentSuccess() {
        RegisterRequest request = RegisterRequest.builder()
                .fullName("Test Learner")
                .email("test@example.com")
                .password("Password123")
                .role("STUDENT")
                .build();

        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(roleRepository.findByName(RoleType.ROLE_STUDENT)).thenReturn(Optional.of(studentRole));
        when(passwordEncoder.encode("Password123")).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(userRepository.findById(10L)).thenReturn(Optional.of(sampleUser));

        UserPrincipal principal = UserPrincipal.create(sampleUser);
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(jwtService.generateToken(any())).thenReturn("mock_jwt_token");
        when(jwtService.getExpirationMs()).thenReturn(86400000L);

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mock_jwt_token", response.getAccessToken());
        assertEquals("test@example.com", response.getUser().getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }
}
