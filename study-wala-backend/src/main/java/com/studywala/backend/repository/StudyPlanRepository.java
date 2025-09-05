package com.studywala.backend.repository;

import com.studywala.backend.model.StudyPlan;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface StudyPlanRepository extends MongoRepository<StudyPlan, String> {
    List<StudyPlan> findByUserId(String userId);
    Optional<StudyPlan> findByIdAndUserId(String id, String userId);
    boolean existsByIdAndUserId(String id, String userId);
}
