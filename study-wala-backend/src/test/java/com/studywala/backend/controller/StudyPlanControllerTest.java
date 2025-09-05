package com.studywala.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studywala.backend.dto.StudyPlanRequest;
import com.studywala.backend.model.StudyPlan;
import com.studywala.backend.security.JwtTokenProvider;
import com.studywala.backend.security.UserPrincipal;
import com.studywala.backend.service.StudyPlanService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StudyPlanController.class)
class StudyPlanControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudyPlanService studyPlanService;

    @MockBean
    private JwtTokenProvider tokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private WebApplicationContext context;

    private String jwtToken;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        UserPrincipal userPrincipal = UserPrincipal.create(
                "user1",
                "test@example.com",
                "password",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
        
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userPrincipal, null, userPrincipal.getAuthorities());
        
        when(tokenProvider.validateToken(anyString())).thenReturn(true);
        when(tokenProvider.getUsernameFromJWT(anyString())).thenReturn("testuser");
        
        jwtToken = "Bearer test.jwt.token";
    }

    @Test
    void createStudyPlan_ShouldReturnCreated() throws Exception {
        StudyPlanRequest request = new StudyPlanRequest();
        request.setTitle("Test Plan");
        request.setDescription("Test Description");
        request.setSubjectIds(List.of("subj1", "subj2"));
        request.setStartDate(LocalDate.now());
        request.setEndDate(LocalDate.now().plusDays(7));
        request.setHoursPerDay(2);

        StudyPlan createdPlan = new StudyPlan();
        createdPlan.setId("plan1");
        createdPlan.setTitle(request.getTitle());
        createdPlan.setDescription(request.getDescription());
        createdPlan.setUserId("user1");

        when(studyPlanService.createStudyPlan(any(StudyPlanRequest.class), anyString()))
                .thenReturn(createdPlan);

        mockMvc.perform(post("/api/study-plans")
                .header("Authorization", jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("plan1"))
                .andExpect(jsonPath("$.title").value("Test Plan"));
    }

    @Test
    void getStudyPlan_WhenPlanExists_ShouldReturnPlan() throws Exception {
        StudyPlan plan = new StudyPlan();
        plan.setId("plan1");
        plan.setTitle("Test Plan");
        plan.setUserId("user1");

        when(studyPlanService.getStudyPlan("plan1", "user1")).thenReturn(plan);

        mockMvc.perform(get("/api/study-plans/plan1")
                .header("Authorization", jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("plan1"))
                .andExpect(jsonPath("$.title").value("Test Plan"));
    }

    @Test
    void getUserStudyPlans_ShouldReturnUserPlans() throws Exception {
        StudyPlan plan1 = new StudyPlan();
        plan1.setId("plan1");
        plan1.setTitle("Plan 1");
        plan1.setUserId("user1");

        StudyPlan plan2 = new StudyPlan();
        plan2.setId("plan2");
        plan2.setTitle("Plan 2");
        plan2.setUserId("user1");

        when(studyPlanService.getUserStudyPlans("user1"))
                .thenReturn(List.of(plan1, plan2));

        mockMvc.perform(get("/api/study-plans")
                .header("Authorization", jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value("plan1"))
                .andExpect(jsonPath("$[1].id").value("plan2"));
    }

    @Test
    void deleteStudyPlan_WhenPlanExists_ShouldReturnNoContent() throws Exception {
        when(studyPlanService.existsByIdAndUserId("plan1", "user1")).thenReturn(true);

        mockMvc.perform(delete("/api/study-plans/plan1")
                .header("Authorization", jwtToken))
                .andExpect(status().isNoContent());
    }
}
