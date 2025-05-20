package com.weddingplanner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class WeddingManagerApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(WeddingManagerApplication.class, args);
        System.out.println("Wedding Manager Application started successfully!");
        System.out.println("API server running at http://localhost:8080");
        System.out.println("To access the API documentation, navigate to http://localhost:8080/swagger-ui.html");
    }
} 