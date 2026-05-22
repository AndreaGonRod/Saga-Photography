package com.photography.saga.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.photography.saga.model.Event;
import com.photography.saga.model.enums.MainStatus;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record EventResponse(
        Integer id,
        String title,
        @JsonFormat(pattern = "dd-MM-yyyy")
        LocalDate date,
        @JsonFormat(pattern = "HH:mm")
        LocalTime startTime,
        @JsonFormat(pattern = "HH:mm")
        LocalTime endTime,
        boolean isFullDay,

        List<ClientResponse> clients,
        OfferResponse offer,
        BigDecimal finalPrice,
        Event.Deposit deposit,


        MainStatus status,
        @JsonFormat(pattern = "dd-MM-yyyy")
        LocalDate dueDate,
        Integer customTurnAround,
        List<StaffResponse> staff,
        boolean commercialUsageAuthorized,
        String folderPath,


        Event.Location location,
        Event.AdditionalContact additionalContact,
        List<TimelineEntryResponse> timeline,
        String notes,

        @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
        LocalDateTime createdAt,
        @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
        LocalDateTime updatedAt
){
    public record TimelineEntryResponse(
            @JsonFormat(pattern = "HH:mm")
            LocalTime startTime,
            String activity,
            String address,
            String notes
    ) {}
}

