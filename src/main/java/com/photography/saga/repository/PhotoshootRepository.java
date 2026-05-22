package com.photography.saga.repository;

import com.photography.saga.model.Photoshoot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface PhotoshootRepository extends JpaRepository<Photoshoot, Integer> {

    // Devuelve el total de citas (Photoshoot + Event) asociadas al cliente
    @Query("SELECT COUNT(p) FROM Photoshoot p JOIN p.clientsList c WHERE c.id = :clientId")
    Integer countTotalSessionsByClientId(@Param("clientId") Integer clientId);

    @Query("SELECT COUNT(p) FROM Photoshoot p JOIN p.clientsList c WHERE TYPE(p) = Photoshoot AND c.id = :clientId")
    Integer countPhotoshootsByClientId(@Param("clientId") Integer clientId);

    @Query("SELECT p FROM Photoshoot p JOIN p.clientsList c WHERE c.id = :clientId AND p.date = :date")
    Optional<Photoshoot> findConflict(@Param("clientId") Integer clientId, @Param("date") LocalDate date);

    @Query("SELECT p FROM Photoshoot p WHERE TYPE(p) = Photoshoot AND p.date BETWEEN :start AND :end")
    List<Photoshoot> searchByDateBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT p FROM Photoshoot p WHERE TYPE(p) = Photoshoot AND p.date = :date")
    List<Photoshoot> searchByDate(@Param("date") LocalDate date);

    @Query("SELECT p FROM Photoshoot p WHERE TYPE(p) = Photoshoot AND p.date = :date AND p.startTime = :startTime")
    List<Photoshoot> searchByDateAndStartTime(@Param("date") LocalDate date, @Param("startTime") LocalTime startTime);

    @Query("SELECT p FROM Photoshoot p WHERE TYPE(p) = Photoshoot AND p.dueDate BETWEEN :start AND :end")
    List<Photoshoot> searchByDueDateBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT p FROM Photoshoot p WHERE TYPE(p) = Photoshoot AND p.eventDate BETWEEN :start AND :end")
    List<Photoshoot> searchByEventDateBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT p FROM Photoshoot p WHERE TYPE(p) = Photoshoot AND p.dueDate = :date")
    List<Photoshoot> searchByDueDate(@Param("date") LocalDate date);

    @Query("SELECT p FROM Photoshoot p WHERE TYPE(p) = Photoshoot AND p.eventDate = :date")
    List<Photoshoot> searchByEventDate(@Param("date") LocalDate date);

    @Query("SELECT p FROM Photoshoot p WHERE TYPE(p) = Photoshoot AND p.searchTitle LIKE %:title%")
    List<Photoshoot> searchByTitle(@Param("title") String title);

    @Override
    @Query("SELECT p FROM Photoshoot p WHERE TYPE(p) = Photoshoot")
    List<Photoshoot> findAll();

}