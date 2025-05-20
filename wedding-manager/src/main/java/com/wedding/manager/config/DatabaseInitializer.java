package com.wedding.manager.config;

import com.wedding.manager.model.ERole;
import com.wedding.manager.model.Role;
import com.wedding.manager.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Override
    public void run(String... args) {
        // Initialize roles if they don't exist
        for (ERole role : ERole.values()) {
            if (!roleRepository.existsById(role.ordinal() + 1)) {
                roleRepository.save(new Role(role));
            }
        }
    }
} 