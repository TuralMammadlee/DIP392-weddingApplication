package com.wedding.manager.controller;

import com.wedding.manager.model.User;
import com.wedding.manager.model.Venue;
import com.wedding.manager.payload.response.MessageResponse;
import com.wedding.manager.repository.UserRepository;
import com.wedding.manager.repository.VenueRepository;
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
@RequestMapping("/api/venues")
public class VenueController {
    @Autowired
    private VenueRepository venueRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/public/available")
    public ResponseEntity<List<Venue>> getAllAvailableVenues() {
        List<Venue> venues = venueRepository.findByAvailable(true);
        return ResponseEntity.ok(venues);
    }

    @GetMapping("/public/search/city/{city}")
    public ResponseEntity<List<Venue>> searchVenuesByCity(@PathVariable String city) {
        List<Venue> venues = venueRepository.findByCityContainingIgnoreCase(city);
        return ResponseEntity.ok(venues);
    }

    @GetMapping("/public/search/state/{state}")
    public ResponseEntity<List<Venue>> searchVenuesByState(@PathVariable String state) {
        List<Venue> venues = venueRepository.findByStateContainingIgnoreCase(state);
        return ResponseEntity.ok(venues);
    }

    @GetMapping("/public/search/capacity/{capacity}")
    public ResponseEntity<List<Venue>> searchVenuesByCapacity(@PathVariable Integer capacity) {
        List<Venue> venues = venueRepository.findByCapacityGreaterThanEqual(capacity);
        return ResponseEntity.ok(venues);
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<?> getVenueById(@PathVariable Long id) {
        return venueRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/owner")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Venue>> getMyVenues() {
        User currentUser = getCurrentUser();
        List<Venue> venues = venueRepository.findByOwner(currentUser);
        return ResponseEntity.ok(venues);
    }

    @PostMapping
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN')")
    public ResponseEntity<?> createVenue(@Valid @RequestBody Venue venue) {
        User currentUser = getCurrentUser();
        venue.setOwner(currentUser);
        Venue savedVenue = venueRepository.save(venue);
        return ResponseEntity.ok(savedVenue);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN')")
    public ResponseEntity<?> updateVenue(@PathVariable Long id, @Valid @RequestBody Venue venueDetails) {
        return venueRepository.findById(id)
                .map(venue -> {
                    User currentUser = getCurrentUser();
                    
                    // Check if user is owner of venue or admin
                    if (!venue.getOwner().getId().equals(currentUser.getId()) && 
                        !currentUser.getRoles().stream().anyMatch(r -> r.getName().name().equals("ROLE_ADMIN"))) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to update this venue"));
                    }
                    
                    venue.setName(venueDetails.getName());
                    venue.setDescription(venueDetails.getDescription());
                    venue.setAddress(venueDetails.getAddress());
                    venue.setCity(venueDetails.getCity());
                    venue.setState(venueDetails.getState());
                    venue.setZipCode(venueDetails.getZipCode());
                    venue.setEmail(venueDetails.getEmail());
                    venue.setPhoneNumber(venueDetails.getPhoneNumber());
                    venue.setCapacity(venueDetails.getCapacity());
                    venue.setPricePerDay(venueDetails.getPricePerDay());
                    venue.setAvailable(venueDetails.isAvailable());
                    venue.setAmenities(venueDetails.getAmenities());
                    venue.setImageUrls(venueDetails.getImageUrls());
                    
                    Venue updatedVenue = venueRepository.save(venue);
                    return ResponseEntity.ok(updatedVenue);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteVenue(@PathVariable Long id) {
        return venueRepository.findById(id)
                .map(venue -> {
                    User currentUser = getCurrentUser();
                    
                    // Check if user is owner of venue or admin
                    if (!venue.getOwner().getId().equals(currentUser.getId()) && 
                        !currentUser.getRoles().stream().anyMatch(r -> r.getName().name().equals("ROLE_ADMIN"))) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to delete this venue"));
                    }
                    
                    venueRepository.delete(venue);
                    return ResponseEntity.ok(new MessageResponse("Venue deleted successfully"));
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