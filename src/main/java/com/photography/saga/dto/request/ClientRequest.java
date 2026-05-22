package com.photography.saga.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record ClientRequest(

        Integer id,
        String name,

        String lastName,

        String phone,

        @Email(message = "Email inválido")
        String email,

        List<String> instagramAccounts,

        String notes
) {}
