package com.foodreach.controller;

import com.foodreach.dto.ApiResponse;
import com.foodreach.dto.ImpactStatsResponse;
import com.foodreach.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@Tag(name = "Platform Analytics", description = "Endpoints for platform-wide food rescue statistics and impact counters")
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/impact")
    @Operation(summary = "Get overall food rescue & environmental impact statistics")
    public ResponseEntity<ApiResponse<ImpactStatsResponse>> getImpactStats() {
        ImpactStatsResponse stats = statsService.getPlatformStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
