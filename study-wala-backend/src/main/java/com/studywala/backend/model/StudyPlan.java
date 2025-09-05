package com.studywala.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.util.List;

@Data
@Document(collection = "study_plans")
public class StudyPlan {
    @Id
    private String id;
    private String title;
    private String description;
    private String userId;
    private LocalDate startDate;
    private LocalDate endDate;
    @DBRef
    private List<Subject> subjects;
    @DBRef
    private List<Topic> topics;
    private int totalHours;
    private int completedHours;
    private String status; // ACTIVE, COMPLETED, ARCHIVED
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getUserId() {
        return this.userId;
    }
}
