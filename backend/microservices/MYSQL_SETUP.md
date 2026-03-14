# MySQL (XAMPP) Setup Guide for Employee Management System

## Step 1: Start XAMPP Services

1. Open **XAMPP Control Panel**
2. Start **Apache** (optional, for phpMyAdmin)
3. Start **MySQL** (required)
4. Wait until both show "Running" status

## Step 2: Access phpMyAdmin

1. Open your browser
2. Go to: `http://localhost/phpmyadmin/`
3. You should see the phpMyAdmin dashboard

## Step 3: Create Databases

### Option A: Using SQL Script (Recommended)

1. In phpMyAdmin, click on the **SQL** tab at the top
2. Copy the contents of `database-setup.sql`
3. Paste it into the SQL query box
4. Click **Go** button
5. You should see 3 new databases:
   - `auth_service_db`
   - `user_service_db`
   - `employee_service_db`

### Option B: Manual Creation

1. In phpMyAdmin, click **New** in the left sidebar
2. Enter database name: `auth_service_db`
3. Select Collation: `utf8mb4_unicode_ci`
4. Click **Create**
5. Repeat for `user_service_db` and `employee_service_db`

## Step 4: Verify Database Creation

1. In phpMyAdmin, you should now see all 3 databases in the left sidebar
2. Click on each database to verify they're empty (no tables yet)
3. Tables will be created automatically when you run the Java services

## Step 5: Configure Database Connection (Already Done)

The application is already configured with these settings:

| Service | Port | Database |
|---------|------|----------|
| Auth Service | 8081 | auth_service_db |
| User Service | 8082 | user_service_db |
| Employee Service | 8083 | employee_service_db |

**Default MySQL Settings:**
- Host: `localhost`
- Port: `3306`
- Username: `root`
- Password: `` (empty)

## Step 6: Build the Project

Open Command Prompt in the backend folder:

```bash
cd "c:\Users\pro\Desktop\resource management system\backend\microservices"
mvn clean install
```

## Step 7: Run the Microservices

Run each service in a separate Command Prompt window:

### Terminal 1 - Auth Service
```bash
cd "c:\Users\pro\Desktop\resource management system\backend\microservices\auth-service"
mvn spring-boot:run
```

### Terminal 2 - User Service
```bash
cd "c:\Users\pro\Desktop\resource management system\backend\microservices\user-service"
mvn spring-boot:run
```

### Terminal 3 - Employee Service
```bash
cd "c:\Users\pro\Desktop\resource management system\backend\microservices\employee-service"
mvn spring-boot:run
```

### Terminal 4 - API Gateway
```bash
cd "c:\Users\pro\Desktop\resource management system\backend\microservices\api-gateway"
mvn spring-boot:run
```

## Step 8: Verify Services are Running

1. Check the console output for each service
2. You should see "Started [ServiceName] in X seconds"
3. Check phpMyAdmin - tables should now be created in each database

## Step 9: Test the API

### Login Test
```bash
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin12\"}"
```

### Access Protected Endpoint
```bash
curl -X GET http://localhost:8080/api/users ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"

**Solution:** If you set a MySQL password, update all `application.properties` files:

```properties
spring.datasource.password=your_password
```

### Error: "Communications link failure"

**Solution:** Make sure MySQL is running in XAMPP Control Panel

### Error: "Unknown database"

**Solution:** Run the database-setup.sql script in phpMyAdmin

### Port Already in Use

**Solution:** Change the port in the respective `application.properties`:

```properties
server.port=8081  # Change to different port
```

## Viewing Database Tables

After running the services:

1. Go to phpMyAdmin
2. Click on `auth_service_db` - you'll see tables like:
   - `users`
   - `user_permissions`
3. Click on `user_service_db` - similar tables
4. Click on `employee_service_db` - you'll see:
   - `employees`

## Default Users

The Auth Service will create these users on first startup:

| Role | Username | Password | Email |
|------|----------|----------|-------|
| SUPER_ADMIN | admin | admin12 | admin@company.com |
| HR_MANAGER | hrmanager | admin12 | hr@company.com |
| EMPLOYEE | employee | admin12 | employee@company.com |

## Changing MySQL Password

If you want to set a password for MySQL:

1. In XAMPP Control Panel, click **Config** next to MySQL
2. Click **my.ini**
3. Find the line: `skip-grant-tables`
4. Comment it out: `#skip-grant-tables`
5. Restart MySQL
6. Set password in phpMyAdmin or use:
   ```sql
   SET PASSWORD FOR 'root'@'localhost' = PASSWORD('your_new_password');
   ```
7. Update all `application.properties` files with the new password

## Additional Resources

- **phpMyAdmin**: http://localhost/phpmyadmin/
- **Auth Service**: http://localhost:8081
- **User Service**: http://localhost:8082
- **Employee Service**: http://localhost:8083
- **API Gateway**: http://localhost:8080
