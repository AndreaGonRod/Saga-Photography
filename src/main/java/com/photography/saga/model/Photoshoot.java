package com.photography.saga.model;

import com.photography.saga.dto.request.PhotoshootRequest;
import com.photography.saga.model.enums.MainStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Photoshoot extends Appointment {

    @Builder.Default
    @ManyToMany
    @JoinTable(name = "photoshoot_clients", joinColumns = @JoinColumn(name = "photoshoot_id"), inverseJoinColumns = @JoinColumn(name = "client_id"))
    private List<Client> clientsList = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "offer_id")
    private Offer offer;

    @Column(length = 2000)
    private String notes;

    private boolean commercialUsageAuthorized;
    private String folderPath;

    @Column(precision = 10, scale = 2)
    private BigDecimal finalPrice;

    @Enumerated(EnumType.STRING)
    private MainStatus status;

    private Integer customTurnAround;

    private LocalDate dueDate;
    private LocalDate eventDate;


    public void fillDetails(PhotoshootRequest request) {
        this.setTitle(request.title());
        this.setDate(request.date());
        this.setStartTime(request.startTime());
        this.setDuration(request.duration());
        this.eventDate = request.eventDate();

        this.finalPrice = request.finalPrice();

        this.customTurnAround = request.customTurnAround();
        this.commercialUsageAuthorized = request.commercialUsageAuthorized();
        this.folderPath = request.folderPath();

        this.notes = request.notes();

        this.prepareData();
    }

    @Override
    protected void prepareData() {
        super.prepareData();

        int turnAround = (this.customTurnAround != null) ? this.customTurnAround
                : (this.offer != null ? this.offer.getDefaultTurnAround() : 0);
        if (this.getDate() != null) {
            this.dueDate = this.getDate().plusDays(turnAround);
        }

        if (this.status == null && this.getDate() != null && this.getEndTime() != null) {

            if (LocalDateTime.now().isAfter(LocalDateTime.of(this.getDate(), this.getEndTime()))) {
                this.status = MainStatus.IN_QUEUE;
            }
        }
    }


}