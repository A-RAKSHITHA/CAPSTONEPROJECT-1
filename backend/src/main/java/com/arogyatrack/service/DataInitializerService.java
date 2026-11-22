package com.arogyatrack.service;

import com.arogyatrack.entity.HealthWorker;
import com.arogyatrack.entity.User;
import com.arogyatrack.repository.HealthWorkerRepository;
import com.arogyatrack.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializerService implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializerService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HealthWorkerRepository healthWorkerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            logger.info("Database is empty. Initializing default ArogyaTrack seed users...");

            // 1. Health Worker
            User nurse = new User();
            nurse.setFullName("Sunitha Rao (ANM)");
            nurse.setEmail("nurse@arogyatrack.org");
            nurse.setPhoneNumber("9848022338");
            nurse.setPassword(passwordEncoder.encode("nurse123"));
            nurse.setRole("ROLE_NURSE");
            nurse.setVillageCommunity("Chilakaluripet Community Health Centre");
            nurse.setDistrict("Guntur");
            nurse.setAge(34);
            nurse.setGender("Female");
            User savedNurse = userRepository.save(nurse);

            HealthWorker hw = new HealthWorker(savedNurse, "Guntur Rural Mandal", "B.Sc Nursing / GNM Senior Health Worker");
            healthWorkerRepository.save(hw);

            // 2. Admin
            User admin = new User();
            admin.setFullName("Dr. K. Srinivas (District Officer)");
            admin.setEmail("admin@arogyatrack.org");
            admin.setPhoneNumber("9848011223");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ROLE_ADMIN");
            admin.setVillageCommunity("District Health Administration");
            admin.setDistrict("Guntur");
            admin.setAge(46);
            admin.setGender("Male");
            userRepository.save(admin);

            // 3. Demo Community Member
            User member = new User();
            member.setFullName("Ramesh Kumar");
            member.setEmail("ramesh@arogyatrack.org");
            member.setPhoneNumber("9440188992");
            member.setPassword(passwordEncoder.encode("user123"));
            member.setRole("ROLE_USER");
            member.setVillageCommunity("Pasumarru Village");
            member.setDistrict("Guntur");
            member.setAge(48);
            member.setGender("Male");
            member.setAssignedNurse(savedNurse);
            userRepository.save(member);

            logger.info("Seed data created successfully: admin@arogyatrack.org, nurse@arogyatrack.org, ramesh@arogyatrack.org");
        }
    }
}
