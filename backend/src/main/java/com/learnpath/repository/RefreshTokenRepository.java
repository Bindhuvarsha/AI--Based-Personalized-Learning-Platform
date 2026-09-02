package com.learnpath.repository;

import com.learnpath.model.entity.RefreshToken;
import com.learnpath.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByUserAndRevokedFalse(User user);

    @Modifying
    int deleteByUser(User user);
}
