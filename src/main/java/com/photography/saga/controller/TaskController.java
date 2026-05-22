package com.photography.saga.controller;

import com.photography.saga.dto.request.TaskRequest;
import com.photography.saga.dto.response.TaskResponse;
import com.photography.saga.model.Task;
import com.photography.saga.model.enums.TaskStatus;
import com.photography.saga.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public List<TaskResponse> getAll() {
        return taskService.findAll();
    }

    @GetMapping("/{id}")
    public TaskResponse getById(@PathVariable Integer id) {
        return taskService.findById(id);
    }

    @GetMapping("/search/name")
    public List<TaskResponse> getByTaskName(@RequestParam String name) {
        return taskService.findByTaskName(name);
    }

    @GetMapping("/search/due-date")
    public List<TaskResponse> getByDueDate(
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate date) {
        return taskService.findByDueDate(date);
    }

    @GetMapping("/search/client/{clientId}")
    public List<TaskResponse> getByClientId(@PathVariable Integer clientId) {
        return taskService.findByClientId(clientId);
    }

    @GetMapping("/search/photoshoot/{photoshootId}")
    public List<TaskResponse> getByPhotoshootId(@PathVariable Integer photoshootId) {
        return taskService.findByPhotoshootId(photoshootId);
    }

    @GetMapping("/search/status")
    public List<TaskResponse> getByStatus(@RequestParam TaskStatus status) {
        return taskService.findByStatus(status);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse post(@RequestBody @Valid TaskRequest request) {
        return taskService.save(request);
    }

    @PutMapping("/{id}")
    public TaskResponse update(@PathVariable Integer id, @RequestBody @Valid TaskRequest request) {
        return taskService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        taskService.delete(id);
    }
}