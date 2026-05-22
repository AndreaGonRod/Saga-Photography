package com.photography.saga.model;

import com.photography.saga.util.TextFormatter;
import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@MappedSuperclass
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    private String searchName;
    private String lastName;
    private String searchLastName;
    private String searchFullName;

    @Column(unique = true, nullable = false)
    private String phone;

    @Column(unique = true)
    private String email;

    @Column(length = 500)
    private String notes;

    @PrePersist
    @PreUpdate
    private void prepareData() {
        if (this.name != null)
            this.name = this.name.trim();
        if (this.lastName != null)
            this.lastName = this.lastName.trim();

        this.searchName = TextFormatter.textFormatter(this.name);
        this.searchLastName = this.lastName != null ? TextFormatter.textFormatter(this.lastName) : "";
        this.searchFullName = (this.searchName + " " + this.searchLastName).trim();

        if (this.phone != null) {
            this.phone = TextFormatter.phoneFormatter(this.phone);
        }

        if (this.email != null) {
            this.email = this.email.toLowerCase().trim();
            if (this.email.isBlank())
                this.email = null;
        }
    }

    public void fillBaseDetails(String name, String lastName, String phone, String email, String notes) {
        this.name = name;
        this.lastName = lastName;
        this.phone = phone;
        this.email = email;
        this.notes = notes;
    }

}
