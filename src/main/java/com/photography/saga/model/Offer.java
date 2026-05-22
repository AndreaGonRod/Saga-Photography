package com.photography.saga.model;

import com.photography.saga.dto.request.OfferRequest;
import com.photography.saga.util.TextFormatter;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = { @UniqueConstraint(columnNames = { "searchCategory", "searchSubCategory" }) })
public class Offer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String subCategory;

    private String searchCategory;
    private String searchSubCategory;

    private BigDecimal price;

    @Column(length = 1000)
    private String details;

    private Integer defaultTurnAround;

    // En Offer.java
    @PrePersist
    @PreUpdate
    private void prepareData() {
        if (this.category != null)
            this.category = this.category.trim();
        if (this.subCategory != null)
            this.subCategory = this.subCategory.trim();
        if (this.details != null)
            this.details = this.details.trim();

        this.searchCategory = TextFormatter.textFormatter(this.category);
        this.searchSubCategory = TextFormatter.textFormatter(this.subCategory);
    }

    public void fillDetails(OfferRequest request) {
        this.category = request.category();
        this.subCategory = request.subCategory();
        this.price = request.price();
        this.details = request.details();
        this.defaultTurnAround = request.defaultTurnAround();
        this.prepareData();
    }

}
