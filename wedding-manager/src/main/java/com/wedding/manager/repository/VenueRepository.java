package com.wedding.manager.repository;

import com.wedding.manager.model.User;
import com.wedding.manager.model.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VenueRepository extends JpaRepository<Venue, Long> {
    List<Venue> findByOwner(User owner);
    
    List<Venue> findByAvailable(boolean available);
    
    List<Venue> findByCapacityGreaterThanEqual(Integer capacity);
    
    List<Venue> findByCityContainingIgnoreCase(String city);
    
    List<Venue> findByStateContainingIgnoreCase(String state);
} 