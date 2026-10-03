package com.healthcare.appointment.service;

import com.healthcare.appointment.entity.Patient;
import com.healthcare.appointment.repository.PatientRepository;
import com.healthcare.appointment.service.PatientService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PatientServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @InjectMocks
    private PatientService patientService;

    private Patient samplePatient;

    @BeforeEach
    void setUp() {
        samplePatient = new Patient();
        samplePatient.setId(1L);
        samplePatient.setFirstName("Nimal");
        samplePatient.setLastName("Perera");
        samplePatient.setDateOfBirth(LocalDate.of(1990, 1, 1));
        samplePatient.setGender("Male");
        samplePatient.setPhone("0771234567");
        samplePatient.setEmail("nimal@example.com");
        samplePatient.setAddress("Colombo");
    }

    @Test
    void getAllPatients_returnsListFromRepository() {
        when(patientRepository.findAll()).thenReturn(List.of(samplePatient));

        List<Patient> result = patientService.getAllPatients();

        assertEquals(1, result.size());
        assertEquals("Nimal", result.get(0).getFirstName());
        verify(patientRepository, times(1)).findAll();
    }

    @Test
    void getPatientById_whenFound_returnsPatient() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(samplePatient));

        Patient result = patientService.getPatientById(1L);

        assertEquals("Perera", result.getLastName());
    }

    @Test
    void getPatientById_whenNotFound_throwsException() {
        when(patientRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> patientService.getPatientById(99L));
        assertTrue(ex.getMessage().contains("99"));
    }

    @Test
    void createPatient_savesAndReturnsPatient() {
        when(patientRepository.save(samplePatient)).thenReturn(samplePatient);

        Patient result = patientService.createPatient(samplePatient);

        assertEquals("Nimal", result.getFirstName());
        verify(patientRepository).save(samplePatient);
    }

    @Test
    void updatePatient_updatesFieldsAndSaves() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(samplePatient));
        when(patientRepository.save(any(Patient.class))).thenAnswer(inv -> inv.getArgument(0));

        Patient updated = new Patient();
        updated.setFirstName("Nimal Updated");
        updated.setLastName("Perera");
        updated.setDateOfBirth(LocalDate.of(1990, 1, 1));
        updated.setGender("Male");
        updated.setPhone("0771234567");
        updated.setEmail("nimal@example.com");
        updated.setAddress("Colombo");

        Patient result = patientService.updatePatient(1L, updated);

        assertEquals("Nimal Updated", result.getFirstName());
    }

    @Test
    void deletePatient_callsRepositoryDelete() {
        patientService.deletePatient(1L);

        verify(patientRepository, times(1)).deleteById(1L);
    }
}