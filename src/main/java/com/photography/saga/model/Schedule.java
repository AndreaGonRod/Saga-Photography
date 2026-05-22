package com.photography.saga.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Schedule {

    @Enumerated(EnumType.STRING)
    private DayOfWeek dayOfWeek;

    @Entity
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Date {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer id;

        @ElementCollection
        private List<LocalDate> excludedDates;
        private LocalDate startRange;
        private LocalDate endRange;
    }

    @Embeddable
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Time {
        private LocalTime startTime;
        private LocalTime endTime;
        private LocalTime breakStartTime;
        private LocalTime breakEndTime;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Staff staff;

    @ManyToOne
    @JoinColumn(name = "business_id")
    private Business business;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "date_id")
    private Date date;

    @Embedded
    private Time time;

}
