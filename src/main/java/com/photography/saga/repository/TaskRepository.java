package com.photography.saga.repository;

import com.photography.saga.model.Task;
import com.photography.saga.model.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Integer> {

    @Query("SELECT DISTINCT t FROM Task t JOIN t.itemList i WHERE i.searchTaskName LIKE %:taskName%")
    List<Task> searchByTaskName(@Param("taskName") String taskName);

    @Query("SELECT t FROM Task t WHERE t.dueDate = :dueDate")
    List<Task> searchByDueDate(@Param("dueDate") LocalDate dueDate);

    @Query("SELECT t FROM Task t WHERE t.dueDate BETWEEN :start AND :end")
    List<Task> searchByDueDateBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT t FROM Task t WHERE t.client.id = :clientId")
    List<Task> searchByClientId(@Param("clientId") Integer clientId);

    @Query("SELECT DISTINCT t FROM Task t JOIN t.itemList i WHERE i.status = :status")
    List<Task> searchByStatus(@Param("status") TaskStatus status);

    @Query("SELECT t FROM Task t WHERE t.photoshoot.id = :photoshootId")
    List<Task> searchByPhotoshootId(@Param("photoshootId") Integer photoshootId);

    @Query("SELECT COUNT(t) FROM Task t JOIN t.client c WHERE t.id = :clientId")
    Integer countTotalTasksByClientId(@Param("clientId") Integer clientId);
}