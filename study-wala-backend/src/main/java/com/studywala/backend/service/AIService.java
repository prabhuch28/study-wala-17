package com.studywala.backend.service;

import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatMessageRole;
import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIService {

    @Value("${openai.api.key}")
    private String openAiApiKey;

    public String generateStudyPlan(String prompt) {
        OpenAiService service = new OpenAiService(openAiApiKey, Duration.ofSeconds(60));

        List<ChatMessage> messages = new ArrayList<>();
        ChatMessage systemMessage = new ChatMessage(
                ChatMessageRole.SYSTEM.value(),
                "You are an AI study planner. Generate a personalized study plan based on the user's input. " +
                "Return the response in a structured JSON format with title, description, subjects, and weekly schedule."
        );
        messages.add(systemMessage);
        messages.add(new ChatMessage(ChatMessageRole.USER.value(), prompt));

        ChatCompletionRequest completionRequest = ChatCompletionRequest.builder()
                .model("gpt-4o")
                .messages(messages)
                .temperature(0.7)
                .maxTokens(2000)
                .build();

        return service.createChatCompletion(completionRequest)
                .getChoices()
                .get(0)
                .getMessage()
                .getContent();
    }
}
