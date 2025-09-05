package com.studywala.backend.service;

import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@TestPropertySource(properties = {
    "openai.api.key=test-api-key",
    "openai.model=gpt-4o",
    "openai.timeout.seconds=60"
})
class AIServiceTest {

    @Mock
    private OpenAiService openAiService;

    private AIService aiService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        aiService = new AIService("test-api-key", "gpt-4o", 60);
        aiService.setOpenAiService(openAiService); // Inject mock
    }

    @Test
    void generateStudyPlan_ShouldReturnFormattedResponse() {
        // Arrange
        String prompt = "Create a study plan for Java programming";
        String expectedResponse = "{\"title\":\"Java Programming Study Plan\",\"description\":\"A comprehensive study plan for Java\"}";
        
        ChatCompletionResult mockResult = mock(ChatCompletionResult.class);
        ChatMessage mockMessage = new ChatMessage();
        mockMessage.setContent(expectedResponse);
        
        when(mockResult.getChoices()).thenReturn(List.of(
            new ChatCompletionResult.Choice() {{
                setMessage(mockMessage);
                setFinishReason("stop");
            }}
        ));
        
        when(openAiService.createChatCompletion(any(ChatCompletionRequest.class)))
            .thenReturn(mockResult);

        // Act
        String result = aiService.generateStudyPlan(prompt);

        // Assert
        assertNotNull(result);
        assertEquals(expectedResponse, result);
        
        // Verify the correct parameters were passed to the OpenAI service
        ArgumentCaptor<ChatCompletionRequest> captor = ArgumentCaptor.forClass(ChatCompletionRequest.class);
        verify(openAiService).createChatCompletion(captor.capture());
        
        ChatCompletionRequest request = captor.getValue();
        assertEquals("gpt-4o", request.getModel());
        assertFalse(request.getMessages().isEmpty());
        assertTrue(request.getMessages().get(0).getContent().contains(prompt));
    }

    @Test
    void generateStudyGuide_ShouldReturnFormattedResponse() {
        // Arrange
        String topic = "Object-Oriented Programming";
        String expectedResponse = "{\"title\":\"OOP Study Guide\",\"sections\":[{\"title\":\"Encapsulation\"}]}";
        
        ChatCompletionResult mockResult = mock(ChatCompletionResult.class);
        ChatMessage mockMessage = new ChatMessage();
        mockMessage.setContent(expectedResponse);
        
        when(mockResult.getChoices()).thenReturn(List.of(
            new ChatCompletionResult.Choice() {{
                setMessage(mockMessage);
                setFinishReason("stop");
            }}
        ));
        
        when(openAiService.createChatCompletion(any(ChatCompletionRequest.class)))
            .thenReturn(mockResult);

        // Act
        String result = aiService.generateStudyGuide(topic, 5);

        // Assert
        assertNotNull(result);
        assertEquals(expectedResponse, result);
        
        // Verify the correct parameters were passed to the OpenAI service
        ArgumentCaptor<ChatCompletionRequest> captor = ArgumentCaptor.forClass(ChatCompletionRequest.class);
        verify(openAiService).createChatCompletion(captor.capture());
        
        ChatCompletionRequest request = captor.getValue();
        assertEquals("gpt-4o", request.getModel());
        assertFalse(request.getMessages().isEmpty());
        assertTrue(request.getMessages().get(0).getContent().contains(topic));
    }

    @Test
    void getOpenAiService_ShouldReturnCachedInstance() {
        // Act
        OpenAiService service1 = aiService.getOpenAiService();
        OpenAiService service2 = aiService.getOpenAiService();

        // Assert
        assertNotNull(service1);
        assertSame(service1, service2, "Should return the same instance");
    }

    @Test
    void testDefaultConstructor() {
        // This test ensures the default constructor works with environment variables
        AIService defaultService = new AIService();
        assertNotNull(defaultService);
    }
}
