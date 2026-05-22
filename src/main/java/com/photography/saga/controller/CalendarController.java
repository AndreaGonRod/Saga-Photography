package com.photography.saga.controller;

import com.photography.saga.dto.response.CalendarResponse;
import com.photography.saga.service.CalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
public class CalendarController {

    private final CalendarService calendarService;

    @GetMapping
    public List<CalendarResponse> getSchedule(
            @RequestParam(required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate end) {

        // Si entras a /api/schedule a secas (sin parámetros), te devuelve TODO
        if (start == null || end == null) {
            return calendarService.getAllSchedule();
        }

        // Si pasas parámetros, filtra por ese rango
        return calendarService.getScheduleRange(start, end);
    }

    @GetMapping("/today")
    public List<CalendarResponse> getToday() {
        LocalDate today = LocalDate.now();
        return calendarService.getScheduleRange(today, today);
    }

    @GetMapping("/week")
    public List<CalendarResponse> getThisWeek() {
        LocalDate start = LocalDate.now();
        LocalDate end = start.plusDays(7);
        return calendarService.getScheduleRange(start, end);
    }
}