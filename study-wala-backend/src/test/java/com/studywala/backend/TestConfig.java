package com.studywala.backend;

import com.studywala.backend.security.JwtTokenProvider;
import com.studywala.backend.service.AIService;
import com.studywala.backend.service.StudyPlanService;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@TestConfiguration
public class TestConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtTokenProvider jwtTokenProvider() {
        return new JwtTokenProvider();
    }

    @Bean
    public AIService aiService() {
        return new AIService();
    }

    @Bean
    public StudyPlanService studyPlanService() {
        return new StudyPlanService(null, aiService(), null);
    }
}
