package com.photography.saga.service;

import com.photography.saga.dto.request.AppointmentRequest;
import com.photography.saga.dto.response.AppointmentResponse;
import com.photography.saga.exception.ErrorHandler;
import com.photography.saga.model.Appointment;
import com.photography.saga.repository.AppointmentRepository;
import com.photography.saga.controller.ResponseMapper;
import com.photography.saga.util.TextFormatter;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Objects;

@Transactional
@Service
@RequiredArgsConstructor
public class AppointmentService implements ErrorHandler {

    private final AppointmentRepository appointmentRepository;
    private final ResponseMapper responseMapper;

    public List<AppointmentResponse> findAll() {
        return appointmentRepository.findAll().stream().map(responseMapper::toResponse).toList();
    }

    public List<AppointmentResponse> findByDateBetween(LocalDate start, LocalDate end) {
        return appointmentRepository.searchByDateBetween(start, end).stream().map(responseMapper::toResponse).toList();
    }

    public List<AppointmentResponse> findByDate(LocalDate date) {
        return appointmentRepository.searchByDate(date).stream().map(responseMapper::toResponse).toList();
    }

    public List<AppointmentResponse> findByDateAndStartTime(LocalDate date, LocalTime startTime) {
        return appointmentRepository.searchByDateAndStartTime(date, startTime).stream().map(responseMapper::toResponse)
                .toList();
    }

    public List<AppointmentResponse> findByTitle(String title) {
        return appointmentRepository.searchByTitle(formatTitle(title))
                .stream()
                .map(responseMapper::toResponse)
                .toList();
    }

    public AppointmentResponse findById(Integer id) {
        return responseMapper.toResponse(appointmentRepository.findById(id).orElseThrow(this::notFound));
    }

    public AppointmentResponse save(AppointmentRequest request) {
        checkMandatoryFields(request);
        Appointment appointment = new Appointment();
        appointment.fillDetails(request);
        validateAvailability(appointment);
        appointment.setCreatedAt();
        return responseMapper.toResponse(appointmentRepository.save(appointment));
    }

    public AppointmentResponse update(Integer id, AppointmentRequest request) {
        checkMandatoryFields(request);

        Appointment existingAppointment = appointmentRepository.findById(id).orElseThrow(this::notFound);

        existingAppointment.fillDetails(request);
        validateAvailability(existingAppointment);
        existingAppointment.setUpdatedAt();

        return responseMapper.toResponse(appointmentRepository.save(existingAppointment));
    }

    public void deleteById(Integer id) {
        if (!appointmentRepository.existsById(id)) {
            throw notFound();
        }
        appointmentRepository.deleteById(id);
    }

    private void checkMandatoryFields(AppointmentRequest request) {
        if (request.title() == null || request.title().isBlank() || request.date() == null
                || request.date().isBefore(LocalDate.now())
                || request.startTime() == null || request.duration() == null) {
            throw badRequest();
        }
    }

    private String formatTitle(String title) {
        return TextFormatter.textFormatter(title);
    }

    private void validateAvailability(Appointment appointment) {
        appointmentRepository
                .findConflict(appointment.getSearchTitle(), appointment.getDate(), appointment.getStartTime())
                .ifPresent(found -> {
                    if (!Objects.equals(found.getId(), appointment.getId())) {
                        throw conflict();
                    }
                });
    }
}
