package com.learnpath.repository;

import com.learnpath.model.entity.DocumentChunk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentChunkRepository extends JpaRepository<DocumentChunk, Long> {
    List<DocumentChunk> findByUserId(Long userId);
    List<DocumentChunk> findByUserIdAndDocumentTitle(Long userId, String documentTitle);
    void deleteByUserIdAndDocumentTitle(Long userId, String documentTitle);
}
