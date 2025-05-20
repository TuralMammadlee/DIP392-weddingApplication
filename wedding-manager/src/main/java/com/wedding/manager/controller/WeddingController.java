package com.wedding.manager.controller;

import com.wedding.manager.model.User;
import com.wedding.manager.model.Venue;
import com.wedding.manager.model.Wedding;
import com.wedding.manager.payload.response.MessageResponse;
import com.wedding.manager.repository.UserRepository;
import com.wedding.manager.repository.VenueRepository;
import com.wedding.manager.repository.WeddingRepository;
import com.wedding.manager.security.service.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/weddings")
public class WeddingController {
    @Autowired
    private WeddingRepository weddingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VenueRepository venueRepository;

    @GetMapping
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<List<Wedding>> getMyWeddings() {
        User currentUser = getCurrentUser();
        List<Wedding> weddings = weddingRepository.findAllByCouple(currentUser);
        return ResponseEntity.ok(weddings);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN') or hasRole('VENDOR')")
    public ResponseEntity<?> getWeddingById(@PathVariable Long id) {
        return weddingRepository.findById(id)
                .map(wedding -> {
                    User currentUser = getCurrentUser();
                    
                    // Check if user is a couple of the wedding, admin, or venue owner
                    if (wedding.getCouples().contains(currentUser) || 
                        currentUser.getRoles().stream().anyMatch(r -> r.getName().name().equals("ROLE_ADMIN")) ||
                        (wedding.getVenue() != null && wedding.getVenue().getOwner().getId().equals(currentUser.getId()))) {
                        return ResponseEntity.ok(wedding);
                    } else {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to view this wedding"));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> createWedding(@Valid @RequestBody Wedding wedding, 
                                           @RequestParam(required = false) Long venueId) {
        User currentUser = getCurrentUser();
        
        // Set the current user as a couple
        Set<User> couples = new HashSet<>();
        couples.add(currentUser);
        wedding.setCouples(couples);
        
        // Set venue if provided
        if (venueId != null) {
            Venue venue = venueRepository.findById(venueId)
                    .orElseThrow(() -> new RuntimeException("Error: Venue not found."));
            wedding.setVenue(venue);
        }
        
        Wedding savedWedding = weddingRepository.save(wedding);
        return ResponseEntity.ok(savedWedding);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> updateWedding(@PathVariable Long id, 
                                          @Valid @RequestBody Wedding weddingDetails,
                                          @RequestParam(required = false) Long venueId) {
        return weddingRepository.findById(id)
                .map(wedding -> {
                    User currentUser = getCurrentUser();
                    
                    // Check if user is a couple of the wedding or admin
                    if (!wedding.getCouples().contains(currentUser) && 
                        !currentUser.getRoles().stream().anyMatch(r -> r.getName().name().equals("ROLE_ADMIN"))) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to update this wedding"));
                    }
                    
                    wedding.setName(weddingDetails.getName());
                    wedding.setDate(weddingDetails.getDate());
                    wedding.setStartTime(weddingDetails.getStartTime());
                    wedding.setEndTime(weddingDetails.getEndTime());
                    wedding.setBudget(weddingDetails.getBudget());
                    wedding.setDescription(weddingDetails.getDescription());
                    
                    // Update venue if provided
                    if (venueId != null) {
                        Venue venue = venueRepository.findById(venueId)
                                .orElseThrow(() -> new RuntimeException("Error: Venue not found."));
                        wedding.setVenue(venue);
                    }
                    
                    Wedding updatedWedding = weddingRepository.save(wedding);
                    return ResponseEntity.ok(updatedWedding);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/addCouple")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> addCoupleToWedding(@PathVariable Long id, @RequestParam Long userId) {
        return weddingRepository.findById(id)
                .map(wedding -> {
                    User currentUser = getCurrentUser();
                    
                    // Check if user is a couple of the wedding or admin
                    if (!wedding.getCouples().contains(currentUser) && 
                        !currentUser.getRoles().stream().anyMatch(r -> r.getName().name().equals("ROLE_ADMIN"))) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to update this wedding"));
                    }
                    
                    User newCouple = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("Error: User not found."));
                    
                    wedding.getCouples().add(newCouple);
                    Wedding updatedWedding = weddingRepository.save(wedding);
                    
                    return ResponseEntity.ok(new MessageResponse("User added to wedding successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteWedding(@PathVariable Long id) {
        return weddingRepository.findById(id)
                .map(wedding -> {
                    User currentUser = getCurrentUser();
                    
                    // Check if user is a couple of the wedding or admin
                    if (!wedding.getCouples().contains(currentUser) && 
                        !currentUser.getRoles().stream().anyMatch(r -> r.getName().name().equals("ROLE_ADMIN"))) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to delete this wedding"));
                    }
                    
                    weddingRepository.delete(wedding);
                    return ResponseEntity.ok(new MessageResponse("Wedding deleted successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));
    }
} 