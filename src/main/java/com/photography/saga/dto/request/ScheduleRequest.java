package com.photography.saga.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record ScheduleRequest(

        @NotNull(message = "El día de la semana es obligatorio") DayOfWeek dayOfWeek,

        // Propietario del horario: al menos uno debe estar presente
        Integer staffId,
        Integer businessId,

        // Rango de fechas y exclusiones
        @JsonFormat(pattern = "dd-MM-yyyy") LocalDate startRange,

        @JsonFormat(pattern = "dd-MM-yyyy") LocalDate endRange,

        @JsonFormat(pattern = "dd-MM-yyyy") List<LocalDate> excludedDates,

        // Franja horaria
        @JsonFormat(pattern = "HH:mm") LocalTime startTime,

        @JsonFormat(pattern = "HH:mm") LocalTime endTime,

        @JsonFormat(pattern = "HH:mm") LocalTime breakStartTime,

        @JsonFormat(pattern = "HH:mm") LocalTime breakEndTime

) {
}
