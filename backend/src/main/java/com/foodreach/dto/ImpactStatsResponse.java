package com.foodreach.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImpactStatsResponse {
    private long totalMealsRescued;
    private double totalKgRescued;
    private double co2EmissionsSavedKg;
    private long totalActiveListings;
    private long totalDeliveredDonations;
    private long totalDonors;
    private long totalNgos;
    private long totalVolunteers;
}
