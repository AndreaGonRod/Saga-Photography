package com.photography.saga.controller;

import com.photography.saga.dto.request.AppointmentRequest;
import com.photography.saga.dto.response.AppointmentResponse;
import com.photography.saga.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping
    public List<AppointmentResponse> getAll(
            @RequestParam(required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(pattern = "HH:mm") LocalTime startTime) {

        if (date != null && startTime != null) {
            return appointmentService.findByDateAndStartTime(date, startTime);
        }
        if (date != null) {
            return appointmentService.findByDate(date);
        }
        return appointmentService.findAll();
    }

    @GetMapping("/{id}")
    public AppointmentResponse getById(@PathVariable Integer id){
        return appointmentService.findById(id);
    }

    @GetMapping("/search")
    public List<AppointmentResponse> getByTitle(@RequestParam String title) {
        return appointmentService.findByTitle(title);
    }

    @GetMapping("/between")
    public List<AppointmentResponse> getByDateBetween(
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate start,
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate end) {
        return appointmentService.findByDateBetween(start, end);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AppointmentResponse post(@RequestBody @Valid AppointmentRequest request){
        return appointmentService.save(request);
    }

    @PutMapping("/{id}")
    public AppointmentResponse update(@PathVariable Integer id, @RequestBody @Valid AppointmentRequest request){
        return appointmentService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id){
            appointmentService.deleteById(id);
        }
    }


