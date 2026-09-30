package com.foodreach.model;

public enum DonationStatus {
    AVAILABLE,      // Donor posted, waiting for NGO claim
    CLAIMED,        // NGO claimed, waiting for volunteer pickup or direct NGO pickup
    IN_TRANSIT,     // Volunteer picked up, on the way to NGO
    DELIVERED,      // Completed handover to NGO
    EXPIRED,        // Passed safe consumption/pickup window
    CANCELLED       // Cancelled by donor
}
