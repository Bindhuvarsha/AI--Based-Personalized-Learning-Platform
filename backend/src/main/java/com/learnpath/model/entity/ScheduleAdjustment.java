package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "schedule_adjustments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleAdjustment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDate originalDate;

    private LocalDate newDate;

    @Column(nullable = false, length = 255)
    private String reason; // e.g. "Auto-rescheduled due to missed session on Thursday"

    @Builder.Default
    private LocalDateTime adjustedAt = LocalDateTime.now();
}
