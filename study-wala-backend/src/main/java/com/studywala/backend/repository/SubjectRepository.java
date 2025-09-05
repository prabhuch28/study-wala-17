package com.studywala.backend.repository;

import com.studywala.backend.model.Subject;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface SubjectRepository extends MongoRepository<Subject, String> {
    List<Subject> findByUserId(String userId);
    Optional<Subject> findByIdAndUserId(String id, String userId);
    boolean existsByIdAndUserId(String id, String userId);
}
