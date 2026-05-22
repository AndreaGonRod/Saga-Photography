package com.photography.saga.model;

import com.photography.saga.dto.request.*;
import com.photography.saga.util.TextFormatter;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "appointment")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String title;

    private String searchTitle;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime startTime;

    private LocalTime endTime;

    private Duration duration;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public void setCreatedAt() {
        this.createdAt = LocalDateTime.now();
    }

    public void setUpdatedAt() {
        this.updatedAt = LocalDateTime.now();
    }

    public void fillDetails(AppointmentRequest request) {
        if (request == null)
            return;

        this.title = request.title();
        this.date = request.date();
        this.startTime = request.startTime();
        this.duration = request.duration();

        this.prepareData();
    }

    @PrePersist
    @PreUpdate
    protected void prepareData() {
        if (this.title != null)
            this.title = this.title.trim();

        this.endTime = (this.startTime != null && this.duration != null)
                ? this.startTime.plus(this.duration)
                : null;

        this.searchTitle = TextFormatter.textFormatter(this.title);
    }
}