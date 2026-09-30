package com.foodreach.repository;

import com.foodreach.model.DeliveryStatus;
import com.foodreach.model.DeliveryTask;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryTaskRepository extends MongoRepository<DeliveryTask, String> {
    List<DeliveryTask> findByStatus(DeliveryStatus status);
    List<DeliveryTask> findByVolunteerIdOrderByCreatedAtDesc(String volunteerId);
    List<DeliveryTask> findByNgoIdOrderByCreatedAtDesc(String ngoId);
    Optional<DeliveryTask> findByDonationId(String donationId);
    List<DeliveryTask> findAllByOrderByCreatedAtDesc();
}
