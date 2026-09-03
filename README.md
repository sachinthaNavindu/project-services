# Project Services

Project Services is the parent repository for the core application microservices. It combines the Student, Program, and Enrollment services into a single Maven multi-module project and provides PM2-based process management for running the services together.

## Overview

The repository contains the following microservices:

* **Student-Service** — manages student records and profile information.
* **Program-Service** — manages program information.
* **Enrollment-Service** — manages student enrollments and integrates with Student-Service.

The project also includes a PM2 configuration for running the services and the Cloud SQL Auth Proxy in a managed environment.

## Architecture

```text
                         ┌─────────────────────┐
                         │     API Gateway     │
                         │        :7000        │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
     ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────────┐
     │ Student-Service │   │ Program-Service │   │ Enrollment-Service  │
     │      :8000      │   │      :8001      │   │        :8002         │
     └────────┬────────┘   └────────┬────────┘   └──────────┬──────────┘
              │                     │                       │
              ▼                     ▼                       ▼
        PostgreSQL              MongoDB                   MySQL


                 ┌─────────────────────────────┐
                 │      Service Registry       │
                 │           :9001             │
                 └─────────────────────────────┘

                 ┌─────────────────────────────┐
                 │        Config Server        │
                 │           :9000             │
                 └─────────────────────────────┘
```

## Services

| Service            |   Port | Database   | Purpose               |
| ------------------ | -----: | ---------- | --------------------- |
| Student-Service    | `8000` | PostgreSQL | Student management    |
| Program-Service    | `8001` | MongoDB    | Program management    |
| Enrollment-Service | `8002` | MySQL      | Enrollment management |

## Infrastructure

| Component        |   Port | Purpose                   |
| ---------------- | -----: | ------------------------- |
| API Gateway      | `7000` | API routing               |
| Config Server    | `9000` | Centralized configuration |
| Service Registry | `9001` | Service discovery         |

## Project Structure

```text
project-services/
│
├── service-student/
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── service-program/
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── service-enrollment/
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── ecosystem.config.js
├── pom.xml
└── .gitmodules
```

The root Maven project uses `pom` packaging and includes the three service modules:

```xml
<modules>
    <module>service-student</module>
    <module>service-program</module>
    <module>service-enrollment</module>
</modules>
```

## Technology Stack

| Technology           | Purpose                         |
| -------------------- | ------------------------------- |
| Java 25              | Application development         |
| Spring Boot          | Microservice framework          |
| Spring Cloud         | Service infrastructure          |
| Maven                | Build and dependency management |
| PostgreSQL           | Student-Service database        |
| MongoDB              | Program-Service database        |
| MySQL                | Enrollment-Service database     |
| Eureka               | Service discovery               |
| Spring Cloud Config  | Centralized configuration       |
| PM2                  | Process management              |
| Cloud SQL Auth Proxy | Cloud database connectivity     |

## Prerequisites

Install the following before running the project:

* Java 25
* Maven
* PM2
* PostgreSQL
* MongoDB
* MySQL

For the complete platform, the following infrastructure services should also be running:

* Config Server
* Service Registry
* API Gateway

## Clone the Repository

```bash
git clone https://github.com/sachinthaNavindu/project-services.git
cd project-services
```

## Build All Services

The repository is configured as a Maven multi-module project.

Run:

```bash
./mvnw clean package
```

On Windows:

```bash
mvnw.cmd clean package
```

This builds all three services:

```text
service-student
service-program
service-enrollment
```

## Run Services Individually

### Student-Service

```bash
cd service-student
./mvnw spring-boot:run
```

### Program-Service

```bash
cd service-program
./mvnw spring-boot:run
```

### Enrollment-Service

```bash
cd service-enrollment
./mvnw spring-boot:run
```

## Running with PM2

The repository includes `ecosystem.config.js` for running the services with PM2.

The configuration starts:

* Cloud SQL Auth Proxy
* Student-Service
* Program-Service
* Enrollment-Service

The three application services are started from their built JAR files.

```bash
pm2 start ecosystem.config.js
```

Check running processes:

```bash
pm2 status
```

View logs:

```bash
pm2 logs
```

View a specific service:

```bash
pm2 logs service-student
pm2 logs service-program
pm2 logs service-enrollment
```

## PM2 Configuration

The current PM2 configuration runs the services using the following JARs:

```text
service-student/target/Student-Service-1.0.0.jar
service-program/target/Program-Service-1.0.0.jar
service-enrollment/target/Enrollment-Service-1.0.0.jar
```

Student-Service, Program-Service, and Enrollment-Service are configured with two PM2 instances each.

The configuration also includes the Cloud SQL Auth Proxy for MySQL and PostgreSQL connectivity.

## Recommended Startup Order

For the complete microservices platform, start the infrastructure first:

```text
1. Config Server       :9000
2. Service Registry    :9001
3. API Gateway         :7000

4. Student-Service     :8000
5. Program-Service     :8001
6. Enrollment-Service  :8002
```

This ensures that centralized configuration and service discovery are available before the application services start.

## Service Communication

The services communicate through the microservices infrastructure.

```text
                    API Gateway
                       :7000
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
      Student         Program       Enrollment
      Service         Service         Service
       :8000           :8001           :8002
          ▲                              │
          │                              │
          └──────── Student Data ────────┘
```

Enrollment-Service communicates with Student-Service to retrieve student information when required.

## Configuration

Service configuration is managed centrally through the Config Server.

```text
                    Config Server
                       :9000
                          │
            ┌─────────────┼─────────────┐
            │             │             │
            ▼             ▼             ▼
       Student         Program      Enrollment
       Service          Service       Service
```

This keeps service configuration centralized and consistent across the application.

## Service Discovery

The application services use Eureka for service registration and discovery.

```text
Student-Service ───────┐
Program-Service ───────┼──► Service Registry :9001
Enrollment-Service ────┘
```

This allows services to locate one another without depending on fixed service addresses.

## Database Configuration

Each application service uses its own database technology:

```text
Student-Service
      │
      ▼
 PostgreSQL

Program-Service
      │
      ▼
 MongoDB

Enrollment-Service
      │
      ▼
 MySQL
```

In cloud deployments, the repository's PM2 configuration can start the Cloud SQL Auth Proxy to provide connectivity to the configured MySQL and PostgreSQL Cloud SQL instances.

## Health Checks

Each Spring Boot service exposes an Actuator health endpoint:

```http
GET /actuator/health
```

Example:

```json
{
  "status": "UP"
}
```

Service health can also be monitored through the PM2 process status and application logs.

## Useful PM2 Commands

Start the complete configuration:

```bash
pm2 start ecosystem.config.js
```

Check processes:

```bash
pm2 status
```

Restart all services:

```bash
pm2 restart all
```

Stop all services:

```bash
pm2 stop all
```

View logs:

```bash
pm2 logs
```

Save the current PM2 process list:

```bash
pm2 save
```

## Repository Role

This repository acts as the **application-services layer** of the overall platform.

```text
┌───────────────────────────────────────────────┐
│                 Platform Layer                │
│                                               │
│  Config Server ─ Service Registry ─ Gateway  │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│              Project Services                 │
│                                               │
│ Student │ Program │ Enrollment                │
└───────────────────────────────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│                  Databases                    │
│                                               │
│ PostgreSQL │ MongoDB │ MySQL                  │
└───────────────────────────────────────────────┘
```

