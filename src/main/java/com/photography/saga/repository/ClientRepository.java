package com.photography.saga.repository;

import com.photography.saga.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client,Integer> {

    @Query("SELECT c FROM Client c WHERE c.phone LIKE %:phone%")
    List<Client>searchByPhone (@Param("phone")String phone);

    @Query("SELECT c FROM Client c WHERE c.searchFullName LIKE %:fullName%")
    List<Client> searchByFullName(@Param("fullName") String fullName);

    Optional<Client> findByPhone(String phone);

}
