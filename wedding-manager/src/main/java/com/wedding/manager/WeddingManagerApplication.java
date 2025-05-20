package com.wedding.manager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class WeddingManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(WeddingManagerApplication.class, args);
    }
} 