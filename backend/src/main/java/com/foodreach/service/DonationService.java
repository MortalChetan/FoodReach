package com.foodreach.service;

import com.foodreach.dto.DonationCreateRequest;
import com.foodreach.model.DietaryType;
import com.foodreach.model.DonationStatus;
import com.foodreach.model.FoodDonation;
import com.foodreach.model.FoodType;
import com.foodreach.model.User;
import com.foodreach.repository.FoodDonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final FoodDonationRepository donationRepository;
    private final AuthService authService;

    public FoodDonation createDonation(DonationCreateRequest request, String userEmail) {
        User donor = authService.getCurrentUser(userEmail);

        // Auto calculate estimated meals and CO2 savings
        int estimatedMeals = calculateEstimatedMeals(request.getQuantity(), request.getUnit());
        double co2SavedKg = Math.round((estimatedMeals * 0.45 * 2.5) * 100.0) / 100.0;

        // Generate 4-digit pickup OTP
        String pickupOtp = String.format("%04d", new Random().nextInt(10000));
        String deliveryOtp = String.format("%04d", new Random().nextInt(10000));

        FoodDonation donation = FoodDonation.builder()
                .donorId(donor.getId())
                .donorName(donor.getName())
                .donorPhone(donor.getPhone())
                .donorOrganization(donor.getOrganizationName() != null ? donor.getOrganizationName() : donor.getName())
                .title(request.getTitle())
                .description(request.getDescription())
                .foodType(request.getFoodType())
                .dietaryType(request.getDietaryType())
                .quantity(request.getQuantity())
                .unit(request.getUnit() != null ? request.getUnit() : "servings")
                .estimatedMeals(estimatedMeals)
                .co2SavedKg(co2SavedKg)
                .preparedAt(request.getPreparedAt() != null ? request.getPreparedAt() : Instant.now())
                .expiresAt(request.getExpiresAt())
                .pickupAddress(request.getPickupAddress())
                .city(request.getCity() != null ? request.getCity() : donor.getCity())
                .latitude(request.getLatitude() != null ? request.getLatitude() : donor.getLatitude())
                .longitude(request.getLongitude() != null ? request.getLongitude() : donor.getLongitude())
                .status(DonationStatus.AVAILABLE)
                .pickupOtp(pickupOtp)
                .deliveryOtp(deliveryOtp)
                .allergens(request.getAllergens())
                .storageInstructions(request.getStorageInstructions())
                .imageUrl(request.getImageUrl() != null && !request.getImageUrl().isBlank() ? request.getImageUrl() : getDefaultImageUrl(request.getFoodType()))
                .build();

        return donationRepository.save(donation);
    }

    public List<FoodDonation> getAllDonations(FoodType foodType, DietaryType dietaryType, String city, DonationStatus status) {
        List<FoodDonation> donations = donationRepository.findAllByOrderByCreatedAtDesc();

        return donations.stream()
                .filter(d -> status == null || d.getStatus() == status)
                .filter(d -> foodType == null || d.getFoodType() == foodType)
                .filter(d -> dietaryType == null || d.getDietaryType() == dietaryType)
                .filter(d -> city == null || (d.getCity() != null && d.getCity().equalsIgnoreCase(city.trim())))
                .collect(Collectors.toList());
    }

    public List<FoodDonation> getAvailableDonations() {
        return donationRepository.findByStatusOrderByCreatedAtDesc(DonationStatus.AVAILABLE);
    }

    public FoodDonation getDonationById(String id) {
        return donationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Donation not found with id: " + id));
    }

    public List<FoodDonation> getMyDonations(String userEmail) {
        User user = authService.getCurrentUser(userEmail);
        return donationRepository.findByDonorIdOrderByCreatedAtDesc(user.getId());
    }

    public List<FoodDonation> getNgoClaimedDonations(String userEmail) {
        User user = authService.getCurrentUser(userEmail);
        return donationRepository.findByClaimedByNgoIdOrderByCreatedAtDesc(user.getId());
    }

    public List<FoodDonation> getVolunteerAssignedDonations(String userEmail) {
        User user = authService.getCurrentUser(userEmail);
        return donationRepository.findByAssignedVolunteerIdOrderByCreatedAtDesc(user.getId());
    }

    public FoodDonation cancelDonation(String id, String userEmail) {
        User user = authService.getCurrentUser(userEmail);
        FoodDonation donation = getDonationById(id);

        if (!donation.getDonorId().equals(user.getId()) && !user.getRole().name().equals("ROLE_ADMIN")) {
            throw new IllegalStateException("Only the donor or an admin can cancel this donation");
        }

        if (donation.getStatus() == DonationStatus.DELIVERED || donation.getStatus() == DonationStatus.IN_TRANSIT) {
            throw new IllegalStateException("Cannot cancel donation that is in transit or delivered");
        }

        donation.setStatus(DonationStatus.CANCELLED);
        return donationRepository.save(donation);
    }

    private int calculateEstimatedMeals(Double quantity, String unit) {
        if (quantity == null || quantity <= 0) return 1;
        if (unit == null) return quantity.intValue();
        String u = unit.toLowerCase();
        if (u.contains("serving") || u.contains("meal") || u.contains("person") || u.contains("plate")) {
            return (int) Math.round(quantity);
        } else if (u.contains("kg") || u.contains("kilo")) {
            return (int) Math.round(quantity * 2.5); // 1kg is ~2.5 meal portions
        } else if (u.contains("box") || u.contains("tray") || u.contains("container")) {
            return (int) Math.round(quantity * 10); // 1 catering tray ~ 10 portions
        }
        return (int) Math.round(quantity);
    }

    private String getDefaultImageUrl(FoodType type) {
        if (type == null) return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80";
        return switch (type) {
            case COOKED_MEALS, CATERING_SURPLUS -> "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
            case BAKERY_AND_BREAD -> "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80";
            case FRESH_PRODUCE, RAW_INGREDIENTS -> "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80";
            case PACKAGED_FOOD -> "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80";
            case BEVERAGES_AND_DAIRY -> "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80";
        };
    }
}
