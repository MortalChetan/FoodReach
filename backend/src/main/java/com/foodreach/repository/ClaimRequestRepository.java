package com.foodreach.repository;

import com.foodreach.model.ClaimRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRequestRepository extends MongoRepository<ClaimRequest, String> {
    List<ClaimRequest> findByNgoIdOrderByCreatedAtDesc(String ngoId);
    List<ClaimRequest> findByDonationId(String donationId);
    boolean existsByDonationId(String donationId);
}
