package com.employee.management.employee.controller;

import com.employee.management.employee.dto.EmployeeDto;
import com.employee.management.employee.entity.Employee;
import com.employee.management.employee.service.EmployeeService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Employee Controller for Employee Service
 */
@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_MANAGER')")
    public ResponseEntity<?> getAllEmployees() {
        try {
            List<Employee> employees = employeeService.getAllEmployees();
            List<EmployeeDto> employeeDtos = employees.stream()
                    .map(EmployeeDto::fromEntity)
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", employeeDtos);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(createErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_MANAGER', 'EMPLOYEE')")
    public ResponseEntity<?> getEmployeeById(@PathVariable Long id) {
        try {
            Employee employee = employeeService.findByEmployeeId(id.toString());
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", EmployeeDto.fromEntity(employee));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/search/by-employee-id/{employeeId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_MANAGER')")
    public ResponseEntity<?> getEmployeeByEmployeeId(@PathVariable String employeeId) {
        try {
            Employee employee = employeeService.findByEmployeeId(employeeId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", EmployeeDto.fromEntity(employee));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/department/{department}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_MANAGER')")
    public ResponseEntity<?> getEmployeesByDepartment(@PathVariable String department) {
        try {
            List<Employee> employees = employeeService.getEmployeesByDepartment(department);
            List<EmployeeDto> employeeDtos = employees.stream()
                    .map(EmployeeDto::fromEntity)
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", employeeDtos);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(createErrorResponse(e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_MANAGER')")
    public ResponseEntity<?> createEmployee(@RequestBody EmployeeCreateRequest request) {
        try {
            Employee employee = new Employee();
            employee.setEmployeeId(employeeService.generateEmployeeId());
            employee.setFirstName(request.getFirstName());
            employee.setLastName(request.getLastName());
            employee.setEmail(request.getEmail());
            employee.setPhone(request.getPhone());
            employee.setDepartment(request.getDepartment());
            employee.setPosition(request.getPosition());
            employee.setHireDate(request.getHireDate());
            employee.setSalary(request.getSalary());
            employee.setManager(request.getManager());
            employee.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");

            Employee createdEmployee = employeeService.createEmployee(employee);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Employee created successfully");
            response.put("data", EmployeeDto.fromEntity(createdEmployee));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_MANAGER')")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id, @RequestBody EmployeeUpdateRequest request) {
        try {
            Employee employee = employeeService.findByEmployeeId(id.toString());

            Employee employeeDetails = new Employee();
            employeeDetails.setFirstName(request.getFirstName());
            employeeDetails.setLastName(request.getLastName());
            employeeDetails.setEmail(request.getEmail());
            employeeDetails.setPhone(request.getPhone());
            employeeDetails.setDepartment(request.getDepartment());
            employeeDetails.setPosition(request.getPosition());
            employeeDetails.setHireDate(request.getHireDate());
            employeeDetails.setSalary(request.getSalary());
            employeeDetails.setManager(request.getManager());
            employeeDetails.setStatus(request.getStatus());

            Employee updatedEmployee = employeeService.updateEmployee(id, employeeDetails);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Employee updated successfully");
            response.put("data", EmployeeDto.fromEntity(updatedEmployee));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        try {
            employeeService.deleteEmployee(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Employee deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e.getMessage()));
        }
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }

    // DTO classes
    @Data
    public static class EmployeeCreateRequest {
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private String department;
        private String position;
        private LocalDate hireDate;
        private BigDecimal salary;
        private String manager;
        private String status;
    }

    @Data
    public static class EmployeeUpdateRequest {
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private String department;
        private String position;
        private LocalDate hireDate;
        private BigDecimal salary;
        private String manager;
        private String status;
    }
}
