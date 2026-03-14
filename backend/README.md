# Employee Management System - Backend

A comprehensive Spring Boot backend API for employee management with JWT authentication, role-based access control, and comprehensive user management.

## Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Three user roles (Super Admin, HR Manager, Employee)
- **User Management**: Complete CRUD operations for users
- **Database**: H2 in-memory database for development
- **Security**: Spring Security with comprehensive protection
- **API Documentation**: RESTful API endpoints
- **Error Handling**: Global exception handling with proper error responses

## Tech Stack

- **Java 17+**
- **Spring Boot 3.x**
- **Spring Security**
- **Spring Data JPA**
- **H2 Database**
- **JWT (Java JWT)**
- **Lombok**

## Project Structure

```
src/main/java/com/employee/management/
├── config/           # Configuration classes
│   ├── SecurityConfig.java
│   └── DataInitializer.java
├── controller/       # REST controllers
│   └── AuthController.java
├── entity/          # JPA entities
│   ├── User.java
│   └── Employee.java
├── dto/             # Data Transfer Objects
│   ├── UserDto.java
│   └── EmployeeDto.java
├── repository/      # JPA repositories
│   ├── UserRepository.java
│   └── EmployeeRepository.java
├── service/         # Business logic services
│   ├── UserService.java
│   └── UserDetailsServiceImpl.java
├── security/        # Security components
│   ├── JwtTokenProvider.java
│   └── JwtAuthenticationFilter.java
└── exception/       # Custom exceptions
    ├── GlobalExceptionHandler.java
    ├── ResourceNotFoundException.java
    └── ValidationException.java
```

## Default Users

The application creates three default users on startup:

### Super Admin
- **Email**: admin@company.com
- **Username**: admin
- **Password**: admin12
- **Role**: SUPER_ADMIN
- **Permissions**: Full system access

### HR Manager
- **Email**: hr@company.com
- **Username**: hrmanager
- **Password**: admin12
- **Role**: HR_MANAGER
- **Permissions**: Employee management, reports, timesheet approval

### Employee
- **Email**: employee@company.com
- **Username**: employee
- **Password**: admin12
- **Role**: EMPLOYEE
- **Permissions**: View own profile, submit timesheets

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Token refresh

### User Management (Protected)
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

## Running the Application

1. **Prerequisites**:
   - Java 17+
   - Maven

2. **Build and Run**:
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

3. **Access the Application**:
   - API: http://localhost:8080
   - H2 Console: http://localhost:8080/h2-console

## Configuration

The application uses `application.properties` for configuration:

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.username=sa
spring.datasource.password=

# JWT
jwt.secret=your-secret-key-change-this-in-production
jwt.expiration=86400000
```

## Security

- JWT tokens are generated on successful login
- Tokens are valid for 24 hours (configurable)
- All protected endpoints require valid JWT tokens
- Role-based access control enforces permissions

## Database Schema

The application uses H2 in-memory database with the following entities:

- **Users**: User accounts with roles and permissions
- **Employees**: Employee profiles and details

## Development

- **Hot Reload**: Enabled for faster development
- **Logging**: DEBUG level for employee.management package
- **CORS**: Enabled for frontend integration

## Testing

To test the API:

1. Start the application
2. Use the default credentials to login
3. Use the returned JWT token for subsequent requests
4. Test endpoints with tools like Postman or curl

Example login request:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin12"}'
```

## Future Enhancements

- Employee management endpoints
- Timesheet management
- Performance reviews
- File upload for avatars
- Email notifications
- Audit logging
- Production database configuration