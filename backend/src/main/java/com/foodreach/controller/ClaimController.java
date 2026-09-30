package com.foodreach.controller;

import com.foodreach.dto.ApiResponse;
import com.foodreach.dto.ClaimCreateRequest;
import com.foodreach.model.ClaimRequest;
import com.foodreach.model.FoodDonation;
import com.foodreach.service.ClaimService;
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
@RequestMapping("/api/claims")
@RequiredArgsConstructor
@Tag(name = "Donation Claims", description = "Endpoints for NGO claim management")
public class ClaimController {

    private final ClaimService claimService;

    @PostMapping
    @PreAuthorize("hasAnyRole('NGO', 'ADMIN')")
    @Operation(summary = "NGO claims an available surplus food donation")
    public ResponseEntity<ApiResponse<FoodDonation>> claimDonation(
            @Valid @RequestBody ClaimCreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            FoodDonation claimed = claimService.claimDonation(request, userDetails.getUsername());
            return ResponseEntity.ok(ApiResponse.success(claimed, "Food donation claimed successfully. Volunteer pickup requested."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('NGO', 'ADMIN')")
    @Operation(summary = "Get list of all claims made by current NGO")
    public ResponseEntity<ApiResponse<List<ClaimRequest>>> getMyClaims(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<ClaimRequest> claims = claimService.getMyClaims(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(claims));
    }
}
