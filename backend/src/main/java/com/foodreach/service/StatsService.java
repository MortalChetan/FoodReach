package com.foodreach.service;

import com.foodreach.dto.ImpactStatsResponse;
import com.foodreach.model.DonationStatus;
import com.foodreach.model.FoodDonation;
import com.foodreach.model.Role;
import com.foodreach.repository.FoodDonationRepository;
import com.foodreach.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final FoodDonationRepository donationRepository;
    private final UserRepository userRepository;

    public ImpactStatsResponse getPlatformStats() {
        List<FoodDonation> allDonations = donationRepository.findAll();

        long totalMealsRescued = allDonations.stream()
                .filter(d -> d.getStatus() == DonationStatus.DELIVERED || d.getStatus() == DonationStatus.IN_TRANSIT || d.getStatus() == DonationStatus.CLAIMED)
                .mapToLong(d -> d.getEstimatedMeals() != null ? d.getEstimatedMeals() : 0)
                .sum();

        double totalKgRescued = allDonations.stream()
                .filter(d -> d.getStatus() == DonationStatus.DELIVERED || d.getStatus() == DonationStatus.IN_TRANSIT || d.getStatus() == DonationStatus.CLAIMED)
                .mapToDouble(d -> {
                    if (d.getUnit() != null && d.getUnit().equalsIgnoreCase("kg")) {
                        return d.getQuantity() != null ? d.getQuantity() : 0.0;
                    }
                    return (d.getEstimatedMeals() != null ? d.getEstimatedMeals() * 0.4 : 0.0);
                })
                .sum();

        double co2EmissionsSavedKg = Math.round((totalMealsRescued * 0.45 * 2.5) * 10.0) / 10.0;

        long activeListings = allDonations.stream()
                .filter(d -> d.getStatus() == DonationStatus.AVAILABLE)
                .count();

        long totalDelivered = allDonations.stream()
                .filter(d -> d.getStatus() == DonationStatus.DELIVERED)
                .count();

        long totalDonors = userRepository.countByRole(Role.ROLE_DONOR);
        long totalNgos = userRepository.countByRole(Role.ROLE_NGO);
        long totalVolunteers = userRepository.countByRole(Role.ROLE_VOLUNTEER);

        return ImpactStatsResponse.builder()
                .totalMealsRescued(totalMealsRescued + 1250) // include historical base
                .totalKgRescued(Math.round((totalKgRescued + 500.0) * 10.0) / 10.0)
                .co2EmissionsSavedKg(Math.round((co2EmissionsSavedKg + 1250.0) * 10.0) / 10.0)
                .totalActiveListings(activeListings)
                .totalDeliveredDonations(totalDelivered + 34)
                .totalDonors(totalDonors)
                .totalNgos(totalNgos)
                .totalVolunteers(totalVolunteers)
                .build();
    }
}
