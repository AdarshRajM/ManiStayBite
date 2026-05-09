package com.example.staybite_backend.repository;

import com.example.staybite_backend.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodRepository extends JpaRepository<Food, Long> {
}
