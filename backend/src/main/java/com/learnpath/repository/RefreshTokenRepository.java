package com.learnpath.repository;

import com.learnpath.model.entity.RefreshToken;
import com.learnpath.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    @Query("SELECT t FROM RefreshToken t WHERE t.user = :user AND t.revoked = false ORDER BY t.expiryDate DESC")
    List<RefreshToken> findActiveTokensByUser(@Param("user") User user);

    @Query("SELECT t FROM RefreshToken t WHERE t.user = :user AND t.revoked = false")
    Optional<RefreshToken> findByUserAndRevokedFalse(@Param("user") User user);
}
