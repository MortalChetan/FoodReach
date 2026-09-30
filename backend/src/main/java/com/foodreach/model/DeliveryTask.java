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
@Document(collection = "delivery_tasks")
public class DeliveryTask {

    @Id
    private String id;

    private String donationId;
    private String donationTitle;
    private String foodType;
    private Double quantity;
    private String unit;

    // Pickup (Donor)
    private String donorId;
    private String donorName;
    private String donorPhone;
    private String pickupAddress;
    private Double pickupLat;
    private Double pickupLng;

    // Dropoff (NGO)
    private String ngoId;
    private String ngoName;
    private String ngoPhone;
    private String dropoffAddress;
    private Double dropoffLat;
    private Double dropoffLng;

    // Volunteer
    private String volunteerId;
    private String volunteerName;
    private String volunteerPhone;

    @Builder.Default
    private DeliveryStatus status = DeliveryStatus.PENDING_VOLUNTEER;

    private String pickupOtp;
    private String deliveryProofNotes;
    private String deliveryProofImageUrl;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    private Instant acceptedAt;
    private Instant pickedUpAt;
    private Instant deliveredAt;
}
