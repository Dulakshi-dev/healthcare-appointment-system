package com.healthcare.appointment.service;

import com.healthcare.appointment.dto.GroqRequest;
import com.healthcare.appointment.dto.GroqResponse;
import com.healthcare.appointment.entity.Appointment;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class AiSummaryService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateSummary(Appointment appointment) {
        String prompt = buildPrompt(appointment);

        GroqRequest requestBody = new GroqRequest(
                model,
                List.of(
                        new GroqRequest.Message("system",
                                "You are a clinical assistant. Write a concise, professional 2-3 sentence appointment summary for a clinician to quickly review. Do not invent facts not provided."),
                        new GroqRequest.Message("user", prompt)
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<GroqRequest> entity = new HttpEntity<>(requestBody, headers);

        GroqResponse response = restTemplate.postForObject(apiUrl, entity, GroqResponse.class);

        if (response == null || response.getChoices() == null || response.getChoices().isEmpty()) {
            throw new RuntimeException("AI summary generation failed: empty response from Groq");
        }

        return response.getChoices().get(0).getMessage().getContent();
    }

    private String buildPrompt(Appointment appointment) {
        return String.format(
                "Patient: %s %s, Date of Birth: %s, Gender: %s. " +
                "Appointment date: %s at %s. Reason: %s. Status: %s. Notes: %s.",
                appointment.getPatient().getFirstName(),
                appointment.getPatient().getLastName(),
                appointment.getPatient().getDateOfBirth(),
                appointment.getPatient().getGender(),
                appointment.getDate(),
                appointment.getTime(),
                appointment.getReason(),
                appointment.getStatus(),
                appointment.getNotes() == null || appointment.getNotes().isBlank() ? "None" : appointment.getNotes()
        );
    }
}