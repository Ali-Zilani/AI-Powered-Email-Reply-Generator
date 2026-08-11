package com.email.email_assistant.service;

import com.email.email_assistant.dto.EmailRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
public class EmailService {
    private final WebClient webClient;
    private final String apiKey;
    public EmailService(WebClient.Builder webClientBuilder,
                        @Value("${gemini.api.url}") String baseUrl,
                        @Value("${gemini.api.key}") String geminiApiKey) {
        this.apiKey = geminiApiKey;
        this.webClient = webClientBuilder.baseUrl(baseUrl).build();
    }

    public String generateEmailReply(EmailRequest emailRequest) {
        //Build Prompt
        String prompt = buildPrompt(emailRequest);
        //Prepare Request JSON Body
        String requestBody = buildRequestBody(prompt);
        //Send Request to google server using gemini url
        String response = webClient.post()
                .uri(uriBuilder -> uriBuilder.path("/v1beta/models/gemini-flash-latest:generateContent").build())
                .header("X-goog-api-key", apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        //Extract Response
        return extractResponseContent(response);
    }

    public String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("You are a professional email assistant. Your job is to write a single, clean email reply.\n\n");

        prompt.append("STRICT RULES — follow every one of them:\n");
        prompt.append("- Write exactly ONE reply. Do not provide multiple options or alternatives.\n");
        prompt.append("- Length: medium — 80 to 150 words. Not too short, not too long.\n");
        prompt.append("- Output ONLY the raw email text (subject line if needed, greeting, body, sign-off).\n");
        prompt.append("- Do NOT include a Subject line. Start directly with the greeting (e.g. Dear ...).\n");
        prompt.append("- Do NOT include any commentary, tips, explanations, or notes before or after the email.\n");
        prompt.append("- Do NOT use markdown formatting like **, ***, ###, or bullet points.\n");
        prompt.append("- Do NOT add placeholder text like [Your Phone Number] or [Your LinkedIn].\n");
        prompt.append("- Use plain professional paragraph text. Natural line breaks between sections only.\n");
        prompt.append("- Sign off simply with: Best regards,\\nYour Name\n\n");

        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            prompt.append("Tone: ").append(emailRequest.getTone()).append("\n\n");
        } else {
            prompt.append("Tone: professional\n\n");
        }

        prompt.append("Original Email to reply to:\n");
        prompt.append(emailRequest.getEmailContent());

        return prompt.toString();
    }

    public String buildRequestBody(String prompt) {
        try {
            ObjectMapper mapper = new ObjectMapper();

            // ObjectMapper.writeValueAsString() handles all escaping automatically
            String escapedPrompt = mapper.writeValueAsString(prompt);
            // ^ this returns "your prompt here" with quotes, so strip them:
            escapedPrompt = escapedPrompt.substring(1, escapedPrompt.length() - 1);

            return String.format("""
                {
                    "contents": [
                      {
                        "parts": [
                          {
                            "text": "%s"
                          }
                        ]
                      }
                    ]
                }
                """, escapedPrompt);
        } catch (Exception e) {
            throw new RuntimeException("Failed to build request body", e);
        }
    }

    public String extractResponseContent(String response){
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            return root.path("candidates") // it's called JSON Navigation
                    .path(0)
                    .path("content")
                    .path("parts")
                    .path(0)
                    .path("text")
                    .asText();
        } catch (Exception e) {
            return "Error parsing email reply response: " + e.getMessage();
        }
    }

}
