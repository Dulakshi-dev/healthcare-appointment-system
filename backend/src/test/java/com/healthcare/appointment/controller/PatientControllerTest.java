package com.healthcare.appointment.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.healthcare.appointment.controller.PatientController;
import com.healthcare.appointment.entity.Patient;
import com.healthcare.appointment.service.PatientService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.ArgumentMatchers.any;
import java.time.LocalDate;
import java.util.List;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PatientController.class)
class PatientControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PatientService patientService;

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    private Patient samplePatient() {
        Patient p = new Patient();
        p.setId(1L);
        p.setFirstName("Nimal");
        p.setLastName("Perera");
        p.setDateOfBirth(LocalDate.of(1990, 1, 1));
        p.setGender("Male");
        p.setPhone("0771234567");
        p.setEmail("nimal@example.com");
        p.setAddress("Colombo");
        return p;
    }

    @Test
    void getAllPatients_returns200AndList() throws Exception {
        when(patientService.getAllPatients()).thenReturn(List.of(samplePatient()));

        mockMvc.perform(get("/api/patients"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].firstName").value("Nimal"));
    }

    @Test
    void getPatientById_returns200() throws Exception {
        when(patientService.getPatientById(1L)).thenReturn(samplePatient());

        mockMvc.perform(get("/api/patients/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lastName").value("Perera"));
    }

    @Test
    void createPatient_withValidBody_returns201() throws Exception {
        Patient input = samplePatient();
        input.setId(null);
        when(patientService.createPatient(any())).thenReturn(samplePatient());

        mockMvc.perform(post("/api/patients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isCreated());
    }

    @Test
    void createPatient_withMissingFields_returns400() throws Exception {
        Patient invalid = new Patient(); // all required fields blank

        mockMvc.perform(post("/api/patients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.firstName").exists());
    }

    @Test
    void deletePatient_returns204() throws Exception {
        mockMvc.perform(delete("/api/patients/1"))
                .andExpect(status().isNoContent());
    }
}