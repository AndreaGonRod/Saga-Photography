package com.photography.saga.dto.response;


import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.cglib.core.Local;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record AppointmentResponse (

        Integer id,
        String title,

        @JsonFormat(pattern = "dd-MM-yyyy")
        LocalDate date,

        @JsonFormat(pattern = "HH:mm")
        LocalTime startTime,

        @JsonFormat(pattern = "HH:mm")
        LocalTime endTime,

        @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
        LocalDateTime createdAt,
        @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
        LocalDateTime updatedAt

) {
}
