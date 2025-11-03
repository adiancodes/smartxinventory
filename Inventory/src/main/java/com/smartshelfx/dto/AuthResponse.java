package com.smartshelfx.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username; // This is actually the email
    private String role;
    private Long storeId;// Added role
}