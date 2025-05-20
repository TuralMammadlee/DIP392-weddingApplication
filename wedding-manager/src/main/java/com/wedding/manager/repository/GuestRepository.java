package com.wedding.manager.repository;

import com.wedding.manager.model.Guest;
import com.wedding.manager.model.Guest.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuestRepository extends JpaRepository<Guest, Long> {
    List<Guest> findByWeddingId(Long weddingId);
    
    List<Guest> findByWeddingIdAndInvitationStatus(Long weddingId, InvitationStatus status);
    
    Long countByWeddingId(Long weddingId);
    
    Long countByWeddingIdAndInvitationStatus(Long weddingId, InvitationStatus status);
} 