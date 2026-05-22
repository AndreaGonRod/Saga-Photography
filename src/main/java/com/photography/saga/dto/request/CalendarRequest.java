package com.photography.saga.dto.request;


import com.photography.saga.model.enums.MainStatus;

import java.time.LocalDate;

public record CalendarRequest(
        LocalDate start,
        LocalDate end,
        Integer clientId,    // Opcional: ver agenda de un cliente
        String type,         // Opcional: filtrar por PHOTOSHOOT, TASK...
        MainStatus status        // Opcional: ver solo lo pendiente
) {}
