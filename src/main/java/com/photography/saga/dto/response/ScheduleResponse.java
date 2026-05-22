package com.photography.saga.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record ScheduleResponse(

        Integer id,
        DayOfWeek dayOfWeek,

        // FK resumida (solo el id del propietario)
        Integer staffId,
        Integer businessId,

        // Rango de fechas
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
