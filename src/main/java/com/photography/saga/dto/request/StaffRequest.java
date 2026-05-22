package com.photography.saga.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record StaffRequest(
        Integer id,
        String name,
        String lastName,
        String phone,
        @Email(message = "Email inválido")
        String email,
        String notes
) {}
