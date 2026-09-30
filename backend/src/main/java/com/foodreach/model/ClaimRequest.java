package com.foodreach.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "claim_requests")
public class ClaimRequest {

    @Id
    private String id;

    private String donationId;
    private String donationTitle;

    private String ngoId;
    private String ngoName;
    private String ngoPhone;
    private String ngoAddress;

    private Integer estimatedBeneficiaries;
    private String notes;

    @Builder.Default
    private String status = "APPROVED"; // Instantly approved upon claim for fast rescue

    @CreatedDate
    private Instant createdAt;
}
