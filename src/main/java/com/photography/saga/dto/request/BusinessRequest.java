package com.photography.saga.dto.request;

import jakarta.validation.constraints.NotBlank;

public record BusinessRequest(
        @NotBlank(message = "El nombre es obligatorio") String name,
        String taxId,
        String address) {
}
