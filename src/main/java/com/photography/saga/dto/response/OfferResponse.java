package com.photography.saga.dto.response;
import java.math.BigDecimal;

public record OfferResponse(
        Integer id,
        String category,
        String subCategory,
        String details,
        BigDecimal price,
        Integer defaultTurnAround

) {}