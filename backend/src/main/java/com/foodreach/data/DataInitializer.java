package com.foodreach.data;

import com.foodreach.model.*;
import com.foodreach.repository.ClaimRequestRepository;
import com.foodreach.repository.DeliveryTaskRepository;
import com.foodreach.repository.FoodDonationRepository;
import com.foodreach.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final FoodDonationRepository donationRepository;
    private final ClaimRequestRepository claimRequestRepository;
    private final DeliveryTaskRepository deliveryTaskRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        try {
            // Check if we need to reseed or refresh with India-wide dataset
            long userCount = userRepository.count();
            boolean hasOldData = userRepository.findByEmail("donor@foodreach.org")
                    .map(u -> u.getCity() == null || u.getCity().contains("San Francisco"))
                    .orElse(false);

            if (userCount == 0 || hasOldData) {
                log.info("Seeding / Refreshing comprehensive India-wide dataset for FoodReach...");
                userRepository.deleteAll();
                donationRepository.deleteAll();
                claimRequestRepository.deleteAll();
                deliveryTaskRepository.deleteAll();

                seedIndiaDataset();
                log.info("India-wide demonstration dataset seeded successfully across 10+ major cities!");
            }
        } catch (Exception e) {
            log.warn("Could not seed data: {}", e.getMessage());
        }
    }

    private void seedIndiaDataset() {
        String encodedPass = passwordEncoder.encode("password123");
        String adminPass = passwordEncoder.encode("admin123");

        // ==========================================
        // 1. SEED USERS ACROSS MAJOR INDIAN CITIES
        // ==========================================

        // Primary Demo Donor (Delhi NCR)
        User donorDelhi = User.builder()
                .name("Chef Vikramaditya Singh")
                .email("donor@foodreach.org")
                .password(encodedPass)
                .role(Role.ROLE_DONOR)
                .organizationName("Taj Palace & Royal Banquet Hospitality")
                .phone("+91 98112 34567")
                .address("2 Sardar Patel Marg, Diplomatic Enclave, Chanakyapuri")
                .city("Delhi NCR")
                .latitude(28.5977)
                .longitude(77.1738)
                .verified(true)
                .build();

        // Mumbai Donor
        User donorMumbai = User.builder()
                .name("Kavita Merchant")
                .email("itc.mumbai@foodreach.org")
                .password(encodedPass)
                .role(Role.ROLE_DONOR)
                .organizationName("ITC Grand Central & Luxury Banquets")
                .phone("+91 98201 98765")
                .address("287 Dr Babasaheb Ambedkar Road, Parel")
                .city("Mumbai")
                .latitude(18.9986)
                .longitude(72.8427)
                .verified(true)
                .build();

        // Bengaluru Donor
        User donorBlr = User.builder()
                .name("Suresh Kulkarni")
                .email("infosys.blr@foodreach.org")
                .password(encodedPass)
                .role(Role.ROLE_DONOR)
                .organizationName("Infosys Tech Park Food Court & Hospitality")
                .phone("+91 98450 11223")
                .address("Electronics City Phase 1, Hosur Road")
                .city("Bengaluru")
                .latitude(12.8452)
                .longitude(77.6602)
                .verified(true)
                .build();

        // Hyderabad Donor
        User donorHyd = User.builder()
                .name("Mirza Asadullah Baig")
                .email("paradise.hyd@foodreach.org")
                .password(encodedPass)
                .role(Role.ROLE_DONOR)
                .organizationName("Paradise Food Court & Banquets")
                .phone("+91 98490 33445")
                .address("SD Road, Paradise Circle, Secunderabad")
                .city("Hyderabad")
                .latitude(17.4411)
                .longitude(78.4871)
                .verified(true)
                .build();

        // Chennai Donor
        User donorChennai = User.builder()
                .name("R. Soundararajan")
                .email("saravana.chennai@foodreach.org")
                .password(encodedPass)
                .role(Role.ROLE_DONOR)
                .organizationName("Saravana Bhavan Central Kitchen")
                .phone("+91 98410 55667")
                .address("19 Kennet Lane, Egmore / T. Nagar")
                .city("Chennai")
                .latitude(13.0827)
                .longitude(80.2707)
                .verified(true)
                .build();

        // Delhi Bakery Donor
        User donorBakery = User.builder()
                .name("Rajesh Haldiram")
                .email("bakery@foodreach.org")
                .password(encodedPass)
                .role(Role.ROLE_DONOR)
                .organizationName("Haldiram's Sweets & Fresh Bakery")
                .phone("+91 98100 88990")
                .address("B-1/H-8, Mohan Co-op Industrial Estate, Mathura Road")
                .city("Delhi NCR")
                .latitude(28.5132)
                .longitude(77.3015)
                .verified(true)
                .build();

        // Jaipur Donor
        User donorJaipur = User.builder()
                .name("Rawat Singh Rathore")
                .email("chokhidhani.jaipur@foodreach.org")
                .password(encodedPass)
                .role(Role.ROLE_DONOR)
                .organizationName("Chokhi Dhani Traditional Foods & Banquets")
                .phone("+91 98290 77889")
                .address("12 Miles, Tonk Road, Jaipur")
                .city("Jaipur")
                .latitude(26.7725)
                .longitude(75.8368)
                .verified(true)
                .build();

        // Pune Donor
        User donorPune = User.builder()
                .name("Amitabh Joshi")
                .email("bbq.pune@foodreach.org")
                .password(encodedPass)
                .role(Role.ROLE_DONOR)
                .organizationName("Barbeque Nation Central Kitchen")
                .phone("+91 98220 44556")
                .address("East Avenue, Kalyani Nagar")
                .city("Pune")
                .latitude(18.5463)
                .longitude(73.9033)
                .verified(true)
                .build();

        // Primary Demo NGO (Delhi NCR & All India)
        User ngoDelhi = User.builder()
                .name("Aarav Mehta (Chapter Lead)")
                .email("ngo@foodreach.org")
                .password(encodedPass)
                .role(Role.ROLE_NGO)
                .organizationName("Robin Hood Army - India Relief Wing")
                .phone("+91 99110 44332")
                .address("Community Care Center, Hauz Khas Village")
                .city("Delhi NCR")
                .latitude(28.5494)
                .longitude(77.1944)
                .verified(true)
                .build();

        // Mumbai NGO
        User ngoMumbai = User.builder()
                .name("Sneha Deshmukh")
                .email("feedingindia.mum@foodreach.org")
                .password(encodedPass)
                .role(Role.ROLE_NGO)
                .organizationName("Feeding India by Zomato Community Shelter")
                .phone("+91 98200 66778")
                .address("Dadar West Community Center, Near Station")
                .city("Mumbai")
                .latitude(19.0178)
                .longitude(72.8478)
                .verified(true)
                .build();

        // Bengaluru NGO
        User ngoBlr = User.builder()
                .name("Chaitanya Dasa")
                .email("akshayapatra.blr@foodreach.org")
                .password(encodedPass)
                .role(Role.ROLE_NGO)
                .organizationName("Akshaya Patra Community Food Network")
                .phone("+91 98450 88991")
                .address("Hare Krishna Hill, West of Chord Road, Rajajinagar")
                .city("Bengaluru")
                .latitude(13.0098)
                .longitude(77.5511)
                .verified(true)
                .build();

        // Pune NGO
        User ngoPune = User.builder()
                .name("Dr. Girish Kulkarni")
                .email("snehalaya.pune@foodreach.org")
                .password(encodedPass)
                .role(Role.ROLE_NGO)
                .organizationName("Snehalaya Hope Kitchen & Children Shelter")
                .phone("+91 98225 11224")
                .address("MIDC Road, Shivajinagar & Hinjawadi Care Wing")
                .city("Pune")
                .latitude(18.5314)
                .longitude(73.8446)
                .verified(true)
                .build();

        // Primary Demo Volunteer Rider (Delhi NCR)
        User volunteerDelhi = User.builder()
                .name("Rahul Sharma")
                .email("volunteer@foodreach.org")
                .password(encodedPass)
                .role(Role.ROLE_VOLUNTEER)
                .organizationName("Delhi Express Rapid Rescue Riders")
                .phone("+91 98711 22334")
                .address("Connaught Place Hub, Inner Circle")
                .city("Delhi NCR")
                .latitude(28.6304)
                .longitude(77.2177)
                .verified(true)
                .build();

        // Mumbai Volunteer
        User volunteerMumbai = User.builder()
                .name("Priya Patel")
                .email("volunteer.mum@foodreach.org")
                .password(encodedPass)
                .role(Role.ROLE_VOLUNTEER)
                .organizationName("Mumbai Marine Rescue Couriers")
                .phone("+91 98205 33445")
                .address("Bandra West Hill Road Station")
                .city("Mumbai")
                .latitude(19.0596)
                .longitude(72.8295)
                .verified(true)
                .build();

        // Platform Director / Admin
        User adminUser = User.builder()
                .name("Dr. Chetan Kumar (Platform Director)")
                .email("admin@foodreach.org")
                .password(adminPass)
                .role(Role.ROLE_ADMIN)
                .organizationName("FoodReach National Operations Command HQ")
                .phone("+91 99999 88888")
                .address("National Zero-Waste Center, Barakhamba Road")
                .city("Delhi NCR")
                .latitude(28.6289)
                .longitude(77.2285)
                .verified(true)
                .build();

        userRepository.saveAll(List.of(
                donorDelhi, donorMumbai, donorBlr, donorHyd, donorChennai, donorBakery, donorJaipur, donorPune,
                ngoDelhi, ngoMumbai, ngoBlr, ngoPune,
                volunteerDelhi, volunteerMumbai,
                adminUser
        ));

        // ==========================================
        // 2. SEED SURPLUS FOOD DONATIONS ACROSS INDIA
        // ==========================================

        // 1. Delhi NCR - Royal Awadhi Shahi Paneer & Dal Makhani
        FoodDonation d1 = FoodDonation.builder()
                .donorId(donorDelhi.getId())
                .donorName(donorDelhi.getName())
                .donorPhone(donorDelhi.getPhone())
                .donorOrganization(donorDelhi.getOrganizationName())
                .title("Royal Awadhi Shahi Paneer, Dal Makhani & 150 Butter Naans")
                .description("Freshly prepared surplus from an executive summit banquet at Taj Palace. Packed in sanitized insulated stainless/foil containers. Ready for immediate shelter distribution.")
                .foodType(FoodType.COOKED_MEALS)
                .dietaryType(DietaryType.VEG)
                .quantity(150.0)
                .unit("servings")
                .estimatedMeals(150)
                .co2SavedKg(168.7)
                .preparedAt(Instant.now().minus(2, ChronoUnit.HOURS))
                .expiresAt(Instant.now().plus(6, ChronoUnit.HOURS))
                .pickupAddress(donorDelhi.getAddress())
                .city("Delhi NCR")
                .latitude(donorDelhi.getLatitude())
                .longitude(donorDelhi.getLongitude())
                .status(DonationStatus.AVAILABLE)
                .pickupOtp("4821")
                .deliveryOtp("9214")
                .allergens("Contains Dairy (Paneer, Butter), Gluten (Naan)")
                .storageInstructions("Keep hot in thermal carriers (>60°C)")
                .imageUrl("https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80")
                .build();

        // 2. Mumbai - Executive Grand Dinner Buffet
        FoodDonation d2 = FoodDonation.builder()
                .donorId(donorMumbai.getId())
                .donorName(donorMumbai.getName())
                .donorPhone(donorMumbai.getPhone())
                .donorOrganization(donorMumbai.getOrganizationName())
                .title("Executive Buffet Surplus - Jeera Rice, Paneer Butter Masala & Phulkas")
                .description("High-grade five-star wedding banquet surplus. Freshly packed under strict FSSAI hygiene standards. Suitable for local shelter dinner service.")
                .foodType(FoodType.COOKED_MEALS)
                .dietaryType(DietaryType.VEG)
                .quantity(100.0)
                .unit("servings")
                .estimatedMeals(100)
                .co2SavedKg(112.5)
                .preparedAt(Instant.now().minus(1, ChronoUnit.HOURS))
                .expiresAt(Instant.now().plus(5, ChronoUnit.HOURS))
                .pickupAddress(donorMumbai.getAddress())
                .city("Mumbai")
                .latitude(donorMumbai.getLatitude())
                .longitude(donorMumbai.getLongitude())
                .status(DonationStatus.AVAILABLE)
                .pickupOtp("7319")
                .deliveryOtp("8420")
                .allergens("Contains Dairy, Wheat")
                .storageInstructions("Insulated hot box storage")
                .imageUrl("https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80")
                .build();

        // 3. Hyderabad - Dum Biryani & Mirchi Ka Salan
        FoodDonation d3 = FoodDonation.builder()
                .donorId(donorHyd.getId())
                .donorName(donorHyd.getName())
                .donorPhone(donorHyd.getPhone())
                .donorOrganization(donorHyd.getOrganizationName())
                .title("Hyderabadi Dum Biryani Feast & Mirchi Ka Salan - 120 Servings")
                .description("Authentic sealed copper handi surplus biryani from corporate evening conference. Packed in heat-sealed food trays with double packaging.")
                .foodType(FoodType.COOKED_MEALS)
                .dietaryType(DietaryType.NON_VEG)
                .quantity(120.0)
                .unit("servings")
                .estimatedMeals(120)
                .co2SavedKg(135.0)
                .preparedAt(Instant.now().minus(3, ChronoUnit.HOURS))
                .expiresAt(Instant.now().plus(4, ChronoUnit.HOURS))
                .pickupAddress(donorHyd.getAddress())
                .city("Hyderabad")
                .latitude(donorHyd.getLatitude())
                .longitude(donorHyd.getLongitude())
                .status(DonationStatus.AVAILABLE)
                .pickupOtp("5192")
                .deliveryOtp("2910")
                .allergens("Contains Spices, Chicken, Dairy")
                .storageInstructions("Keep warm above 65°C")
                .imageUrl("https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80")
                .build();

        // 4. Bengaluru - Corporate Cafeteria North & South Thali Boxes
        FoodDonation d4 = FoodDonation.builder()
                .donorId(donorBlr.getId())
                .donorName(donorBlr.getName())
                .donorPhone(donorBlr.getPhone())
                .donorOrganization(donorBlr.getOrganizationName())
                .title("Nutritious Lunch Thali Bento Boxes - Dal Tadka, Aloo Gobhi & Rice")
                .description("Excess packed meal boxes from tech campus cafeteria. Each meal is hygienically portioned with rice, chapati, dal, and mixed vegetable curry.")
                .foodType(FoodType.COOKED_MEALS)
                .dietaryType(DietaryType.VEG)
                .quantity(90.0)
                .unit("servings")
                .estimatedMeals(90)
                .co2SavedKg(101.2)
                .preparedAt(Instant.now().minus(2, ChronoUnit.HOURS))
                .expiresAt(Instant.now().plus(7, ChronoUnit.HOURS))
                .pickupAddress(donorBlr.getAddress())
                .city("Bengaluru")
                .latitude(donorBlr.getLatitude())
                .longitude(donorBlr.getLongitude())
                .status(DonationStatus.AVAILABLE)
                .pickupOtp("8402")
                .deliveryOtp("4193")
                .allergens("Gluten, Dairy")
                .storageInstructions("Keep in thermal crates")
                .imageUrl("https://images.unsplash.com/photo-1613292443284-c7742e373ab8?auto=format&fit=crop&w=800&q=80")
                .build();

        // 5. Chennai - Traditional South Indian Tiffin
        FoodDonation d5 = FoodDonation.builder()
                .donorId(donorChennai.getId())
                .donorName(donorChennai.getName())
                .donorPhone(donorChennai.getPhone())
                .donorOrganization(donorChennai.getOrganizationName())
                .title("South Indian Tiffin - 200 Steamed Idlis, Medu Vada & Drumstick Sambar")
                .description("Freshly steamed morning tiffin surplus from central kitchen. High nutritional value, packed in sanitized warm catering dispensers.")
                .foodType(FoodType.COOKED_MEALS)
                .dietaryType(DietaryType.VEG)
                .quantity(200.0)
                .unit("items")
                .estimatedMeals(100)
                .co2SavedKg(112.5)
                .preparedAt(Instant.now().minus(1, ChronoUnit.HOURS))
                .expiresAt(Instant.now().plus(8, ChronoUnit.HOURS))
                .pickupAddress(donorChennai.getAddress())
                .city("Chennai")
                .latitude(donorChennai.getLatitude())
                .longitude(donorChennai.getLongitude())
                .status(DonationStatus.AVAILABLE)
                .pickupOtp("3048")
                .deliveryOtp("7194")
                .allergens("Coconut, Lentils")
                .storageInstructions("Keep covered in thermal containers")
                .imageUrl("https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80")
                .build();

        // 6. Pune - Fresh Farm Fruits & Organic Produce Crates
        FoodDonation d6 = FoodDonation.builder()
                .donorId(donorPune.getId())
                .donorName(donorPune.getName())
                .donorPhone(donorPune.getPhone())
                .donorOrganization(donorPune.getOrganizationName())
                .title("Fresh Farm Organic Alfonso Mangoes, Oranges & Vegetable Crates")
                .description("Wholesale fresh produce crates from supply chain surplus. 100% fresh, rich in vitamins. Perfect for community kitchen preparation.")
                .foodType(FoodType.FRESH_PRODUCE)
                .dietaryType(DietaryType.VEGAN)
                .quantity(65.0)
                .unit("kg")
                .estimatedMeals(130)
                .co2SavedKg(146.2)
                .preparedAt(Instant.now().minus(4, ChronoUnit.HOURS))
                .expiresAt(Instant.now().plus(48, ChronoUnit.HOURS))
                .pickupAddress(donorPune.getAddress())
                .city("Pune")
                .latitude(donorPune.getLatitude())
                .longitude(donorPune.getLongitude())
                .status(DonationStatus.AVAILABLE)
                .pickupOtp("9134")
                .deliveryOtp("6281")
                .allergens("None")
                .storageInstructions("Cool, ventilated storage")
                .imageUrl("https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80")
                .build();

        // 7. Delhi NCR - Haldiram's Sweets & Snacks Box Crates
        FoodDonation d7 = FoodDonation.builder()
                .donorId(donorBakery.getId())
                .donorName(donorBakery.getName())
                .donorPhone(donorBakery.getPhone())
                .donorOrganization(donorBakery.getOrganizationName())
                .title("Halwai Sweets, Motichoor Laddoos & Samosa Snack Boxes")
                .description("Surplus boxed festive sweets and evening snack boxes. Cleanly packed in tamper-proof Haldiram's branded takeaway containers.")
                .foodType(FoodType.BAKERY_AND_BREAD)
                .dietaryType(DietaryType.VEG)
                .quantity(80.0)
                .unit("items")
                .estimatedMeals(80)
                .co2SavedKg(90.0)
                .preparedAt(Instant.now().minus(3, ChronoUnit.HOURS))
                .expiresAt(Instant.now().plus(24, ChronoUnit.HOURS))
                .pickupAddress(donorBakery.getAddress())
                .city("Delhi NCR")
                .latitude(donorBakery.getLatitude())
                .longitude(donorBakery.getLongitude())
                .status(DonationStatus.AVAILABLE)
                .pickupOtp("2649")
                .deliveryOtp("8315")
                .allergens("Dairy, Gluten, Nuts (Cashews, Almonds)")
                .storageInstructions("Store in a cool dry place")
                .imageUrl("https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80")
                .build();

        // 8. Jaipur - Royal Rajasthani Dal Baati Churma Feast
        FoodDonation d8 = FoodDonation.builder()
                .donorId(donorJaipur.getId())
                .donorName(donorJaipur.getName())
                .donorPhone(donorJaipur.getPhone())
                .donorOrganization(donorJaipur.getOrganizationName())
                .title("Rajasthani Dal Baati Churma, Gatte Ki Sabzi & Bajra Rotis")
                .description("Authentic festive Rajasthani dinner banquet surplus. Rich in ghee and proteins. Packed in heavy foil takeaway pans.")
                .foodType(FoodType.COOKED_MEALS)
                .dietaryType(DietaryType.VEG)
                .quantity(75.0)
                .unit("servings")
                .estimatedMeals(75)
                .co2SavedKg(84.3)
                .preparedAt(Instant.now().minus(2, ChronoUnit.HOURS))
                .expiresAt(Instant.now().plus(6, ChronoUnit.HOURS))
                .pickupAddress(donorJaipur.getAddress())
                .city("Jaipur")
                .latitude(donorJaipur.getLatitude())
                .longitude(donorJaipur.getLongitude())
                .status(DonationStatus.AVAILABLE)
                .pickupOtp("4920")
                .deliveryOtp("1738")
                .allergens("Desi Ghee (Dairy), Wheat")
                .storageInstructions("Keep hot in thermal carriers")
                .imageUrl("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80")
                .build();

        // 9. Delhi NCR (Claimed Scenario for interactive workflow) - Lentil Khichdi & Mixed Sabzi
        FoodDonation d9 = FoodDonation.builder()
                .donorId(donorDelhi.getId())
                .donorName(donorDelhi.getName())
                .donorPhone(donorDelhi.getPhone())
                .donorOrganization(donorDelhi.getOrganizationName())
                .title("Moong Dal Khichdi & Mixed Veggie Stew - 60 Packed Meal Boxes")
                .description("Wholesome nutritious khichdi prepared for evening charity drive. Ready for immediate distribution by volunteer riders.")
                .foodType(FoodType.COOKED_MEALS)
                .dietaryType(DietaryType.VEG)
                .quantity(60.0)
                .unit("servings")
                .estimatedMeals(60)
                .co2SavedKg(67.5)
                .preparedAt(Instant.now().minus(1, ChronoUnit.HOURS))
                .expiresAt(Instant.now().plus(4, ChronoUnit.HOURS))
                .pickupAddress(donorDelhi.getAddress())
                .city("Delhi NCR")
                .latitude(donorDelhi.getLatitude())
                .longitude(donorDelhi.getLongitude())
                .status(DonationStatus.CLAIMED)
                .claimedByNgoId(ngoDelhi.getId())
                .claimedByNgoName(ngoDelhi.getOrganizationName())
                .claimedByNgoPhone(ngoDelhi.getPhone())
                .claimedAt(Instant.now().minus(25, ChronoUnit.MINUTES))
                .pickupOtp("6284")
                .deliveryOtp("1049")
                .allergens("Gluten-free, Mild spices")
                .storageInstructions("Keep insulated thermal bag")
                .imageUrl("https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80")
                .build();

        donationRepository.saveAll(List.of(d1, d2, d3, d4, d5, d6, d7, d8, d9));

        // ==========================================
        // 3. SEED ACTIVE DELIVERY TASK & CLAIM
        // ==========================================
        DeliveryTask task1 = DeliveryTask.builder()
                .donationId(d9.getId())
                .donationTitle(d9.getTitle())
                .foodType(d9.getFoodType().name())
                .quantity(d9.getQuantity())
                .unit(d9.getUnit())
                .donorId(donorDelhi.getId())
                .donorName(donorDelhi.getName())
                .donorPhone(donorDelhi.getPhone())
                .pickupAddress(donorDelhi.getAddress())
                .pickupLat(donorDelhi.getLatitude())
                .pickupLng(donorDelhi.getLongitude())
                .ngoId(ngoDelhi.getId())
                .ngoName(ngoDelhi.getOrganizationName())
                .ngoPhone(ngoDelhi.getPhone())
                .dropoffAddress(ngoDelhi.getAddress())
                .dropoffLat(ngoDelhi.getLatitude())
                .dropoffLng(ngoDelhi.getLongitude())
                .status(DeliveryStatus.PENDING_VOLUNTEER)
                .pickupOtp(d9.getPickupOtp())
                .build();

        deliveryTaskRepository.save(task1);

        ClaimRequest claim1 = ClaimRequest.builder()
                .donationId(d9.getId())
                .donationTitle(d9.getTitle())
                .ngoId(ngoDelhi.getId())
                .ngoName(ngoDelhi.getOrganizationName())
                .ngoPhone(ngoDelhi.getPhone())
                .ngoAddress(ngoDelhi.getAddress())
                .estimatedBeneficiaries(60)
                .notes("Evening shelter distribution for Hauz Khas & AIIMS night shelter")
                .status("APPROVED")
                .build();

        claimRequestRepository.save(claim1);
    }
}

