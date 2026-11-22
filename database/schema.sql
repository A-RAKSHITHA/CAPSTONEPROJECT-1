-- ==========================================================
-- ArogyaTrack Database Schema
-- Tagline: Track Health. Connect Care. Stay Well.
-- ==========================================================

CREATE DATABASE IF NOT EXISTS arogyatrack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE arogyatrack;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone_number VARCHAR(30) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
    village_community VARCHAR(150) NOT NULL,
    district VARCHAR(150) NOT NULL,
    age INT DEFAULT NULL,
    gender VARCHAR(30) DEFAULT NULL,
    assigned_nurse_id BIGINT DEFAULT NULL,
    profile_photo LONGTEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role),
    INDEX idx_user_assigned_nurse (assigned_nurse_id),
    CONSTRAINT fk_user_assigned_nurse FOREIGN KEY (assigned_nurse_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: health_workers
CREATE TABLE IF NOT EXISTS health_workers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    specialization VARCHAR(150) DEFAULT 'Community Health Care',
    assigned_area VARCHAR(150) NOT NULL,
    qualification VARCHAR(150) DEFAULT 'ANM / GNM Nursing',
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hw_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: health_records (Contains actual Kaggle CKD clinical features)
CREATE TABLE IF NOT EXISTS health_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    age DOUBLE DEFAULT NULL,
    bp DOUBLE DEFAULT NULL,
    sg DOUBLE DEFAULT NULL,
    al DOUBLE DEFAULT NULL,
    su DOUBLE DEFAULT NULL,
    rbc VARCHAR(20) DEFAULT 'normal',
    pc VARCHAR(20) DEFAULT 'normal',
    pcc VARCHAR(20) DEFAULT 'notpresent',
    ba VARCHAR(20) DEFAULT 'notpresent',
    bgr DOUBLE DEFAULT NULL,
    bu DOUBLE DEFAULT NULL,
    sc DOUBLE DEFAULT NULL,
    sod DOUBLE DEFAULT NULL,
    pot DOUBLE DEFAULT NULL,
    hemo DOUBLE DEFAULT NULL,
    pcv DOUBLE DEFAULT NULL,
    wc DOUBLE DEFAULT NULL,
    rc DOUBLE DEFAULT NULL,
    htn VARCHAR(10) DEFAULT 'no',
    dm VARCHAR(10) DEFAULT 'no',
    cad VARCHAR(10) DEFAULT 'no',
    appet VARCHAR(20) DEFAULT 'good',
    pe VARCHAR(10) DEFAULT 'no',
    ane VARCHAR(10) DEFAULT 'no',
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_hr_user (user_id),
    INDEX idx_hr_recorded_at (recorded_at),
    CONSTRAINT fk_hr_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: predictions (Stores ML assessment results)
CREATE TABLE IF NOT EXISTS predictions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    record_id BIGINT NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    prediction INT NOT NULL,
    prediction_probability DOUBLE DEFAULT NULL,
    assessment_result VARCHAR(100) NOT NULL,
    priority_review BOOLEAN NOT NULL DEFAULT FALSE,
    priority_level VARCHAR(50) DEFAULT 'Low',
    lr_prediction INT DEFAULT NULL,
    lr_probability DOUBLE DEFAULT NULL,
    rf_prediction INT DEFAULT NULL,
    rf_probability DOUBLE DEFAULT NULL,
    prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_pred_user (user_id),
    INDEX idx_pred_record (record_id),
    INDEX idx_pred_priority (priority_review),
    CONSTRAINT fk_pred_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_pred_record FOREIGN KEY (record_id) REFERENCES health_records (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: lifestyle_records (Chronological lifestyle habit records)
CREATE TABLE IF NOT EXISTS lifestyle_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    food_habits VARCHAR(255) DEFAULT NULL,
    water_intake VARCHAR(100) DEFAULT NULL,
    physical_activity VARCHAR(255) DEFAULT NULL,
    exercise_frequency VARCHAR(100) DEFAULT NULL,
    sleep_duration VARCHAR(100) DEFAULT NULL,
    smoking_status VARCHAR(100) DEFAULT NULL,
    alcohol_consumption VARCHAR(100) DEFAULT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_lr_user (user_id),
    INDEX idx_lr_recorded (recorded_at),
    CONSTRAINT fk_lr_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: followups (Health Worker follow-up records)
CREATE TABLE IF NOT EXISTS followups (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    nurse_id BIGINT NOT NULL,
    prediction_id BIGINT DEFAULT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'Low',
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    followup_date DATE NOT NULL,
    remarks TEXT DEFAULT NULL,
    action_taken TEXT DEFAULT NULL,
    next_followup_date DATE DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_fu_user (user_id),
    INDEX idx_fu_nurse (nurse_id),
    INDEX idx_fu_status (status),
    CONSTRAINT fk_fu_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_fu_nurse FOREIGN KEY (nurse_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_fu_pred FOREIGN KEY (prediction_id) REFERENCES predictions (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: messages (Supports Telugu and English communication)
CREATE TABLE IF NOT EXISTS messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    language VARCHAR(20) NOT NULL DEFAULT 'EN',
    read_status BOOLEAN NOT NULL DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_msg_sender (sender_id),
    INDEX idx_msg_receiver (receiver_id),
    INDEX idx_msg_user (user_id),
    CONSTRAINT fk_msg_sender FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_msg_receiver FOREIGN KEY (receiver_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_msg_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: notifications (Database-backed alerts & reminders)
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT DEFAULT NULL,
    nurse_id BIGINT DEFAULT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_notif_user (user_id),
    INDEX idx_notif_nurse (nurse_id),
    INDEX idx_notif_status (status),
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_notif_nurse FOREIGN KEY (nurse_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
