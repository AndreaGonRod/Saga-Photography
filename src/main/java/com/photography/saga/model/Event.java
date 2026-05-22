package com.photography.saga.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.photography.saga.dto.request.EventRequest;
import com.photography.saga.model.enums.DepositStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor

public class Event extends Photoshoot {

    @ManyToMany
    @JoinTable(name = "event_staff", joinColumns = @JoinColumn(name = "event_id"), inverseJoinColumns = @JoinColumn(name = "staff_id"))
    @Builder.Default
    private List<Staff> staffList = new ArrayList<>();

    private boolean isFullDay;

    @Embeddable
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AdditionalContact {
        private String name;
        private String phone;
    }

    @Embeddable
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Deposit {
        private boolean required;
        private BigDecimal amount;
        private boolean paid;
        @JsonIgnore
        private DepositStatus status;
    }

    @Embeddable
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Location {
        private String ceremony;
        @JsonIgnore
        private String searchCeremony;
        private String reception;
        @JsonIgnore
        private String searchReception;
    }

    @Embeddable
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Entry {
        private LocalTime startTime;
        private String activity;
        private String address;
        private String notes;
    }

    @Embedded
    private Deposit deposit;

    @Embedded
    private AdditionalContact additionalContact;

    @Embedded
    private Location location;

    @Builder.Default
    @ElementCollection
    @CollectionTable(name = "event_timeline", joinColumns = @JoinColumn(name = "event_id"))
    @OrderBy("startTime ASC")
    private List<Entry> timeline = new ArrayList<>();


    @Override
    protected void prepareData() {
        super.prepareData();

        if (this.isFullDay) {
            this.setDuration(null);
            this.setEndTime(LocalTime.of(23, 59));
        }
    }

    public void fillDetails(EventRequest request) {
        this.setTitle(request.title());
        this.setDate(request.date());
        this.setStartTime(request.startTime());
        this.setDuration(request.duration());
        this.setNotes(request.notes());
        this.setCommercialUsageAuthorized(request.commercialUsageAuthorized());
        this.setFolderPath(request.folderPath());
        this.setFinalPrice(request.finalPrice());
        this.setStatus(request.status());
        this.setCustomTurnAround(request.customTurnAround());

        this.isFullDay = request.isFullDay();
        this.deposit = request.deposit();
        this.additionalContact = request.additionalContact();
        this.location = request.location();

        if (request.timeline() != null) {
            this.timeline = request.timeline().stream()
                    .map(entryRequest -> new Entry(
                            entryRequest.startTime(),
                            entryRequest.activity(),
                            entryRequest.address(),
                            entryRequest.notes()))
                    .toList();
        }
        this.prepareData();
    }

}
