package com.foodreach.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "food_donations")
public class FoodDonation {

    @Id
    private String id;

    // Donor Details
    private String donorId;
    private String donorName;
    private String donorPhone;
    private String donorOrganization;

    // Food Details
    private String title;
    private String description;
    private FoodType foodType;
    private DietaryType dietaryType;
    private Double quantity;
    private String unit; // "servings", "kg", "trays", "meals"
    private Integer estimatedMeals;
    private Double co2SavedKg;

    // Timestamps
    private Instant preparedAt;
    private Instant expiresAt;

    // Location
    private String pickupAddress;
    private String city;
    private Double latitude;
    private Double longitude;

    // Lifecycle Status
    @Builder.Default
    private DonationStatus status = DonationStatus.AVAILABLE;

    // NGO Claim Details
    private String claimedByNgoId;
    private String claimedByNgoName;
    private String claimedByNgoPhone;
    private Instant claimedAt;

    // Volunteer Details
    private String assignedVolunteerId;
    private String assignedVolunteerName;
    private String assignedVolunteerPhone;
    private Instant pickedUpAt;
    private Instant deliveredAt;

    // Verification Security
    private String pickupOtp;
    private String deliveryOtp;

    // Additional info
    private String allergens;
    private String storageInstructions;
    private String imageUrl;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
