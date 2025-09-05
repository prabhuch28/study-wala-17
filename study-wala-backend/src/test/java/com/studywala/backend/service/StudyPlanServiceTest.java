package com.studywala.backend.service;

import com.studywala.backend.dto.StudyPlanRequest;
import com.studywala.backend.model.StudyPlan;
import com.studywala.backend.model.Subject;
import com.studywala.backend.model.Topic;
import com.studywala.backend.repository.StudyPlanRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class StudyPlanServiceTest {

    @Mock
    private StudyPlanRepository studyPlanRepository;

    @Mock
    private AIService aiService;

    @InjectMocks
    private StudyPlanService studyPlanService;

    private final ModelMapper modelMapper = new ModelMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        studyPlanService = new StudyPlanService(studyPlanRepository, aiService, modelMapper);
    }

    @Test
    void createStudyPlan_ShouldReturnCreatedStudyPlan() {
        // Arrange
        StudyPlanRequest request = new StudyPlanRequest();
        request.setTitle("Test Plan");
        request.setDescription("Test Description");
        request.setSubjectIds(Arrays.asList("subj1", "subj2"));
        request.setStartDate(LocalDate.now());
        request.setEndDate(LocalDate.now().plusDays(7));
        request.setHoursPerDay(2);

        StudyPlan savedPlan = new StudyPlan();
        savedPlan.setId("plan1");
        savedPlan.setTitle(request.getTitle());
        savedPlan.setDescription(request.getDescription());

        when(aiService.generateStudyPlan(anyString())).thenReturn("{\"title\":\"Test Plan\",\"description\":\"Test Description\"}");
        when(studyPlanRepository.save(any(StudyPlan.class))).thenReturn(savedPlan);

        // Act
        var result = studyPlanService.createStudyPlan(request, "user1");

        // Assert
        assertNotNull(result);
        assertEquals("plan1", result.getId());
        assertEquals("Test Plan", result.getTitle());
        verify(studyPlanRepository, times(1)).save(any(StudyPlan.class));
    }

    @Test
    void getStudyPlan_WhenPlanExists_ShouldReturnPlan() {
        // Arrange
        String planId = "plan1";
        String userId = "user1";
        StudyPlan plan = new StudyPlan();
        plan.setId(planId);
        plan.setUserId(userId);
        plan.setTitle("Test Plan");

        when(studyPlanRepository.findByIdAndUserId(planId, userId)).thenReturn(Optional.of(plan));

        // Act
        var result = studyPlanService.getStudyPlan(planId, userId);

        // Assert
        assertNotNull(result);
        assertEquals(planId, result.getId());
        assertEquals("Test Plan", result.getTitle());
    }

    @Test
    void getUserStudyPlans_ShouldReturnUserPlans() {
        // Arrange
        String userId = "user1";
        StudyPlan plan1 = new StudyPlan();
        plan1.setId("plan1");
        plan1.setUserId(userId);
        plan1.setTitle("Plan 1");

        StudyPlan plan2 = new StudyPlan();
        plan2.setId("plan2");
        plan2.setUserId(userId);
        plan2.setTitle("Plan 2");

        when(studyPlanRepository.findByUserId(userId)).thenReturn(Arrays.asList(plan1, plan2));

        // Act
        var result = studyPlanService.getUserStudyPlans(userId);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Plan 1", result.get(0).getTitle());
        assertEquals("Plan 2", result.get(1).getTitle());
    }

    @Test
    void deleteStudyPlan_WhenPlanExists_ShouldDeletePlan() {
        // Arrange
        String planId = "plan1";
        String userId = "user1";
        StudyPlan plan = new StudyPlan();
        plan.setId(planId);
        plan.setUserId(userId);

        when(studyPlanRepository.existsByIdAndUserId(planId, userId)).thenReturn(true);

        // Act
        studyPlanService.deleteStudyPlan(planId, userId);

        // Assert
        verify(studyPlanRepository, times(1)).deleteById(planId);
    }
}
