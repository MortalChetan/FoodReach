package com.foodreach.service;

import com.foodreach.dto.DeliveryStatusUpdateRequest;
import com.foodreach.model.*;
import com.foodreach.repository.DeliveryTaskRepository;
import com.foodreach.repository.FoodDonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryTaskRepository deliveryTaskRepository;
    private final FoodDonationRepository donationRepository;
    private final AuthService authService;

    public List<DeliveryTask> getPendingTasks() {
        return deliveryTaskRepository.findByStatus(DeliveryStatus.PENDING_VOLUNTEER);
    }

    public List<DeliveryTask> getMyTasks(String userEmail) {
        User volunteer = authService.getCurrentUser(userEmail);
        return deliveryTaskRepository.findByVolunteerIdOrderByCreatedAtDesc(volunteer.getId());
    }

    public DeliveryTask getTaskById(String taskId) {
        return deliveryTaskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with id: " + taskId));
    }

    public DeliveryTask acceptTask(String taskId, String userEmail) {
        User volunteer = authService.getCurrentUser(userEmail);
        DeliveryTask task = getTaskById(taskId);

        if (task.getStatus() != DeliveryStatus.PENDING_VOLUNTEER) {
            throw new IllegalStateException("Task is no longer available for pickup");
        }

        task.setVolunteerId(volunteer.getId());
        task.setVolunteerName(volunteer.getName());
        task.setVolunteerPhone(volunteer.getPhone());
        task.setStatus(DeliveryStatus.ACCEPTED_BY_VOLUNTEER);
        task.setAcceptedAt(Instant.now());

        // Update FoodDonation record
        donationRepository.findById(task.getDonationId()).ifPresent(d -> {
            d.setAssignedVolunteerId(volunteer.getId());
            d.setAssignedVolunteerName(volunteer.getName());
            d.setAssignedVolunteerPhone(volunteer.getPhone());
            donationRepository.save(d);
        });

        return deliveryTaskRepository.save(task);
    }

    public DeliveryTask updateTaskStatus(String taskId, DeliveryStatusUpdateRequest request, String userEmail) {
        User volunteer = authService.getCurrentUser(userEmail);
        DeliveryTask task = getTaskById(taskId);

        if (!task.getVolunteerId().equals(volunteer.getId()) && !volunteer.getRole().name().equals("ROLE_ADMIN")) {
            throw new IllegalStateException("Unauthorized: Only the assigned volunteer can update this task");
        }

        FoodDonation donation = donationRepository.findById(task.getDonationId())
                .orElseThrow(() -> new IllegalArgumentException("Associated donation not found"));

        if (request.getStatus() == DeliveryStatus.PICKED_UP) {
            // Check OTP
            if (request.getOtp() != null && !request.getOtp().trim().equals(task.getPickupOtp())) {
                throw new IllegalArgumentException("Invalid Pickup OTP! Please verify with the donor.");
            }
            task.setStatus(DeliveryStatus.PICKED_UP);
            task.setPickedUpAt(Instant.now());
            donation.setStatus(DonationStatus.IN_TRANSIT);
            donation.setPickedUpAt(Instant.now());
        } else if (request.getStatus() == DeliveryStatus.DELIVERED) {
            task.setStatus(DeliveryStatus.DELIVERED);
            task.setDeliveredAt(Instant.now());
            if (request.getProofNotes() != null) {
                task.setDeliveryProofNotes(request.getProofNotes());
            }
            if (request.getProofImageUrl() != null) {
                task.setDeliveryProofImageUrl(request.getProofImageUrl());
            }
            donation.setStatus(DonationStatus.DELIVERED);
            donation.setDeliveredAt(Instant.now());
        }

        donationRepository.save(donation);
        return deliveryTaskRepository.save(task);
    }
}
