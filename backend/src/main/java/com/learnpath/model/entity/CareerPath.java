package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "career_paths")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerPath {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String title; // "Backend Engineer", "Data Scientist", "Full-Stack Developer"

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(length = 100)
    @Builder.Default
    private String averageSalaryRange = "$85,000 - $135,000";

    @Column(length = 50)
    @Builder.Default
    private String industryDemand = "VERY_HIGH";

    @Column(length = 50)
    @Builder.Default
    private String icon = "Server";

    @OneToMany(mappedBy = "careerPath", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CareerRequirement> requirements = new ArrayList<>();

    @OneToMany(mappedBy = "careerPath", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PortfolioProject> portfolioProjects = new ArrayList<>();
}
