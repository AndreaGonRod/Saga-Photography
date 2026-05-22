package com.photography.saga.repository;

import com.photography.saga.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {

    List<Schedule> findByStaffId(Integer staffId);

    List<Schedule> findByBusinessId(Integer businessId);

}
