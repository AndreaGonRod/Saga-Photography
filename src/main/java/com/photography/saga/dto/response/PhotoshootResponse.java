package com.photography.saga.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.photography.saga.model.enums.MainStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record PhotoshootResponse(
        Integer id,
        String title,
        @JsonFormat(pattern = "dd-MM-yyyy")
        LocalDate date,
        @JsonFormat(pattern = "HH:mm")
        LocalTime startTime,
        @JsonFormat(pattern = "HH:mm")
        LocalTime endTime,
        @JsonFormat(pattern = "dd-MM-yyyy")
        LocalDate eventDate,

        List<ClientResponse> clients,
        OfferResponse offer,
        BigDecimal finalPrice,

        MainStatus status,
        @JsonFormat(pattern = "dd-MM-yyyy")
        LocalDate dueDate,
        Integer customTurnAround,
        boolean commercialUsageAuthorized,
        String folderPath,
        String notes,

        @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
        LocalDateTime createdAt,
        @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
        LocalDateTime updatedAt
) {}