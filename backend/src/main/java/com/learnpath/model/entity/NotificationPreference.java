package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notification_preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Builder.Default
    private Boolean inAppAlerts = true;

    @Builder.Default
    private Boolean emailAlerts = false;

    @Column(length = 20)
    @Builder.Default
    private String warningThreshold = "MEDIUM"; // LOW, MEDIUM, HIGH
}
