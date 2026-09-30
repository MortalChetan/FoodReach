package com.foodreach.dto;

import com.foodreach.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type;
    private String id;
    private String name;
    private String email;
    private Role role;
    private String organizationName;
    private String phone;
    private String address;
    private String city;
    private Double latitude;
    private Double longitude;
}
