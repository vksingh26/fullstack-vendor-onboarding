package com.example.vendor.repository;

import com.example.vendor.model.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    // Spring Data JPA will automatically implement basic CRUD operations
}