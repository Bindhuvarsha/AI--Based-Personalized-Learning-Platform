package com.learnpath.repository;

import com.learnpath.model.entity.Certificate;
import com.learnpath.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    Optional<Certificate> findByCertificateId(String certificateId);
    List<Certificate> findByUserOrderByIssueDateDesc(User user);
    List<Certificate> findByUserIdOrderByIssueDateDesc(Long userId);
    boolean existsByCertificateId(String certificateId);
}
