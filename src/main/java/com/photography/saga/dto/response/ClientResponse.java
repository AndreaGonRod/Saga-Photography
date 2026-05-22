package com.photography.saga.dto.response;

import java.util.List;

public record ClientResponse(
        Integer id,
        String name,
        String lastName,
        String phone,
        String email,
        List<String> instagramAccounts,
        String notes
) {}
