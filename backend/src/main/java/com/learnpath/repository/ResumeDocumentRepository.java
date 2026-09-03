package com.learnpath.repository;

import com.learnpath.model.entity.ResumeDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeDocumentRepository extends JpaRepository<ResumeDocument, Long> {
    List<ResumeDocument> findByUserIdOrderByUploadedAtDesc(Long userId);
}
