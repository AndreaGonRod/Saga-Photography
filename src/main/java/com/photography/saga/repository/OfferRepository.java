package com.photography.saga.repository;

import com.photography.saga.model.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface OfferRepository extends JpaRepository<Offer,Integer> {

    @Query("SELECT o FROM Offer o WHERE o.searchCategory = :category AND o.searchSubCategory = :subCategory")
    Optional<Offer> findByBoth(
            @Param("category") String category,
            @Param("subCategory") String subCategory
    );

    @Query("SELECT COUNT(o) > 0 FROM Offer o " +
            "WHERE o.searchCategory = :category " +
            "AND o.searchSubCategory = :subCategory")
    boolean existsByBoth(
            @Param("category") String category,
            @Param("subCategory") String subCategory
    );

    @Query("SELECT o FROM Offer o WHERE o.searchCategory LIKE %:category%")
    List<Offer> findByCategory(@Param("category") String category);

    @Query("SELECT o FROM Offer o WHERE o.searchSubCategory LIKE %:subCategory%")
    List<Offer> findBySubcategory(@Param("subCategory") String subCategory);


}
