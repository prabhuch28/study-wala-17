package com.studywala.backend.dto;

import com.studywala.backend.model.Subject;
import com.studywala.backend.model.Topic;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class StudyPlanResponse {
    private String id;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<Subject> subjects;
    private List<Topic> topics;
    private int totalHours;
    private int completedHours;
    private String status;
}
