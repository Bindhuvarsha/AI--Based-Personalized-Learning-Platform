package com.learnpath.controller;

import com.learnpath.dto.CertificateDtos.*;
import com.learnpath.model.entity.User;
import com.learnpath.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/certificates", "/api/v1/certificates"})
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;
    private final com.learnpath.service.AuthService authService;

    @GetMapping("/my-certificates")
    public ResponseEntity<List<CertificateDto>> getMyCertificates() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(certificateService.getMyCertificates(user));
    }

    @PostMapping("/claim")
    public ResponseEntity<CertificateDto> claimCertificate(@RequestBody ClaimCertificateRequest request) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(certificateService.claimCertificate(user, request));
    }

    @GetMapping("/verify/{certificateId}")
    public ResponseEntity<VerifyCertificateResponse> verifyCertificate(
            @PathVariable String certificateId
    ) {
        return ResponseEntity.ok(certificateService.verifyCertificate(certificateId));
    }
}
