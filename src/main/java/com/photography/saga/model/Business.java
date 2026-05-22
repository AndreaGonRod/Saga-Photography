package com.photography.saga.model;

import jakarta.persistence.*;
import lombok.*;


import java.util.List;

@Entity
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class Business {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String taxId;
    private String address;

    @OneToMany(mappedBy = "business", cascade = CascadeType.ALL)
    private List<Schedule> schedules;


}
