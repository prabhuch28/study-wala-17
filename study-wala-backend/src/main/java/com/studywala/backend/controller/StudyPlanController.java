package com.studywala.backend.controller;

import com.studywala.backend.dto.StudyPlanRequest;
import com.studywala.backend.dto.StudyPlanResponse;
import com.studywala.backend.service.StudyPlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/study-plans")
@RequiredArgsConstructor
@Tag(name = "Study Plans", description = "APIs for managing study plans")
public class StudyPlanController {

    private final StudyPlanService studyPlanService;

    @PostMapping
    @Operation(summary = "Create a new study plan")
    public ResponseEntity<StudyPlanResponse> createStudyPlan(
            @Valid @RequestBody StudyPlanRequest request,
            Principal principal) {
        StudyPlanResponse response = studyPlanService.createStudyPlan(request, principal.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a study plan by ID")
    public ResponseEntity<StudyPlanResponse> getStudyPlan(
            @PathVariable String id,
            Principal principal) {
        StudyPlanResponse response = studyPlanService.getStudyPlan(id, principal.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get all study plans for the current user")
    public ResponseEntity<List<StudyPlanResponse>> getUserStudyPlans(Principal principal) {
        List<StudyPlanResponse> responses = studyPlanService.getUserStudyPlans(principal.getName());
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a study plan")
    public ResponseEntity<Void> deleteStudyPlan(
            @PathVariable String id,
            Principal principal) {
        studyPlanService.deleteStudyPlan(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}
