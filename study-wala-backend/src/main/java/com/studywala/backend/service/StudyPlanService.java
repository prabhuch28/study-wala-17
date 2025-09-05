package com.studywala.backend.service;

import com.studywala.backend.dto.StudyPlanRequest;
import com.studywala.backend.dto.StudyPlanResponse;
import com.studywala.backend.exception.ResourceNotFoundException;
import com.studywala.backend.model.StudyPlan;
import com.studywala.backend.repository.StudyPlanRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyPlanService {

    private final StudyPlanRepository studyPlanRepository;
    private final AIService aiService;
    private final ModelMapper modelMapper;

    public StudyPlanResponse createStudyPlan(StudyPlanRequest request, String userId) {
        // Generate study plan using AI
        String aiResponse = aiService.generateStudyPlan(createAIPrompt(request));
        
        // Parse AI response and create study plan
        StudyPlan studyPlan = parseAIResponse(aiResponse);
        studyPlan.setUserId(userId);
        
        StudyPlan savedPlan = studyPlanRepository.save(studyPlan);
        return convertToDto(savedPlan);
    }

    public StudyPlanResponse getStudyPlan(String id, String userId) {
        StudyPlan studyPlan = studyPlanRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Study plan not found"));
        return convertToDto(studyPlan);
    }

    public List<StudyPlanResponse> getUserStudyPlans(String userId) {
        return studyPlanRepository.findByUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public void deleteStudyPlan(String id, String userId) {
        if (!studyPlanRepository.existsByIdAndUserId(id, userId)) {
            throw new ResourceNotFoundException("Study plan not found");
        }
        studyPlanRepository.deleteById(id);
    }

    private String createAIPrompt(StudyPlanRequest request) {
        return String.format(
            "Create a study plan with title: %s, description: %s, subjects: %s, " +
            "start date: %s, end date: %s, hours per day: %d",
            request.getTitle(),
            request.getDescription(),
            String.join(", ", request.getSubjectIds()),
            request.getStartDate(),
            request.getEndDate(),
            request.getHoursPerDay()
        );
    }

    private StudyPlan parseAIResponse(String aiResponse) {
        // Parse the AI response and convert it to StudyPlan entity
        // This is a simplified version - you'll need to implement proper parsing
        // based on your AI response format
        StudyPlan studyPlan = new StudyPlan();
        // Parse and set fields from aiResponse
        return studyPlan;
    }

    private StudyPlanResponse convertToDto(StudyPlan studyPlan) {
        return modelMapper.map(studyPlan, StudyPlanResponse.class);
    }
}
