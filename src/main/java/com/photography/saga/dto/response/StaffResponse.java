package com.photography.saga.dto.response;


public record StaffResponse(
        Integer id,
        String name,
        String lastName,
        String phone,
        String email,
        String notes
) {}