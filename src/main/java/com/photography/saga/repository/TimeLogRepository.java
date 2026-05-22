//package com.photography.saga.repository;
//
//import com.photography.saga.model.Staff;
//import com.photography.saga.model.TimeLog;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.time.LocalDate;
//
//import java.util.List;
//import java.util.Optional;
//
//public interface TimeLogRepository extends JpaRepository <TimeLog,Integer> {
//
//    List<TimeLog> findByStaffAndDateBetween(Staff staff, LocalDate start, LocalDate end);
//
//    Optional<TimeLog> findByStaffAndIsOpen(Staff staff,boolean isOpen);
//}