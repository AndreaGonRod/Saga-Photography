package com.photography.saga.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.photography.saga.dto.request.ClientRequest;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Getter @Setter
@Entity
@SuperBuilder
@NoArgsConstructor
public class Client extends Person {

    @ElementCollection
    private List<String> instagramAccounts = new ArrayList<>();

    @ManyToMany(mappedBy = "clientsList")
    private List<Photoshoot> photoshootList = new ArrayList<>();

    private boolean welcomeSent = false;

    public void setInstagramAccounts(List<String> accounts) {
        if (accounts == null) {
            this.instagramAccounts = new ArrayList<>();
            return;
        }

        this.instagramAccounts = new ArrayList<>(accounts.stream()
                .map(account -> account.replace("@", "").trim())
                .filter(account -> !account.isEmpty())
                .toList()
        );
    }

    public void fillDetails(ClientRequest request) {
        super.fillBaseDetails(
                request.name(),
                request.lastName(),
                request.phone(),
                request.email(),
                request.notes()
        );
        this.setInstagramAccounts(request.instagramAccounts());
    }



}




