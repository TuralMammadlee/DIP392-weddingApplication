package com.wedding.manager.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "vendors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vendor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    private VendorType type;

    @Size(max = 500)
    private String description;

    @Size(max = 100)
    private String contactName;

    @Size(max = 15)
    private String phoneNumber;

    @Email
    @Size(max = 50)
    private String email;

    @Size(max = 200)
    private String website;

    @NotNull
    private BigDecimal cost;

    private BigDecimal depositAmount;

    private boolean depositPaid = false;

    private boolean fullyPaid = false;

    @ManyToOne
    @JoinColumn(name = "wedding_id")
    private Wedding wedding;

    @Size(max = 1000)
    private String notes;

    public enum VendorType {
        CATERING,
        PHOTOGRAPHY,
        VIDEOGRAPHY,
        FLORIST,
        MUSIC,
        CAKE,
        TRANSPORTATION,
        DECOR,
        ATTIRE,
        BEAUTY,
        OFFICIANT,
        OTHER
    }
} 