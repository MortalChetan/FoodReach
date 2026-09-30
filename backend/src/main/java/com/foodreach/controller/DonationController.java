package com.foodreach.controller;

import com.foodreach.dto.ApiResponse;
import com.foodreach.dto.DonationCreateRequest;
import com.foodreach.model.DietaryType;
import com.foodreach.model.DonationStatus;
import com.foodreach.model.FoodDonation;
import com.foodreach.model.FoodType;
import com.foodreach.service.DonationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
@Tag(name = "Food Donations", description = "Endpoints for creating, discovering, and managing surplus food listings")
public class DonationController {

    private final DonationService donationService;

    @GetMapping
    @Operation(summary = "Explore food donations with optional filters")
    public ResponseEntity<ApiResponse<List<FoodDonation>>> getAllDonations(
            @RequestParam(required = false) FoodType foodType,
            @RequestParam(required = false) DietaryType dietaryType,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) DonationStatus status
    ) {
        List<FoodDonation> donations = donationService.getAllDonations(foodType, dietaryType, city, status);
        return ResponseEntity.ok(ApiResponse.success(donations));
    }

    @GetMapping("/available")
    @Operation(summary = "Get all currently available food donations")
    public ResponseEntity<ApiResponse<List<FoodDonation>>> getAvailableDonations() {
        List<FoodDonation> donations = donationService.getAvailableDonations();
        return ResponseEntity.ok(ApiResponse.success(donations));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get specific food donation by ID")
    public ResponseEntity<ApiResponse<FoodDonation>> getDonationById(@PathVariable String id) {
        try {
            FoodDonation donation = donationService.getDonationById(id);
            return ResponseEntity.ok(ApiResponse.success(donation));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DONOR', 'ADMIN')")
    @Operation(summary = "Post a new surplus food donation")
    public ResponseEntity<ApiResponse<FoodDonation>> createDonation(
            @Valid @RequestBody DonationCreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            FoodDonation created = donationService.createDonation(request, userDetails.getUsername());
            return ResponseEntity.ok(ApiResponse.success(created, "Food donation posted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('DONOR', 'ADMIN')")
    @Operation(summary = "Get donations posted by currently logged in donor")
    public ResponseEntity<ApiResponse<List<FoodDonation>>> getMyDonations(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<FoodDonation> list = donationService.getMyDonations(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel a donation listing")
    public ResponseEntity<ApiResponse<FoodDonation>> cancelDonation(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            FoodDonation updated = donationService.cancelDonation(id, userDetails.getUsername());
            return ResponseEntity.ok(ApiResponse.success(updated, "Donation cancelled"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
