package com.studywala.backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class StudyPlanRequest {
    private String title;
    private String description;
    private List<String> subjectIds;
    private LocalDate startDate;
    private LocalDate endDate;
    private int hoursPerDay;
}
