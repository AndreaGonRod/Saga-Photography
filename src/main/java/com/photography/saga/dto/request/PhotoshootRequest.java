package com.photography.saga.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.photography.saga.model.enums.MainStatus;

import java.math.BigDecimal;

import java.time.Duration;
import java.time.LocalDate;

import java.time.LocalTime;
import java.util.List;

public record PhotoshootRequest(
                String title,
                @JsonFormat(pattern = "dd-MM-yyyy")
                LocalDate date,
                @JsonFormat(pattern = "HH:mm")
                LocalTime startTime,
                Duration duration,
                @JsonFormat(pattern = "dd-MM-yyyy")
                LocalDate eventDate,

                List<ClientRequest> clients,
                OfferRequest offer,
                BigDecimal finalPrice,

                MainStatus status,

                Integer customTurnAround,
                boolean commercialUsageAuthorized,
                String folderPath,

                String notes) {
}