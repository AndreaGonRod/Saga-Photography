package com.photography.saga.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.photography.saga.model.Event;
import com.photography.saga.model.enums.MainStatus;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record EventRequest(
        String title,
        @JsonFormat(pattern = "dd-MM-yyyy")
        LocalDate date,
        @JsonFormat(pattern = "HH:mm")
        LocalTime startTime,
        Duration duration,
        boolean isFullDay,

        List<ClientRequest> clients,
        OfferRequest offer,
        BigDecimal finalPrice,
        Event.Deposit deposit,


        MainStatus status,
        Integer customTurnAround,
        List<StaffRequest> staff,
        boolean commercialUsageAuthorized,
        String folderPath,


        Event.Location location,
        Event.AdditionalContact additionalContact,
        List<TimelineEntryRequest> timeline,
        String notes

){

public record TimelineEntryRequest(
        @JsonFormat(pattern = "HH:mm")
        LocalTime startTime,
        String activity,
        String address,
        String notes
) {}}
