package com.studywala.backend.repository;

import com.studywala.backend.model.Topic;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TopicRepository extends MongoRepository<Topic, String> {
    List<Topic> findBySubjectId(String subjectId);
    List<Topic> findBySubjectIdIn(List<String> subjectIds);
    List<Topic> findBySubjectIdAndCompleted(String subjectId, boolean completed);
}
