package com.studywala.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "topics")
public class Topic {
    @Id
    private String id;
    private String name;
    private String subjectId;
    private int estimatedHours;
    private int priority;
    private boolean completed;
}
