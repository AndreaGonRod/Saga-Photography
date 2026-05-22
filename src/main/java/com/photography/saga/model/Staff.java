package com.photography.saga.model;


import com.photography.saga.dto.request.StaffRequest;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Getter @Setter
@Entity
@SuperBuilder
@NoArgsConstructor
public class Staff extends Person{

    @OneToMany(mappedBy = "staff", cascade = CascadeType.ALL)
    private List<Schedule> schedules;

    @Builder.Default
    @ManyToMany(mappedBy = "staffList")
    private List<Event> events = new ArrayList<>();

    // En Staff.java
    public void fillDetails(StaffRequest request) {
        super.fillBaseDetails(request.name(), request.lastName(), request.phone(), request.email(), request.notes());

    }


    public void setEvents(List<Event> events) {
        if (events == null) {
            this.events = new ArrayList<>();
        } else {
            this.events = new ArrayList<>(events);
        }
    }








}
