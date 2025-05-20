package com.wedding.manager.repository;

import com.wedding.manager.model.User;
import com.wedding.manager.model.Wedding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeddingRepository extends JpaRepository<Wedding, Long> {
    
    @Query("SELECT w FROM Wedding w JOIN w.couples c WHERE c = :user")
    List<Wedding> findAllByCouple(User user);
    
    List<Wedding> findByVenueId(Long venueId);
} 