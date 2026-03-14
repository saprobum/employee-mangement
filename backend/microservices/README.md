# Employee Management System - Microservices Architecture

A comprehensive microservices-based employee management system built with Spring Boot 3.x and Spring Cloud. The system is composed of multiple independent services that communicate through REST APIs and an API Gateway.

## 🏗️ Architecture Overview

```
                                    ┌─────────────────┐
                                    │   API Gateway   │
                                    │   (Port 8080)   │
                                    └────────┬────────┘
                                             │
            ┌────────────────────────────────┼────────────────────────────────┐
            │                                │                                │
            ▼                                ▼                                ▼
    ┌───────────────┐                ┌───────────────┐                ┌───────────────┐
    │ Auth Service  │                │ User Service  │                │Employee Service│
    │ (Port 8081)   │                │ (Port 8082)   │                │ (Port 8083)   │
    └───────────────┘                └───────────────┘                └───────────────┘
            │                                │                                │
            │                                │                                │
            ▼                                ▼                                ▼
    ┌───────────────┐                ┌───────────────┐                ┌───────────────┐
    │   H2/PostgreSQL│                │   H2/PostgreSQL│                │   H2/PostgreSQL│
    └───────────────┘                └───────────────┘                └───────────────┘
```

## 📁 Project Structure

```
backend/
├── microservices/                          # Multi-module Maven project
│   ├── pom.xml                             # Parent POM
│   ├── api-gateway/                        # API Gateway Service (Port 8080)
│   │   ├── pom.xml
│   │   └── src/main/
│   │       ├── java/com/employee/management/gateway/
│   │       │   ├── ApiGatewayApplication.java
│   │       │   └── FallbackController.java
│   │       └── resources/
│   │           └── application.properties
│   ├── auth-service/                       # Authentication Service (Port 8081)
│   │   ├── pom.xml
│   │   └── src/main/
│   │       ├── java/com/employee/management/auth/
│   │       │   ├── AuthServiceApplication.java
│   │       │   ├── config/
│   │       │   ├── controller/
│   │       │   ├── dto/
│   │       │   ├── entity/
│   │       │   ├── repository/
│   │       │   ├── security/
│   │       │   └── service/
│   │       └── resources/
│   │           └── application.properties
│   ├── user-service/                       # User Management Service (Port 8082)
│   │   ├── pom.xml
│   │   └── src/main/
│   │       ├── java/com/employee/management/user/
│   │       │   ├── UserServiceApplication.java
│   │       │   ├── config/
│   │       │   ├── controller/
│   │       │   ├── dto/
│   │       │   ├── entity/
│   │       │   ├── repository/
│   │       │   └── service/
│   │       └── resources/
│   │           └── application.properties
│   └── employee-service/                   # Employee Management Service (Port 8083)
│       ├── pom.xml
│       └── src/main/
│           ├── java/com/employee/management/employee/
│           │   ├── EmployeeServiceApplication.java
│           │   ├── config/
│           │   ├── controller/
│           │   ├── dto/
│           │   ├── entity/
│           │   ├── repository/
│           │   └── service/
│           └── resources/
│               └── application.properties
└── src/                                    # Legacy monolithic application
```

## 🔧 Services Description

### 1. API Gateway (Port 8080)
The central entry point for all client requests.

**Features:**
- Request routing to appropriate microservices
- Load balancing
- Circuit breaker pattern with Resilience4j
- Rate limiting (optional, requires Redis)
- CORS configuration
- Fallback responses for service failures

**Technologies:**
- Spring Cloud Gateway
- Resilience4j
- Spring Boot Actuator

### 2. Auth Service (Port 8081)
Handles authentication and authorization.

**Features:**
- JWT token generation and validation
- User login and registration
- Token refresh
- Password encryption (BCrypt)
- Role-based access control

**Endpoints:**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Token refresh

**Technologies:**
- Spring Security
- JWT (Java JWT)
- Spring Data JPA

### 3. User Service (Port 8082)
Manages user operations and permissions.

**Features:**
- User CRUD operations
- Role management
- Permission management
- User search and filtering

**Endpoints:**
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

**Technologies:**
- Spring Data JPA
- Spring Security (Method-level)
- Spring Boot Actuator

### 4. Employee Service (Port 8083)
Manages employee information and profiles.

**Features:**
- Employee CRUD operations
- Department management
- Employee search and filtering
- Employee ID generation

**Endpoints:**
- `GET /api/employees` - Get all employees
- `GET /api/employees/{id}` - Get employee by ID
- `GET /api/employees/search/by-employee-id/{employeeId}` - Search by employee ID
- `GET /api/employees/department/{department}` - Get employees by department
- `POST /api/employees` - Create new employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee

**Technologies:**
- Spring Data JPA
- Spring Security (Method-level)
- Spring Boot Actuator

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Git

### Quick Start

1. **Clone the repository** (if not already done)
   ```bash
   cd backend/microservices
   ```

2. **Build all services**
   ```bash
   mvn clean install
   ```

3. **Start services in order**

   **Terminal 1 - Auth Service:**
   ```bash
   cd microservices/auth-service
   mvn spring-boot:run
   ```

   **Terminal 2 - User Service:**
   ```bash
   cd microservices/user-service
   mvn spring-boot:run
   ```

   **Terminal 3 - Employee Service:**
   ```bash
   cd microservices/employee-service
   mvn spring-boot:run
   ```

   **Terminal 4 - API Gateway:**
   ```bash
   cd microservices/api-gateway
   mvn spring-boot:run
   ```

### Access Points

| Service | URL | Port |
|---------|-----|------|
| API Gateway | http://localhost:8080 | 8080 |
| Auth Service | http://localhost:8081 | 8081 |
| User Service | http://localhost:8082 | 8082 |
| Employee Service | http://localhost:8083 | 8083 |

### H2 Database Consoles

Each service has its own H2 console:
- Auth Service: http://localhost:8081/h2-console
- User Service: http://localhost:8082/h2-console
- Employee Service: http://localhost:8083/h2-console

**JDBC URLs:**
- Auth Service: `jdbc:h2:mem:authdb`
- User Service: `jdbc:h2:mem:userdb`
- Employee Service: `jdbc:h2:mem:employeedb`

## 👤 Default Users

The Auth Service creates three default users on startup:

### Super Admin
- **Email**: admin@company.com
- **Username**: admin
- **Password**: admin12
- **Role**: SUPER_ADMIN

### HR Manager
- **Email**: hr@company.com
- **Username**: hrmanager
- **Password**: admin12
- **Role**: HR_MANAGER

### Employee
- **Email**: employee@company.com
- **Username**: employee
- **Password**: admin12
- **Role**: EMPLOYEE

## 📡 API Usage Examples

### Authentication Flow

1. **Login**
   ```bash
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "username": "admin",
       "password": "admin12"
     }'
   ```

   Response:
   ```json
   {
     "success": true,
     "token": "eyJhbGciOiJIUzUxMiJ9...",
     "user": {
       "id": 1,
       "username": "admin",
       "email": "admin@company.com",
       "role": "SUPER_ADMIN"
     }
   }
   ```

2. **Access Protected Endpoint**
   ```bash
   curl -X GET http://localhost:8080/api/users \
     -H "Authorization: Bearer eyJhbGciOiJIUzUxMiJ9..."
   ```

3. **Create Employee**
   ```bash
   curl -X POST http://localhost:8080/api/employees \
     -H "Authorization: Bearer eyJhbGciOiJIUzUxMiJ9..." \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "John",
       "lastName": "Doe",
       "email": "john.doe@company.com",
       "department": "Engineering",
       "position": "Software Engineer",
       "hireDate": "2024-01-15",
       "salary": 75000.00
     }'
   ```

## 🔐 Security

- **JWT Tokens**: Valid for 24 hours (configurable)
- **Password Encryption**: BCrypt with salt
- **Role-Based Access Control**: Three roles (SUPER_ADMIN, HR_MANAGER, EMPLOYEE)
- **CORS**: Enabled for all origins (configure for production)

## 📊 Monitoring & Health Checks

Each service exposes Actuator endpoints:

- **Health**: `http://localhost:{port}/actuator/health`
- **Info**: `http://localhost:{port}/actuator/info`
- **Metrics**: `http://localhost:{port}/actuator/metrics`

API Gateway routes:
- **Gateway Routes**: `http://localhost:8080/actuator/gateway/routes`

## ⚙️ Configuration

### Environment Variables (Optional)

You can override configuration using environment variables:

```bash
# Auth Service
export JWT_SECRET=your-secret-key-min-32-characters
export JWT_EXPIRATION=86400000

# Database (for each service)
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/dbname
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=password

# Server Ports
export SERVER_PORT=8081
```

### Production Database

To use PostgreSQL instead of H2, update `application.properties`:

```properties
# PostgreSQL Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/employeedb
spring.datasource.driverClassName=org.postgresql.Driver
spring.datasource.username=postgres
spring.datasource.password=your-password

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
```

## 🔄 Inter-Service Communication

Services communicate through:
- **Synchronous REST calls** (via API Gateway or direct)
- **JWT tokens** passed in Authorization headers
- **Circuit breakers** for fault tolerance

## 🧪 Testing

Run tests for all services:
```bash
mvn test
```

Run tests for a specific service:
```bash
cd microservices/auth-service
mvn test
```

## 📦 Building for Production

Build all services:
```bash
mvn clean package
```

Build individual service:
```bash
cd microservices/auth-service
mvn clean package
```

Run JAR file:
```bash
java -jar target/auth-service-1.0.0.jar
```

## 🚨 Troubleshooting

### Port Already in Use
If a port is already in use, update the `server.port` in the respective `application.properties`.

### Database Connection Issues
Ensure the database is running and credentials are correct in `application.properties`.

### Service Discovery
Services are configured with Eureka disabled by default. To enable:
```properties
eureka.client.enabled=true
eureka.client.service-url.default-zone=http://localhost:8761/eureka/
```

## 🛣️ Future Enhancements

- [ ] Service Discovery with Eureka
- [ ] Centralized Configuration with Spring Cloud Config
- [ ] Distributed Tracing with Zipkin/Sleuth
- [ ] Message Queue integration (RabbitMQ/Kafka)
- [ ] API Documentation with Swagger UI
- [ ] Docker containerization
- [ ] Kubernetes deployment manifests
- [ ] CI/CD pipeline integration
- [ ] Database per service with proper data consistency
- [ ] Event-driven architecture for async communication

## 📄 License

This project is created for educational purposes.

## 👥 Contributors

- Employee Management System Team
