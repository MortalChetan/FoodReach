# 🍲 FoodReach — Surplus Food Rescue & Community Donation Platform

**FoodReach** is a full-stack Food Rescue and Donation Management platform built with **Spring Boot 3.4.x (Java 21 LTS)**, **MongoDB**, and **React + Vite**. It connects restaurants, catering services, bakeries, and individuals with local NGOs, soup kitchens, shelters, and volunteer rescue riders to eliminate food waste and fight community hunger in real time.

---

## 🌟 Key Highlights & Features

- **Multi-Role Role-Based Access Control (RBAC)**:
  - 🍽️ **Food Donors (Restaurants / Caterers / Stores)**: Fast 60-second surplus food posting, pickup time windows, allergen/handling tags, live meal & CO2 calculations, and secure 4-digit handover OTPs.
  - 🏢 **NGOs & Shelters**: Interactive surplus food discovery feed, instant 1-click rescue claims, and dispatch coordination.
  - 🚴 **Volunteer Rescue Riders**: Accept delivery missions, view routes, verify pickup with donor OTP, and confirm handover.
  - 🛡️ **Platform Admins**: Platform-wide metrics, partner directory, and real-time operations oversight.
- **Stateless JWT Security**: Spring Security 6 with token generation and verification.
- **Interactive Swagger UI / OpenAPI 3**: Built-in REST documentation at `http://localhost:8080/swagger-ui/index.html`.
- **Pre-Seeded Zero-Setup Demo Data**: Pre-seeded demo accounts, live donations, and active delivery missions right upon startup.
- **One-Click Demo Switcher**: Instant switching between Donor, NGO, Volunteer, and Admin roles directly in the UI.

---

## 🏗️ Technology Stack

| Layer | Technology |
|---|---|
| **Backend** | Spring Boot 3.3.5 / 3.4.x, Java 21 LTS, Spring Web, Spring Security 6, Spring Data MongoDB, Lombok, Jakarta Validation, JJWT |
| **Database** | MongoDB 7.0 (Local MongoDB or MongoDB Atlas) |
| **Frontend** | React 18/19, Vite, Tailwind CSS, Lucide React, Axios, Canvas Confetti |
| **API Docs** | SpringDoc OpenAPI 2.6 (Swagger UI) |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Java 21 LTS** installed (`java -version`)
- **Maven 3.8+** installed (`mvn -version`)
- **Node.js 18+** & **npm** installed (`node -v`, `npm -v`)
- **MongoDB** installed locally or access to a MongoDB instance (`mongodb://localhost:27017`)

---

### Step 1: Start MongoDB
Ensure your local MongoDB service is running (or configure your connection URI in `backend/src/main/resources/application.yml`):
```bash
# Verify MongoDB is running on localhost:27017
mongosh --eval "db.adminCommand('ping')"
```

---

### Step 2: Run Spring Boot Backend
Navigate to the `backend/` directory and start the server:
```bash
cd backend
mvn spring-boot:run
```
The backend starts on **http://localhost:8080**.

- **Swagger UI**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **OpenAPI Schema**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

### Step 3: Run Frontend Web App
In another terminal, navigate to `frontend/`:
```bash
cd frontend
npm install
npm run dev
```
Open your browser at **http://localhost:5173**.

---

## 🔑 Pre-Seeded Indian Demo Accounts

The platform is initialized with ready-to-test demo accounts across Indian cities:

| Role | Email | Password | Organization & City |
|---|---|---|---|
| **Commercial Donor** | `donor@foodreach.org` | `password123` | Chef Vikramaditya Singh (Taj Palace Banquets, Delhi NCR) |
| **Luxury Hotel Donor** | `itc.mumbai@foodreach.org` | `password123` | Kavita Merchant (ITC Grand Central, Mumbai) |
| **Tech Park Cafeteria** | `infosys.blr@foodreach.org` | `password123` | Suresh Kulkarni (Infosys Food Court, Bengaluru) |
| **Bakery & Sweets** | `bakery@foodreach.org` | `password123` | Rajesh Haldiram (Haldiram's Sweets & Bakery, Delhi NCR) |
| **NGO Shelter** | `ngo@foodreach.org` | `password123` | Aarav Mehta (Robin Hood Army Delhi Chapter) |
| **NGO Community Care** | `feedingindia.mum@foodreach.org` | `password123` | Sneha Deshmukh (Feeding India by Zomato, Mumbai) |
| **Volunteer Rider** | `volunteer@foodreach.org` | `password123` | Rahul Sharma (Delhi Express Rapid Rescue Riders) |
| **Platform Director** | `admin@foodreach.org` | `admin123` | Dr. Chetan Kumar (FoodReach National Command HQ) |

---

## 📡 REST API Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new Donor, NGO, or Volunteer
- `POST /api/auth/login` — Sign in and receive Bearer JWT token
- `GET /api/auth/me` — Get current authenticated user profile

### Food Surplus Listings (`/api/donations`)
- `GET /api/donations` — Search listings with optional filters (`foodType`, `dietaryType`, `city`, `status`)
- `GET /api/donations/available` — Get all available unclaimed surplus food
- `GET /api/donations/{id}` — Get single donation details
- `POST /api/donations` — Post a new surplus food donation (`ROLE_DONOR`, `ROLE_ADMIN`)
- `GET /api/donations/my` — Get donations posted by current donor
- `PUT /api/donations/{id}/cancel` — Cancel active donation

### NGO Claims (`/api/claims`)
- `POST /api/claims` — Claim surplus food for NGO shelter (`ROLE_NGO`, `ROLE_ADMIN`)
- `GET /api/claims/my` — Get claims history for current NGO

### Volunteer Deliveries (`/api/deliveries`)
- `GET /api/deliveries/pending` — Get available food rescue missions
- `GET /api/deliveries/my` — Get missions accepted by current volunteer
- `POST /api/deliveries/{id}/accept` — Accept rescue task
- `PUT /api/deliveries/{id}/status` — Update task status (OTP verification or Delivery completion)

### Impact & Analytics (`/api/stats`)
- `GET /api/stats/impact` — Get platform-wide meals rescued, CO2 avoided, and partner counts

---

## 📁 Repository Structure
```
FoodReach/
├── backend/
│   ├── pom.xml
│   ├── src/main/java/com/foodreach/
│   │   ├── FoodReachApplication.java
│   │   ├── config/ (SecurityConfig, JwtAuthFilter)
│   │   ├── controller/ (AuthController, DonationController, ClaimController, DeliveryController, StatsController, UserController)
│   │   ├── data/ (DataInitializer.java)
│   │   ├── dto/ (AuthRequest, AuthResponse, DonationCreateRequest, ClaimCreateRequest, ImpactStatsResponse, ApiResponse)
│   │   ├── model/ (User, FoodDonation, ClaimRequest, DeliveryTask, Role, FoodType, DietaryType, DonationStatus, DeliveryStatus)
│   │   ├── repository/ (UserRepository, FoodDonationRepository, ClaimRequestRepository, DeliveryTaskRepository)
│   │   └── service/ (AuthService, DonationService, ClaimService, DeliveryService, StatsService, JwtService, CustomUserDetailsService)
│   └── src/main/resources/
│       └── application.yml
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── api/ (client.js)
│       ├── components/ (Navbar, Footer, HeroSection, ImpactStatsBar, DonationCard, FilterBar, ClaimModal)
│       ├── context/ (AuthContext.jsx)
│       ├── pages/ (HomePage, ExplorePage, DonationDetailPage, CreateDonationPage, DonorDashboardPage, NgoDashboardPage, VolunteerDashboardPage, AdminDashboardPage, LoginPage, RegisterPage)
│       ├── App.jsx
│       └── main.jsx
└── README.md
```
