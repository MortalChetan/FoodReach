package com.foodreach.controller;

import com.foodreach.dto.ApiResponse;
import com.foodreach.dto.DeliveryStatusUpdateRequest;
import com.foodreach.model.DeliveryTask;
import com.foodreach.service.DeliveryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
@Tag(name = "Deliveries & Rescues", description = "Endpoints for volunteer food rescue and delivery tracking")
public class DeliveryController {

    private final DeliveryService deliveryService;

    @GetMapping("/pending")
    @Operation(summary = "Get all available delivery tasks waiting for volunteers")
    public ResponseEntity<ApiResponse<List<DeliveryTask>>> getPendingTasks() {
        List<DeliveryTask> tasks = deliveryService.getPendingTasks();
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('VOLUNTEER', 'ADMIN')")
    @Operation(summary = "Get delivery tasks accepted by current volunteer")
    public ResponseEntity<ApiResponse<List<DeliveryTask>>> getMyTasks(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<DeliveryTask> tasks = deliveryService.getMyTasks(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get specific delivery task by ID")
    public ResponseEntity<ApiResponse<DeliveryTask>> getTaskById(@PathVariable String id) {
        try {
            DeliveryTask task = deliveryService.getTaskById(id);
            return ResponseEntity.ok(ApiResponse.success(task));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/accept")
    @PreAuthorize("hasAnyRole('VOLUNTEER', 'ADMIN')")
    @Operation(summary = "Volunteer accepts a food rescue delivery mission")
    public ResponseEntity<ApiResponse<DeliveryTask>> acceptTask(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            DeliveryTask task = deliveryService.acceptTask(id, userDetails.getUsername());
            return ResponseEntity.ok(ApiResponse.success(task, "Mission accepted! Head to donor location for pickup."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('VOLUNTEER', 'ADMIN')")
    @Operation(summary = "Update delivery task status (e.g., OTP verified Pickup or Delivered)")
    public ResponseEntity<ApiResponse<DeliveryTask>> updateTaskStatus(
            @PathVariable String id,
            @RequestBody DeliveryStatusUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            DeliveryTask updated = deliveryService.updateTaskStatus(id, request, userDetails.getUsername());
            return ResponseEntity.ok(ApiResponse.success(updated, "Status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
