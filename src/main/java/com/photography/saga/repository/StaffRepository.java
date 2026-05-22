package com.photography.saga.repository;


import com.photography.saga.model.Client;
import com.photography.saga.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff,Integer> {

    @Query("SELECT s FROM Staff s WHERE s.searchFullName LIKE %:fullName%")
    List<Staff>searchByFullName(@Param("fullName") String fullName);

    @Query("SELECT s FROM Staff s WHERE s.phone LIKE %:phone%")
    List<Staff> searchByPhone (@Param("phone")String phone);

    Optional<Staff> findByPhone(String phone);

}
