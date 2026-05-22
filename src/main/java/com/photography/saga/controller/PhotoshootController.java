package com.photography.saga.controller;

import com.photography.saga.dto.request.PhotoshootRequest;
import com.photography.saga.dto.response.PhotoshootResponse;
import com.photography.saga.service.PhotoshootService;
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
@RequestMapping("/api/photoshoots")
public class PhotoshootController {

    private final PhotoshootService photoshootService;

    @GetMapping
    public List<PhotoshootResponse> getAll(
            @RequestParam(required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(pattern = "HH:mm") LocalTime startTime) {

        if (date != null && startTime != null) {
            return photoshootService.findByDateAndStartTime(date, startTime);
        }
        return photoshootService.findAll();
    }

    @GetMapping("/{id}")
    public PhotoshootResponse getById(@PathVariable Integer id) {
        return photoshootService.findById(id);
    }

    @GetMapping("/search")
    public List<PhotoshootResponse> getByTitle(@RequestParam String title) {
        return photoshootService.findBySearchTitle(title);
    }

    @GetMapping("/date")
    public List<PhotoshootResponse> getByDate(
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate date,
            @RequestParam(defaultValue = "date") String type) {

        return switch (type.toLowerCase()) {
            case "due-date" -> photoshootService.findByDueDate(date);
            case "event-date" -> photoshootService.findByEventDate(date);
            default -> photoshootService.findByDate(date);
        };
    }

    @GetMapping("/between")
    public List<PhotoshootResponse> getBetween(
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate start,
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate end,
            @RequestParam(defaultValue = "date") String type) {

        return switch (type.toLowerCase()) {
            case "due-date" -> photoshootService.findByDueDateBetween(start, end);
            case "event-date" -> photoshootService.findByEventDateBetween(start, end);
            default -> photoshootService.findByDateBetween(start, end);
        };
    }

    @GetMapping("/count/client/{id}")
    public Integer countByClient(@PathVariable Integer id) {
        return photoshootService.countByClientsListId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PhotoshootResponse post(@RequestBody @Valid PhotoshootRequest request) {
        return photoshootService.save(request);
    }

    @PutMapping("/{id}")
    public PhotoshootResponse update(@PathVariable Integer id, @RequestBody @Valid PhotoshootRequest request) {
        return photoshootService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        photoshootService.delete(id);
    }
}