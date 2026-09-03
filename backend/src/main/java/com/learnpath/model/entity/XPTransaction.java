package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "xp_transactions", indexes = {
    @Index(name = "idx_xp_idempotency", columnList = "idempotencyKey", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class XPTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer xpAmount;

    @Column(nullable = false, length = 100)
    private String reason;

    @Column(nullable = false, unique = true, length = 100)
    private String idempotencyKey;

    @Builder.Default
    private LocalDateTime awardedAt = LocalDateTime.now();
}
