package com.photography.saga.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;

public record AppointmentRequest(

        String title,

        @JsonFormat(pattern = "dd-MM-yyyy")
        LocalDate date,

        @JsonFormat(pattern = "HH:mm")
        LocalTime startTime,


        Duration duration
) {}
