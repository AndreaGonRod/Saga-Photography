package com.photography.saga.dto.request;


import java.math.BigDecimal;

public record OfferRequest(
        Integer id,

        String category,
        String subCategory,
        String details,
        BigDecimal price,
        Integer defaultTurnAround
) {}