package com.photography.saga.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public record CalendarResponse(
        Integer id,
        String type,
        String title,
        @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
        LocalDateTime start,
        @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
        LocalDateTime end,
        String mainStatus, // El de Photoshoot (Workflow)
        String taskStatus     // El de la Task (Cliente)
) {}