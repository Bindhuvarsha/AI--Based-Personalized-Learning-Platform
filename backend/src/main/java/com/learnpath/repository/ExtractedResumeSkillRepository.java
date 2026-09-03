package com.learnpath.repository;

import com.learnpath.model.entity.ExtractedResumeSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExtractedResumeSkillRepository extends JpaRepository<ExtractedResumeSkill, Long> {
    List<ExtractedResumeSkill> findByResumeDocumentId(Long resumeDocumentId);
}
