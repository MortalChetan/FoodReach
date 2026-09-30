package com.foodreach.dto;

import com.foodreach.model.DeliveryStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryStatusUpdateRequest {
    private DeliveryStatus status;
    private String otp; // verification OTP
    private String proofNotes;
    private String proofImageUrl;
}
