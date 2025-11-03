package com.smartshelfx.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String companyName;
    private String email;
    private String contactNumber;
    private String password;
    private String role; // We'll send this as a String ("USER" or "ADMIN")
    private String warehouseLocation;
    private String storeName;
}