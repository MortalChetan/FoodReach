package com.foodreach;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class FoodReachApplication {

    public static void main(String[] args) {
        SpringApplication.run(FoodReachApplication.class, args);
    }
}
