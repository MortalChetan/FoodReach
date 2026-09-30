package com.foodreach.controller;

import com.foodreach.dto.ApiResponse;
import com.foodreach.model.Role;
import com.foodreach.model.User;
import com.foodreach.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users & Partners", description = "Endpoints for community partner directories and profiles")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get users filtered by role (e.g. ROLE_NGO, ROLE_DONOR)")
    public ResponseEntity<ApiResponse<List<User>>> getUsersByRole(@RequestParam(required = false) Role role) {
        List<User> users = (role != null) ? userRepository.findByRole(role) : userRepository.findAll();
        // Hide password hash before sending
        users.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(ApiResponse.success(users));
    }
}
