package com.employee.management.employee.repository;

import com.employee.management.employee.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Employee Repository for Employee Service
 */
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    Optional<Employee> findByEmployeeId(String employeeId);
    
    Optional<Employee> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    boolean existsByEmployeeId(String employeeId);
    
    List<Employee> findByDepartment(String department);
    
    List<Employee> findByStatus(String status);
    
    List<Employee> findByManager(String manager);
    
    List<Employee> findByDepartmentAndStatus(String department, String status);
}
