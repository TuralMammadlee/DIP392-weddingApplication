package com.wedding.manager.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "guests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Guest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    private String firstName;

    @NotBlank
    @Size(max = 50)
    private String lastName;

    @Email
    @Size(max = 50)
    private String email;

    @Size(max = 15)
    private String phoneNumber;

    @Size(max = 200)
    private String address;

    @Enumerated(EnumType.STRING)
    private InvitationStatus invitationStatus = InvitationStatus.PENDING;

    @ManyToOne
    @JoinColumn(name = "wedding_id")
    private Wedding wedding;

    private Integer numberOfAccompanying = 0;
    
    private boolean plusOne = false;
    
    @Size(max = 500)
    private String dietaryRestrictions;
    
    @Size(max = 500)
    private String notes;

    public enum InvitationStatus {
        PENDING,
        INVITED,
        CONFIRMED,
        DECLINED
    }
} 