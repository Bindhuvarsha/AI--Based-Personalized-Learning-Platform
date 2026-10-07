package com.learnpath.service;

import com.learnpath.dto.CertificateDtos.*;
import com.learnpath.exception.BadRequestException;
import com.learnpath.exception.ResourceNotFoundException;
import com.learnpath.model.entity.Certificate;
import com.learnpath.model.entity.User;
import com.learnpath.repository.CertificateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CertificateService {

    private final CertificateRepository certificateRepository;

    @Transactional(readOnly = true)
    public List<CertificateDto> getMyCertificates(User user) {
        return certificateRepository.findByUserIdOrderByIssueDateDesc(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CertificateDto claimCertificate(User user, ClaimCertificateRequest req) {
        if (req.getCourseTitle() == null || req.getCourseTitle().trim().isEmpty()) {
            throw new BadRequestException("Course title is required to issue certificate");
        }

        double score = req.getScore() != null ? req.getScore() : 85.0;
        String grade = calculateGrade(score);

        String certId = "LP-CERT-" + LocalDateTime.now().getYear() + "-"
                + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        LocalDateTime issueDate = LocalDateTime.now();
        String skillsStr = (req.getSkills() != null && !req.getSkills().isEmpty())
                ? String.join(", ", req.getSkills())
                : "Full-Stack Development, Problem Solving, AI Integration";

        String recipientName = (user.getFullName() != null && !user.getFullName().trim().isEmpty())
                ? user.getFullName()
                : user.getEmail();

        String rawPayload = certId + ":" + user.getEmail() + ":" + req.getCourseTitle() + ":" + score + ":"
                + issueDate.format(DateTimeFormatter.ISO_DATE_TIME);
        String hash = computeSha256(rawPayload);

        Certificate certificate = Certificate.builder()
                .certificateId(certId)
                .user(user)
                .recipientName(recipientName)
                .courseTitle(req.getCourseTitle())
                .score(score)
                .grade(grade)
                .skillsAcquired(skillsStr)
                .verificationHash(hash)
                .issueDate(issueDate)
                .status("VERIFIED")
                .build();

        Certificate saved = certificateRepository.save(certificate);
        log.info("Certificate issued: {} for user: {}", certId, user.getEmail());
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public VerifyCertificateResponse verifyCertificate(String certificateId) {
        Certificate cert = certificateRepository.findByCertificateId(certificateId.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Certificate with ID " + certificateId + " was not found in the accreditation registry."));

        boolean isValid = "VERIFIED".equalsIgnoreCase(cert.getStatus());

        return VerifyCertificateResponse.builder()
                .certificateId(cert.getCertificateId())
                .recipientName(cert.getRecipientName())
                .courseTitle(cert.getCourseTitle())
                .score(cert.getScore())
                .grade(cert.getGrade())
                .skillsAcquired(cert.getSkillsAcquired())
                .verificationHash(cert.getVerificationHash())
                .issueDate(cert.getIssueDate())
                .status(cert.getStatus())
                .isValid(isValid)
                .issuer("LearnPath AI Academic Accreditation Authority")
                .build();
    }

    private String calculateGrade(double score) {
        if (score >= 90) return "Distinction (High Honors)";
        if (score >= 80) return "First Class with Distinction";
        if (score >= 70) return "First Class";
        return "Pass with Merit";
    }

    private String computeSha256(String data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder(2 * encodedHash.length);
            for (byte b : encodedHash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            return UUID.randomUUID().toString().replace("-", "");
        }
    }

    private CertificateDto mapToDto(Certificate c) {
        return CertificateDto.builder()
                .id(c.getId())
                .certificateId(c.getCertificateId())
                .recipientName(c.getRecipientName())
                .courseTitle(c.getCourseTitle())
                .score(c.getScore())
                .grade(c.getGrade())
                .skillsAcquired(c.getSkillsAcquired())
                .verificationHash(c.getVerificationHash())
                .issueDate(c.getIssueDate())
                .status(c.getStatus())
                .verificationUrl("/verify/" + c.getCertificateId())
                .build();
    }
}
