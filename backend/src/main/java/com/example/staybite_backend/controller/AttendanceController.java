package com.example.staybite_backend.controller;

import com.example.staybite_backend.entity.Attendance;
import com.example.staybite_backend.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @PostMapping("/check-in/{employeeId}")
    public ResponseEntity<Attendance> checkIn(@PathVariable Long employeeId, @RequestBody Attendance attendance) {
        attendance.setCheckInTime(LocalDateTime.now());
        return ResponseEntity.ok(attendanceRepository.save(attendance));
    }

    @PutMapping("/check-out/{attendanceId}")
    public ResponseEntity<Attendance> checkOut(@PathVariable Long attendanceId) {
        Attendance attendance = attendanceRepository.findById(attendanceId).orElseThrow();
        attendance.setCheckOutTime(LocalDateTime.now());
        return ResponseEntity.ok(attendanceRepository.save(attendance));
    }
}
