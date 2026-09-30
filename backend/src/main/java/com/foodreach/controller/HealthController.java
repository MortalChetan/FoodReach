package com.foodreach.controller;

import com.foodreach.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
@Tag(name = "System Health & Deployment", description = "Endpoints for production readiness, health checks and system diagnostics")
public class HealthController {

    private final MongoTemplate mongoTemplate;

    @GetMapping
    @Operation(summary = "Get live system health, database connection, and deployment diagnostics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "foodreach-backend");
        health.put("version", "1.0.0-PROD");
        health.put("environment", "production-ready");
        health.put("timestamp", Instant.now().toString());

        // JVM & Memory Diagnostics
        long uptimeMs = ManagementFactory.getRuntimeMXBean().getUptime();
        health.put("uptimeSeconds", uptimeMs / 1000);
        health.put("javaVersion", System.getProperty("java.version"));
        health.put("springBootVersion", "3.3.5 (Java 21 LTS)");

        long totalMemory = Runtime.getRuntime().totalMemory() / (1024 * 1024);
        long freeMemory = Runtime.getRuntime().freeMemory() / (1024 * 1024);
        health.put("memoryUsedMb", totalMemory - freeMemory);
        health.put("memoryTotalMb", totalMemory);

        // Database status check
        try {
            boolean mongoConnected = mongoTemplate.getDb() != null;
            health.put("database", Map.of(
                    "status", mongoConnected ? "CONNECTED" : "DISCONNECTED",
                    "type", "MongoDB 7.0",
                    "databaseName", mongoTemplate.getDb().getName()
            ));
        } catch (Exception e) {
            health.put("database", Map.of(
                    "status", "ERROR",
                    "message", e.getMessage()
            ));
        }

        return ResponseEntity.ok(ApiResponse.success(health, "System is healthy and production ready"));
    }
}
