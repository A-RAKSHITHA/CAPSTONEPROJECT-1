# ArogyaTrack - Spring Boot Backend

**Track Health. Connect Care. Stay Well.**

ArogyaTrack Backend is a production-style enterprise healthcare decision-support and community-monitoring service built using Java 21, Spring Boot 3.2, Spring Security with BCrypt, Spring Data JPA, and MySQL.

---

## 1. Architectural Highlights

* **Role-Based Access Control**:
  * `ROLE_USER`: Community Members (Manage own profile, submit health checks, track chronological history, view follow-ups, message health worker in Telugu/English, receive alerts)
  * `ROLE_NURSE`: Health Workers / ANM Nurses (Dashboard, priority reviews queue, member profiles, record follow-ups and next dates, bilingual messaging, quick request templates)
  * `ROLE_ADMIN`: Health Administrators (System-wide analytics, workload distribution, health worker assignments, non-fabricated trends)
* **Secure Authentication**: Stateless JWT (HMAC-SHA256) + BCrypt password hashing.
* **ML Service Orchestration**: Connects with Python Flask ML Service to evaluate Kaggle-derived clinical biomarkers via Logistic Regression and Random Forest ensembles.
* **Data Integrity**: Continuous historical tracking. Previous health assessments and lifestyle updates are preserved and never overwritten.

---

## 2. Directory Structure

```text
arogyatrack-backend/
├── src/
│   ├── main/
│   │   ├── java/com/arogyatrack/
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── UserController.java
│   │   │   │   ├── HealthRecordController.java
│   │   │   │   ├── PredictionController.java
│   │   │   │   ├── HealthWorkerController.java
│   │   │   │   ├── FollowUpController.java
│   │   │   │   ├── LifestyleController.java
│   │   │   │   ├── MessageController.java
│   │   │   │   ├── NotificationController.java
│   │   │   │   └── AdminController.java
│   │   │   ├── dto/
│   │   │   ├── entity/
│   │   │   ├── exception/
│   │   │   ├── repository/
│   │   │   ├── security/
│   │   │   └── service/
│   │   └── resources/
│   │       ├── application.properties
│   │       └── application.properties.example
├── pom.xml
└── README.md
```

---

## 3. Prerequisites

* **Java Development Kit (JDK)**: Version 21
* **Apache Maven**: Version 3.8+ or 3.9+
* **MySQL Server**: Version 8.0+
* **Python ML Service**: Running on `http://localhost:5000`

---

## 4. Configuration & Environment Variables

Copy `application.properties.example` to `application.properties` and customize if needed:

```properties
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=arogyatrack
DATABASE_USERNAME=root
DATABASE_PASSWORD=
ML_SERVICE_URL=http://localhost:5000
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
```

---

## 5. Build & Run

### Compile
```bash
mvn clean compile
```

### Run Application
```bash
mvn spring-boot:run
```

The server will start on `http://localhost:8080`.

---

## 6. Seed Credentials for Quick Testing

When started on a fresh database, ArogyaTrack automatically seeds initial accounts:

* **Administrator**: `admin@arogyatrack.org` / `admin123`
* **Health Worker**: `nurse@arogyatrack.org` / `nurse123`
* **Community Member**: `ramesh@arogyatrack.org` / `user123`

---

## 7. Medical Safety Notice

ArogyaTrack is an academic risk-monitoring and decision-support prototype. It does not replace professional medical diagnosis or treatment.
