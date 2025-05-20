package com.wedding.manager.repository;

import com.wedding.manager.model.Vendor;
import com.wedding.manager.model.Vendor.VendorType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    List<Vendor> findByWeddingId(Long weddingId);
    
    List<Vendor> findByWeddingIdAndType(Long weddingId, VendorType type);
    
    List<Vendor> findByWeddingIdAndFullyPaid(Long weddingId, boolean fullyPaid);
    
    List<Vendor> findByWeddingIdAndDepositPaid(Long weddingId, boolean depositPaid);
} 