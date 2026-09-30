package com.foodreach.repository;

import com.foodreach.model.DonationStatus;
import com.foodreach.model.FoodDonation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodDonationRepository extends MongoRepository<FoodDonation, String> {
    List<FoodDonation> findByStatus(DonationStatus status);
    List<FoodDonation> findByDonorIdOrderByCreatedAtDesc(String donorId);
    List<FoodDonation> findByClaimedByNgoIdOrderByCreatedAtDesc(String ngoId);
    List<FoodDonation> findByAssignedVolunteerIdOrderByCreatedAtDesc(String volunteerId);
    List<FoodDonation> findByStatusOrderByCreatedAtDesc(DonationStatus status);
    List<FoodDonation> findAllByOrderByCreatedAtDesc();
    long countByStatus(DonationStatus status);
}
