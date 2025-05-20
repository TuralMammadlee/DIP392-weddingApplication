package com.wedding.manager.controller;

import com.wedding.manager.model.User;
import com.wedding.manager.model.Vendor;
import com.wedding.manager.model.Wedding;
import com.wedding.manager.payload.response.MessageResponse;
import com.wedding.manager.repository.UserRepository;
import com.wedding.manager.repository.VendorRepository;
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
@RequestMapping("/api/vendors")
public class VendorController {

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private WeddingRepository weddingRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/wedding/{weddingId}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> getVendorsByWeddingId(@PathVariable Long weddingId) {
        User currentUser = getCurrentUser();
        return weddingRepository.findById(weddingId)
                .map(wedding -> {
                    if (!isAuthorized(wedding, currentUser)) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to view vendors of this wedding"));
                    }
                    List<Vendor> vendors = vendorRepository.findByWeddingId(weddingId);
                    return ResponseEntity.ok(vendors);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/wedding/{weddingId}/type/{type}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> getVendorsByType(@PathVariable Long weddingId, @PathVariable Vendor.VendorType type) {
        User currentUser = getCurrentUser();
        return weddingRepository.findById(weddingId)
                .map(wedding -> {
                    if (!isAuthorized(wedding, currentUser)) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to view vendors of this wedding"));
                    }
                    List<Vendor> vendors = vendorRepository.findByWeddingIdAndType(weddingId, type);
                    return ResponseEntity.ok(vendors);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/wedding/{weddingId}/payment/deposit/{isPaid}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> getVendorsByDepositPaid(@PathVariable Long weddingId, @PathVariable boolean isPaid) {
        User currentUser = getCurrentUser();
        return weddingRepository.findById(weddingId)
                .map(wedding -> {
                    if (!isAuthorized(wedding, currentUser)) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to view vendors of this wedding"));
                    }
                    List<Vendor> vendors = vendorRepository.findByWeddingIdAndDepositPaid(weddingId, isPaid);
                    return ResponseEntity.ok(vendors);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/wedding/{weddingId}/payment/full/{isPaid}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> getVendorsByFullyPaid(@PathVariable Long weddingId, @PathVariable boolean isPaid) {
        User currentUser = getCurrentUser();
        return weddingRepository.findById(weddingId)
                .map(wedding -> {
                    if (!isAuthorized(wedding, currentUser)) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to view vendors of this wedding"));
                    }
                    List<Vendor> vendors = vendorRepository.findByWeddingIdAndFullyPaid(weddingId, isPaid);
                    return ResponseEntity.ok(vendors);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> getVendorById(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        return vendorRepository.findById(id)
                .map(vendor -> {
                    if (!isAuthorized(vendor.getWedding(), currentUser)) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to view this vendor"));
                    }
                    return ResponseEntity.ok(vendor);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/wedding/{weddingId}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> addVendor(@PathVariable Long weddingId, @Valid @RequestBody Vendor vendor) {
        User currentUser = getCurrentUser();
        return weddingRepository.findById(weddingId)
                .map(wedding -> {
                    if (!isAuthorized(wedding, currentUser)) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to add vendors to this wedding"));
                    }
                    vendor.setWedding(wedding);
                    Vendor savedVendor = vendorRepository.save(vendor);
                    return ResponseEntity.ok(savedVendor);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> updateVendor(@PathVariable Long id, @Valid @RequestBody Vendor vendorDetails) {
        User currentUser = getCurrentUser();
        return vendorRepository.findById(id)
                .map(vendor -> {
                    if (!isAuthorized(vendor.getWedding(), currentUser)) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to update this vendor"));
                    }
                    
                    vendor.setName(vendorDetails.getName());
                    vendor.setType(vendorDetails.getType());
                    vendor.setDescription(vendorDetails.getDescription());
                    vendor.setContactName(vendorDetails.getContactName());
                    vendor.setPhoneNumber(vendorDetails.getPhoneNumber());
                    vendor.setEmail(vendorDetails.getEmail());
                    vendor.setWebsite(vendorDetails.getWebsite());
                    vendor.setCost(vendorDetails.getCost());
                    vendor.setDepositAmount(vendorDetails.getDepositAmount());
                    vendor.setDepositPaid(vendorDetails.isDepositPaid());
                    vendor.setFullyPaid(vendorDetails.isFullyPaid());
                    vendor.setNotes(vendorDetails.getNotes());
                    
                    Vendor updatedVendor = vendorRepository.save(vendor);
                    return ResponseEntity.ok(updatedVendor);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/payment/deposit/{isPaid}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> updateVendorDepositPaid(@PathVariable Long id, @PathVariable boolean isPaid) {
        User currentUser = getCurrentUser();
        return vendorRepository.findById(id)
                .map(vendor -> {
                    if (!isAuthorized(vendor.getWedding(), currentUser)) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to update this vendor"));
                    }
                    vendor.setDepositPaid(isPaid);
                    Vendor updatedVendor = vendorRepository.save(vendor);
                    return ResponseEntity.ok(updatedVendor);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/payment/full/{isPaid}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> updateVendorFullyPaid(@PathVariable Long id, @PathVariable boolean isPaid) {
        User currentUser = getCurrentUser();
        return vendorRepository.findById(id)
                .map(vendor -> {
                    if (!isAuthorized(vendor.getWedding(), currentUser)) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to update this vendor"));
                    }
                    vendor.setFullyPaid(isPaid);
                    
                    // If fully paid, set deposit as paid too
                    if (isPaid) {
                        vendor.setDepositPaid(true);
                    }
                    
                    Vendor updatedVendor = vendorRepository.save(vendor);
                    return ResponseEntity.ok(updatedVendor);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteVendor(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        return vendorRepository.findById(id)
                .map(vendor -> {
                    if (!isAuthorized(vendor.getWedding(), currentUser)) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to delete this vendor"));
                    }
                    vendorRepository.delete(vendor);
                    return ResponseEntity.ok(new MessageResponse("Vendor deleted successfully"));
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