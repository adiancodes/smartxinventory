package com.smartshelfx.controller;

import com.smartshelfx.dto.AuthResponse;
import com.smartshelfx.dto.LoginRequest;
import com.smartshelfx.dto.RegisterRequest; // Import new DTO
import com.smartshelfx.service.AuthService;  // Import new Service
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    // Inject the service instead of all the individual components
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        // Call the service method
        AuthResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    // --- NEW REGISTRATION ENDPOINT ---
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest registerRequest) {
        try {
            // Call the service method
            AuthResponse response = authService.register(registerRequest);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            // Handle "username already taken"
            return ResponseEntity.badRequest().body(new AuthResponse(e.getMessage(), null, null, null));
        }
    }
}