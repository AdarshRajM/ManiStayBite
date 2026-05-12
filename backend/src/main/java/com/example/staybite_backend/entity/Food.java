package com.example.staybite_backend.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;

@Entity
@Table(name = "foods")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Food {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long foodId;

    private String foodName;
    private String category;
    private String description;
    private Double price;
    private String imageUrl;
    private Boolean vegetarian = true;
    private Boolean spicy = false;
    private Double rating = 4.5;
    private String tags;
    private String offerTag;
    private Boolean combo = false;
    private String subscriptionPlan;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;
}
