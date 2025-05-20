package com.wedding.manager.controller;

import com.wedding.manager.model.Guest;
import com.wedding.manager.model.User;
import com.wedding.manager.model.Wedding;
import com.wedding.manager.payload.response.MessageResponse;
import com.wedding.manager.repository.GuestRepository;
import com.wedding.manager.repository.UserRepository;
import com.wedding.manager.repository.WeddingRepository;
import com.wedding.manager.security.service.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/guests")
public class GuestController {

    @Autowired
    private GuestRepository guestRepository;

    @Autowired
    private WeddingRepository weddingRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/wedding/{weddingId}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> getGuestsByWeddingId(@PathVariable Long weddingId) {
        User currentUser = getCurrentUser();
        return weddingRepository.findById(weddingId)
                .map(wedding -> {
                    if (!isAuthorized(wedding, currentUser)) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to view guests of this wedding"));
                    }
                    List<Guest> guests = guestRepository.findByWeddingId(weddingId);
                    return ResponseEntity.ok(guests);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/wedding/{weddingId}/status/{status}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> getGuestsByStatus(@PathVariable Long weddingId, @PathVariable Guest.InvitationStatus status) {
        User currentUser = getCurrentUser();
        return weddingRepository.findById(weddingId)
                .map(wedding -> {
                    if (!isAuthorized(wedding, currentUser)) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to view guests of this wedding"));
                    }
                    List<Guest> guests = guestRepository.findByWeddingIdAndInvitationStatus(weddingId, status);
                    return ResponseEntity.ok(guests);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> getGuestById(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        return guestRepository.findById(id)
                .map(guest -> {
                    if (!isAuthorized(guest.getWedding(), currentUser)) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to view this guest"));
                    }
                    return ResponseEntity.ok(guest);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/wedding/{weddingId}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> addGuest(@PathVariable Long weddingId, @Valid @RequestBody Guest guest) {
        User currentUser = getCurrentUser();
        return weddingRepository.findById(weddingId)
                .map(wedding -> {
                    if (!isAuthorized(wedding, currentUser)) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to add guests to this wedding"));
                    }
                    guest.setWedding(wedding);
                    Guest savedGuest = guestRepository.save(guest);
                    return ResponseEntity.ok(savedGuest);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> updateGuest(@PathVariable Long id, @Valid @RequestBody Guest guestDetails) {
        User currentUser = getCurrentUser();
        return guestRepository.findById(id)
                .map(guest -> {
                    if (!isAuthorized(guest.getWedding(), currentUser)) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to update this guest"));
                    }
                    guest.setFirstName(guestDetails.getFirstName());
                    guest.setLastName(guestDetails.getLastName());
                    guest.setEmail(guestDetails.getEmail());
                    guest.setPhoneNumber(guestDetails.getPhoneNumber());
                    guest.setAddress(guestDetails.getAddress());
                    guest.setInvitationStatus(guestDetails.getInvitationStatus());
                    guest.setPlusOne(guestDetails.isPlusOne());
                    guest.setNumberOfAccompanying(guestDetails.getNumberOfAccompanying());
                    guest.setDietaryRestrictions(guestDetails.getDietaryRestrictions());
                    guest.setNotes(guestDetails.getNotes());
                    
                    Guest updatedGuest = guestRepository.save(guest);
                    return ResponseEntity.ok(updatedGuest);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status/{status}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> updateGuestStatus(@PathVariable Long id, @PathVariable Guest.InvitationStatus status) {
        User currentUser = getCurrentUser();
        return guestRepository.findById(id)
                .map(guest -> {
                    if (!isAuthorized(guest.getWedding(), currentUser)) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to update this guest"));
                    }
                    guest.setInvitationStatus(status);
                    Guest updatedGuest = guestRepository.save(guest);
                    return ResponseEntity.ok(updatedGuest);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteGuest(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        return guestRepository.findById(id)
                .map(guest -> {
                    if (!isAuthorized(guest.getWedding(), currentUser)) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to delete this guest"));
                    }
                    guestRepository.delete(guest);
                    return ResponseEntity.ok(new MessageResponse("Guest deleted successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/count/wedding/{weddingId}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> getGuestCount(@PathVariable Long weddingId) {
        User currentUser = getCurrentUser();
        return weddingRepository.findById(weddingId)
                .map(wedding -> {
                    if (!isAuthorized(wedding, currentUser)) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to access this wedding's information"));
                    }
                    Long count = guestRepository.countByWeddingId(weddingId);
                    return ResponseEntity.ok(count);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/count/wedding/{weddingId}/status/{status}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> getGuestCountByStatus(@PathVariable Long weddingId, @PathVariable Guest.InvitationStatus status) {
        User currentUser = getCurrentUser();
        return weddingRepository.findById(weddingId)
                .map(wedding -> {
                    if (!isAuthorized(wedding, currentUser)) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to access this wedding's information"));
                    }
                    Long count = guestRepository.countByWeddingIdAndInvitationStatus(weddingId, status);
                    return ResponseEntity.ok(count);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private boolean isAuthorized(Wedding wedding, User user) {
        return wedding.getCouples().contains(user) || 
               user.getRoles().stream().anyMatch(r -> r.getName().name().equals("ROLE_ADMIN"));
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));
    }
} 