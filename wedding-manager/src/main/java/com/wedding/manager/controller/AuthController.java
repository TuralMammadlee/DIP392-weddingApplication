package com.wedding.manager.controller;

import com.wedding.manager.model.ERole;
import com.wedding.manager.model.Role;
import com.wedding.manager.model.User;
import com.wedding.manager.payload.request.LoginRequest;
import com.wedding.manager.payload.request.SignupRequest;
import com.wedding.manager.payload.response.JwtResponse;
import com.wedding.manager.payload.response.MessageResponse;
import com.wedding.manager.repository.RoleRepository;
import com.wedding.manager.repository.UserRepository;
import com.wedding.manager.security.jwt.JwtUtils;
import com.wedding.manager.security.service.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getFirstName(),
                userDetails.getLastName(),
                userDetails.getPhoneNumber(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getFirstName(),
                signUpRequest.getLastName(),
                signUpRequest.getPhoneNumber());

        Set<String> strRoles = signUpRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    case "couple":
                        Role coupleRole = roleRepository.findByName(ERole.ROLE_COUPLE)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(coupleRole);
                        break;
                    case "vendor":
                        Role vendorRole = roleRepository.findByName(ERole.ROLE_VENDOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(vendorRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('COUPLE') or hasRole('VENDOR') or hasRole('ADMIN')")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody SignupRequest updateRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        return userRepository.findById(userDetails.getId())
                .map(user -> {
                    // Update user fields
                    user.setFirstName(updateRequest.getFirstName());
                    user.setLastName(updateRequest.getLastName());
                    user.setPhoneNumber(updateRequest.getPhoneNumber());
                    
                    // Update password if provided
                    if (updateRequest.getPassword() != null && !updateRequest.getPassword().isEmpty()) {
                        user.setPassword(encoder.encode(updateRequest.getPassword()));
                    }
                    
                    User updatedUser = userRepository.save(user);
                    
                    // Generate new token with updated user details
                    Authentication newAuth = new UsernamePasswordAuthenticationToken(
                            UserDetailsImpl.build(updatedUser),
                            null,
                            authentication.getAuthorities()
                    );
                    SecurityContextHolder.getContext().setAuthentication(newAuth);
                    String jwt = jwtUtils.generateJwtToken(newAuth);
                    
                    List<String> roles = updatedUser.getRoles().stream()
                            .map(role -> role.getName().name())
                            .collect(Collectors.toList());
                    
                    return ResponseEntity.ok(new JwtResponse(jwt,
                            updatedUser.getId(),
                            updatedUser.getUsername(),
                            updatedUser.getEmail(),
                            updatedUser.getFirstName(),
                            updatedUser.getLastName(),
                            updatedUser.getPhoneNumber(),
                            roles));
                })
                .orElse(ResponseEntity.notFound().build());
    }
} 