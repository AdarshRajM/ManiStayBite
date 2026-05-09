package com.example.staybite_backend.controller;

import com.example.staybite_backend.entity.Wallet;
import com.example.staybite_backend.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallets")
public class WalletController {

    @Autowired
    private WalletRepository walletRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<Wallet> getWallet(@PathVariable Long userId) {
        return walletRepository.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/user/{userId}/add")
    public ResponseEntity<Wallet> addFunds(@PathVariable Long userId, @RequestParam Double amount) {
        Wallet wallet = walletRepository.findByUserId(userId).orElseThrow();
        wallet.setBalance(wallet.getBalance() + amount);
        return ResponseEntity.ok(walletRepository.save(wallet));
    }
}
