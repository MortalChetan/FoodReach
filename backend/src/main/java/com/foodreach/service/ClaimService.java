package com.foodreach.service;

import com.foodreach.dto.ClaimCreateRequest;
import com.foodreach.model.*;
import com.foodreach.repository.ClaimRequestRepository;
import com.foodreach.repository.DeliveryTaskRepository;
import com.foodreach.repository.FoodDonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaimService {

    private final FoodDonationRepository donationRepository;
    private final ClaimRequestRepository claimRequestRepository;
    private final DeliveryTaskRepository deliveryTaskRepository;
    private final AuthService authService;

    public FoodDonation claimDonation(ClaimCreateRequest request, String userEmail) {
        User ngo = authService.getCurrentUser(userEmail);
        FoodDonation donation = donationRepository.findById(request.getDonationId())
                .orElseThrow(() -> new IllegalArgumentException("Donation not found"));

        if (donation.getStatus() != DonationStatus.AVAILABLE) {
            throw new IllegalStateException("Donation is no longer available (current status: " + donation.getStatus() + ")");
        }

        // Update Donation Status
        donation.setStatus(DonationStatus.CLAIMED);
        donation.setClaimedByNgoId(ngo.getId());
        donation.setClaimedByNgoName(ngo.getOrganizationName() != null ? ngo.getOrganizationName() : ngo.getName());
        donation.setClaimedByNgoPhone(ngo.getPhone());
        donation.setClaimedAt(Instant.now());

        FoodDonation savedDonation = donationRepository.save(donation);

        // Record Claim Request
        ClaimRequest claim = ClaimRequest.builder()
                .donationId(savedDonation.getId())
                .donationTitle(savedDonation.getTitle())
                .ngoId(ngo.getId())
                .ngoName(savedDonation.getClaimedByNgoName())
                .ngoPhone(ngo.getPhone())
                .ngoAddress(ngo.getAddress())
                .estimatedBeneficiaries(request.getEstimatedBeneficiaries() != null ? request.getEstimatedBeneficiaries() : savedDonation.getEstimatedMeals())
                .notes(request.getNotes())
                .status("APPROVED")
                .build();
        claimRequestRepository.save(claim);

        // Automatically create a Delivery Task for community volunteers
        DeliveryTask task = DeliveryTask.builder()
                .donationId(savedDonation.getId())
                .donationTitle(savedDonation.getTitle())
                .foodType(savedDonation.getFoodType().name())
                .quantity(savedDonation.getQuantity())
                .unit(savedDonation.getUnit())
                .donorId(savedDonation.getDonorId())
                .donorName(savedDonation.getDonorName())
                .donorPhone(savedDonation.getDonorPhone())
                .pickupAddress(savedDonation.getPickupAddress())
                .pickupLat(savedDonation.getLatitude())
                .pickupLng(savedDonation.getLongitude())
                .ngoId(ngo.getId())
                .ngoName(savedDonation.getClaimedByNgoName())
                .ngoPhone(ngo.getPhone())
                .dropoffAddress(ngo.getAddress() != null ? ngo.getAddress() : "NGO Community Center")
                .dropoffLat(ngo.getLatitude())
                .dropoffLng(ngo.getLongitude())
                .status(DeliveryStatus.PENDING_VOLUNTEER)
                .pickupOtp(savedDonation.getPickupOtp())
                .build();
        deliveryTaskRepository.save(task);

        return savedDonation;
    }

    public List<ClaimRequest> getMyClaims(String userEmail) {
        User ngo = authService.getCurrentUser(userEmail);
        return claimRequestRepository.findByNgoIdOrderByCreatedAtDesc(ngo.getId());
    }
}
