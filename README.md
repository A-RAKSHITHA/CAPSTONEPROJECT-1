# ArogyaTrack

### Track Health. Connect Care. Stay Well.

**ArogyaTrack** is an end-to-end community-health monitoring and clinical decision-support platform designed to empower rural and underserved community members, village health workers (ANMs/ASHA workers), and district healthcare administrators. The platform facilitates continuous longitudinal health tracking, validated predictive risk assessments, bilingual (Telugu & English) voice-enabled care coordination, and proactive follow-up management.

---

> **Academic Project Reference:**  
> *Big Data–Driven Rural Health Risk Monitoring System: Chronic Kidney Disease Risk Prediction and Nurse-Assisted Follow-up*

---

## 🏥 Core Healthcare Workflow

```
COLLECT ➔ STORE ➔ ASSESS ➔ PRIORITIZE ➔ REVIEW ➔ CONNECT ➔ FOLLOW UP ➔ UPDATE ➔ MONITOR
```

1. **Collect & Store:** Community members record 24 clinically validated indicators alongside lifestyle logs (water intake, physical activity, sleep, diet, smoking/alcohol status).
2. **Predictive Risk Assessment:** Spring Boot communicates with a dedicated Python ML service to evaluate health parameters using validated Logistic Regression and Random Forest models.
3. **Priority Review & Triage:** High-risk assessments are immediately flagged into the assigned Health Worker's Priority Review queue without asserting an automated diagnostic label.
4. **Care Coordination:** Health workers review member histories, initiate bilingual (Telugu / English) messaging with hands-free voice-to-text dictation, and schedule targeted follow-ups.
5. **Continuous Monitoring:** Updates dynamically feed the community member's **My Health Journey** timeline, fostering continuous health vigilance.

---

## 🏛️ System Architecture

```
+-------------------------------------------------------------+
|                      React 18 Frontend                      |
|           Tailwind CSS • Lucide Icons • Web Speech          |
|                   http://localhost:5173                     |
+------------------------------+------------------------------+
                               | REST APIs (JWT Auth)
                               v
+-------------------------------------------------------------+
|                  Spring Boot 3.2.4 Backend                  |
|             Spring Security • JPA • JJWT • BCrypt           |
|                   http://localhost:8080                     |
+---------------+-----------------------------+---------------+
                |                             |
     SQL / JPA  |                             | HTTP / JSON
                v                             v
+-------------------------------+ +---------------------------+
|          MySQL 8.0            | |    Python ML Service      |
|    arogyatrack_db (Port 3306) | |  Scikit-Learn • Flask     |
| 8 Normalized Relational Tables| |   http://localhost:5000   |
+-------------------------------+ +---------------------------+
```

---

## 👥 Three Main Roles & Default Credentials

Seed credentials are automatically created during initial backend startup:

| Role | Name | Email | Password | Access Portal |
| :--- | :--- | :--- | :--- | :--- |
| **Community Member** | Ramesh Kumar | `ramesh@arogyatrack.org` | `user123` | `/user/dashboard` |
| **Health Worker (Nurse)** | Sister Lakshmi | `nurse@arogyatrack.org` | `nurse123` | `/nurse/dashboard` |
| **District Administrator** | Dr. Admin Rao | `admin@arogyatrack.org` | `admin123` | `/admin/dashboard` |

---

## 🤖 Validated Machine Learning Models

Trained strictly on the **Kaggle Chronic Kidney Disease Dataset** (400 patient records across 24 clinical features, 80/20 train-test split):

| Model | Accuracy | Precision | Recall | F1-Score | ROC-AUC |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Logistic Regression** | **98.75%** | **100.0%** | **98.00%** | **0.9899** | **1.0000** |
| **Random Forest (Primary)**| **100.0%** | **100.0%** | **100.0%** | **1.0000** | **1.0000** |

*Artifacts saved in `ml-service/models/` and loaded dynamically via `joblib`.*

---

## 🗣️ Bilingual & Voice Capabilities

* **Telugu & English Support:** Full communication portal allowing health workers and members to communicate in English or Telugu (`te-IN`).
* **Web Speech Recognition:** Click-to-speak microphone dictation in English and Telugu. Dictated text is always inserted into an editable input box for verification before sending.
* **Predefined Telugu Clinical Quick Responses:**
  * *"నమస్కారం! మీ ఆరోగ్యం గురించి మాట్లాడటానికి సందేశం పంపుతున్నాను."* (Greetings! Checking in on your health.)
  * *"దయచేసి ఎక్కువ నీరు త్రాగండి మరియు తక్కువ ఉప్పు తీసుకోండి."* (Please drink plenty of water and limit salt intake.)
  * *"మీ తదుపరి ఫాలో-అప్ ఈ వారం షెడ్యూల్ చేయబడింది."* (Your next follow-up is scheduled this week.)

---

## 🚀 Quick Start Guide

### 1. Database Setup (MySQL)
Ensure MySQL is running on port 3306. Initialize the database schema:
```bash
mysql -u root -p < database/schema.sql
```

### 2. ML Service Setup (Python 3.10+)
```bash
cd ml-service
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
python src/train.py    # Trains and saves models
python app.py          # Starts Flask server on port 5000
```

### 3. Backend Setup (Java 17+ / Maven 3.9+)
```bash
cd backend
mvn clean compile
mvn spring-boot:run    # Starts Spring Boot on port 8080
```

### 4. Frontend Setup (Node 18+)
```bash
cd frontend
npm install
npm run dev            # Starts Vite dev server on port 5173
```

---

## 📦 Project Directory Layout

```text
arogyatrack/
├── backend/            # Spring Boot REST API
│   ├── src/main/java/com/arogyatrack/
│   │   ├── config/     # Security, JWT, WebMvc, RestTemplate
│   │   ├── controller/ # Auth, User, Health, Nurse, Admin, Message, etc.
│   │   ├── dto/        # Request & Response Data Transfer Objects
│   │   ├── entity/     # JPA Entities (8 relational tables)
│   │   ├── repository/ # Spring Data JPA Repositories
│   │   └── service/    # Business logic & ML client integration
│   └── pom.xml
├── frontend/           # React 18 + Vite + Tailwind CSS SPA
│   ├── src/
│   │   ├── api/        # Axios API clients
│   │   ├── components/ # Modular UI components (HealthForm, MessageBox, etc.)
│   │   ├── context/    # Auth state management
│   │   ├── hooks/      # Speech recognition custom hooks
│   │   └── pages/      # User, Nurse, and Admin pages
│   ├── package.json
│   └── vite.config.js
├── ml-service/         # Scikit-learn Flask Microservice
│   ├── data/           # Kaggle kidney_disease.csv
│   ├── models/         # Serialized joblib pipelines & model_metrics.json
│   ├── src/            # Preprocessing, training, evaluation, inference
│   ├── app.py          # Flask REST API (/predict, /metrics, /health)
│   └── requirements.txt
├── database/
│   └── schema.sql      # MySQL DDL with indexing and seed data
└── README.md
```

---

## ⚖️ Safety & Non-Diagnostic Disclaimer

> **IMPORTANT MEDICAL NOTICE:**  
> ArogyaTrack is an academic healthcare prototype and decision-support tool. It does not provide medical diagnoses, treatment prescriptions, or definitive medical advice. Machine learning risk assessments prioritize community members for clinical evaluation by certified healthcare practitioners.
