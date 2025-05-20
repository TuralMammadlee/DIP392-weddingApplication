package com.wedding.manager.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "venues")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Venue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String name;

    @Size(max = 500)
    private String description;

    @NotBlank
    @Size(max = 200)
    private String address;

    @Size(max = 50)
    private String city;

    @Size(max = 50)
    private String state;

    @Size(max = 20)
    private String zipCode;

    @Size(max = 20)
    private String phoneNumber;

    @Size(max = 100)
    private String email;

    @NotNull
    private Integer capacity;

    @NotNull
    private BigDecimal pricePerDay;

    private boolean available = true;

    @ElementCollection
    private Set<String> amenities = new HashSet<>();

    @ElementCollection
    private Set<String> imageUrls = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;
} 