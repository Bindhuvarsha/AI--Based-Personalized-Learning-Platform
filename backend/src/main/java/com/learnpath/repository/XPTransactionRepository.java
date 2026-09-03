package com.learnpath.repository;

import com.learnpath.model.entity.XPTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface XPTransactionRepository extends JpaRepository<XPTransaction, Long> {
    List<XPTransaction> findByUserIdOrderByAwardedAtDesc(Long userId);
    Optional<XPTransaction> findByIdempotencyKey(String idempotencyKey);

    @Query("SELECT COALESCE(SUM(x.xpAmount), 0) FROM XPTransaction x WHERE x.user.id = :userId")
    Integer sumXpByUserId(@Param("userId") Long userId);
}
