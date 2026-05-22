package com.photography.saga.controller;

import com.photography.saga.dto.request.StaffRequest;
import com.photography.saga.dto.response.StaffResponse;
import com.photography.saga.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final StaffService staffService;

    @GetMapping
    public List<StaffResponse> getAll() {
        return staffService.findAll();
    }

    @GetMapping("/{id}")
    public StaffResponse getById(@PathVariable Integer id) {
        return staffService.findById(id);
    }

    @GetMapping("/search")
    public List<StaffResponse> getByFullName(@RequestParam String searchFullName) {
        return staffService.searchByFullName(searchFullName);
    }

    @GetMapping("/search/phone")
    public List<StaffResponse> getByPhone(@RequestParam String phone) {
        return staffService.searchByPhone(phone);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StaffResponse post(@Valid @RequestBody StaffRequest request) {
        return staffService.save(request);
    }

    @PutMapping("/{id}")
    public StaffResponse update(@PathVariable Integer id, @Valid @RequestBody StaffRequest request) {
        return staffService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        staffService.deleteById(id);
    }
}