package com.photography.saga.controller;

import com.photography.saga.dto.request.EventRequest;
import com.photography.saga.dto.response.EventResponse;
import com.photography.saga.dto.response.PhotoshootResponse;
import com.photography.saga.model.Event;
import com.photography.saga.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public List<EventResponse> getAll(
            @RequestParam(required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(pattern = "HH:mm") LocalTime startTime) {

        if (date != null && startTime != null) {
            return eventService.findByDateAndStartTime(date, startTime);
        }
        return eventService.findAll();
    }

    @GetMapping("/{id}")
    public EventResponse getById(@PathVariable Integer id){
        return eventService.findById(id);
    }

    @GetMapping("/count/client/{id}")
    public Integer countByClient(@PathVariable Integer id) {
        return eventService.countByClientsListId(id);
    }

    @GetMapping("/count/staff/{id}")
    public Integer countByStaff(@PathVariable Integer id) {
        return eventService.countByStaffListId(id);
    }

    @GetMapping("/search")
    public List<EventResponse> getByText(@RequestParam String text){
        return eventService.findByText(text);
    }

    @GetMapping("/date")
    public List<EventResponse> getByDate(
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate date,
            @RequestParam(defaultValue = "date") String type) {

        if ("due-date".equalsIgnoreCase(type)) {
            return eventService.findByDueDate(date);
        }
        return eventService.findByDate(date);
    }

    @GetMapping("/between")
    public List<EventResponse> getBetween(
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate start,
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate end,
            @RequestParam(defaultValue = "date") String type) {

        if ("due-date".equalsIgnoreCase(type)) {
            return eventService.findByDueDateBetween(start, end);
        }
        return eventService.findByDateBetween(start, end);
    }

    @GetMapping("/staff/{id}/between")
    public List<EventResponse> getByStaffBetween(
            @PathVariable Integer id,
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate start,
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate end) {

        return eventService.findByStaffAndDateBetween(id, start, end);
    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EventResponse post(@RequestBody @Valid EventRequest request){
        return eventService.save(request);
    }

    @PutMapping("/{id}")
    public EventResponse update(@PathVariable Integer id,@RequestBody @Valid EventRequest request){
        return eventService.update(id,request);
    }

    @PutMapping("/{id}/timeline")
    public EventResponse updateTimeline(@PathVariable Integer id,@RequestBody EventRequest request){
        return eventService.updateTimeLine(id,request);
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id){
        eventService.deleteById(id);
    }





}
