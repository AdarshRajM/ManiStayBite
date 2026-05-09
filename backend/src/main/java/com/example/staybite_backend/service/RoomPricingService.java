package com.example.staybite_backend.service;

import org.springframework.stereotype.Service;
import java.time.DayOfWeek;
import java.time.LocalDate;

@Service
public class RoomPricingService {

    public Double calculateDynamicPrice(Double basePrice, LocalDate checkInDate) {
        DayOfWeek day = checkInDate.getDayOfWeek();
        
        // Weekend Surge Pricing (20% increase)
        if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
            return basePrice * 1.20;
        }
        
        // Mock Festival Surge (e.g., Diwali in November - 50% increase)
        if (checkInDate.getMonthValue() == 11) {
            return basePrice * 1.50;
        }

        return basePrice;
    }
}
