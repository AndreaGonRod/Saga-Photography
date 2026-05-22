package com.photography.saga.repository;

import com.photography.saga.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Integer> {

        // Devuelve solo el número de eventos asociados al cliente
        @Query("SELECT COUNT(e) FROM Event e JOIN e.clientsList c WHERE c.id = :clientId")
        Integer countEventsByClientId(@Param("clientId") Integer clientId);

        @Query("SELECT COUNT(e) FROM Event e JOIN e.staffList s WHERE s.id = :staffId")
        Integer countEventsByStaffId(@Param("staffId") Integer staffId);

        List<Event> searchByDate(LocalDate date);

        List<Event> searchByDateBetween(LocalDate start, LocalDate end);

        List<Event> searchByDateAndStartTime(LocalDate date, LocalTime startTime);

        @Query("SELECT DISTINCT e FROM Event e " +
                        "LEFT JOIN e.clientsList c " +
                        "WHERE e.searchTitle LIKE %:text% " +
                        "OR c.name LIKE %:text% " +
                        "OR e.location.searchCeremony LIKE %:text% " +
                        "OR e.location.searchReception LIKE %:text%")
        List<Event> searchByText(String text);

        @Query("SELECT e FROM Event e JOIN e.clientsList c WHERE c.id = :clientId AND e.date = :date")
        Optional<Event> findConflict(@Param("clientId") Integer clientId, @Param("date") LocalDate date);

        @Query("SELECT e FROM Event e JOIN e.staffList s " +
                        "WHERE s.id = :staffId " +
                        "AND e.date = :date " +
                        "AND e.startTime = :startTime")
        Optional<Event> findStaffConflict(@Param("staffId") Integer staffId,
                        @Param("date") LocalDate date,
                        @Param("startTime") LocalTime startTime);

        List<Event> searchByDueDate(LocalDate date);

        List<Event> searchByDueDateBetween(LocalDate start, LocalDate end);

        @Query("SELECT e FROM Event e JOIN e.staffList s WHERE s.id = :staffId AND e.date BETWEEN :start AND :end")
        List<Event> findByStaffAndDateBetween(@Param("staffId") Integer staffId,
                                          @Param("start") LocalDate start,
                                          @Param("end") LocalDate end);
}