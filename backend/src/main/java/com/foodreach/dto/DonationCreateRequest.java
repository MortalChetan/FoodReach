package com.foodreach.dto;

import com.foodreach.model.DietaryType;
import com.foodreach.model.FoodType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonationCreateRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Food type is required")
    private FoodType foodType;

    @NotNull(message = "Dietary type is required")
    private DietaryType dietaryType;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be greater than 0")
    private Double quantity;

    private String unit = "servings"; // e.g., servings, kg, boxes

    private Instant preparedAt;

    @NotNull(message = "Expiry time is required")
    private Instant expiresAt;

    @NotBlank(message = "Pickup address is required")
    private String pickupAddress;

    private String city;
    private Double latitude;
    private Double longitude;

    private String allergens;
    private String storageInstructions;
    private String imageUrl;
}
