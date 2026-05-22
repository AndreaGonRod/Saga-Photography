package com.photography.saga.repository;

import com.photography.saga.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> searchByDateBetween(LocalDate start, LocalDate end);

    List<Appointment> searchByDate(LocalDate date);

    List<Appointment> searchByDateAndStartTime(LocalDate date, LocalTime startTime);

    @Query("SELECT a FROM Appointment a WHERE a.searchTitle LIKE %:title%")
    List<Appointment> searchByTitle(@Param("title") String title);

    @Query("SELECT a FROM Appointment a WHERE a.searchTitle = :searchTitle AND a.date = :date AND a.startTime = :startTime")
    Optional<Appointment> findConflict(
            @Param("searchTitle") String searchTitle,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.date = :date " +
            "AND a.startTime < :endTime " +
            "AND a.endTime > :startTime")
    long countOverlappingAppointments(
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);

}
