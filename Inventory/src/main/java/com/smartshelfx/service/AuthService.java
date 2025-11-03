package com.smartshelfx.service;

// --- Imports ---
import com.smartshelfx.entity.Store;
import com.smartshelfx.repository.StoreRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.smartshelfx.dto.AuthResponse;
import com.smartshelfx.dto.LoginRequest;
import com.smartshelfx.dto.RegisterRequest;
import com.smartshelfx.entity.Role;
import com.smartshelfx.entity.User;
import com.smartshelfx.repository.UserRepository;
import com.smartshelfx.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final StoreRepository storeRepository;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already taken");
        }

        Role userRole = Role.USER; // Default
        try {
            if (request.getRole() != null) {
                userRole = Role.valueOf(request.getRole().toUpperCase());
            }
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid role provided: " + request.getRole() + ". Defaulting to USER.");
        }

        Store assignedStore = null;
        if (userRole == Role.STORE_MANAGER) {
            if (request.getStoreName() == null || request.getStoreName().trim().isEmpty()) {
                throw new IllegalArgumentException("Store Manager must have a store name.");
            }
            assignedStore = storeRepository.findByName(request.getStoreName())
                    .orElseGet(() -> {
                        Store newStore = Store.builder()
                                .name(request.getStoreName())
                                .location(request.getWarehouseLocation())
                                .build();
                        return storeRepository.save(newStore);
                    });
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .companyName(request.getCompanyName())
                .email(request.getEmail())
                .contactNumber(request.getContactNumber())
                .warehouseLocation(request.getWarehouseLocation())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(userRole)
                .store(assignedStore)
                .build();

        userRepository.save(user); // <-- User is saved here (this works)

        String token = jwtService.generateToken(user);

        // --- THIS IS THE FIX ---
        // We must pass all 4 arguments to the constructor
        Long storeId = (assignedStore != null) ? assignedStore.getId() : null;
        return new AuthResponse(token, user.getEmail(), user.getRole().name(), storeId);
        // --- THIS WAS THE BUGGY LINE ---
        // return new AuthResponse(token, user.getEmail(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found after authentication: " + userDetails.getUsername()));

        String token = jwtService.generateToken(userDetails);

        // --- THIS IS THE FIX ---
        // We must pass all 4 arguments to the constructor
        Long storeId = (user.getStore() != null) ? user.getStore().getId() : null;
        return new AuthResponse(token, userDetails.getUsername(), user.getRole().name(), storeId);
        // --- THIS WAS THE BUGGY LINE ---
        // return new AuthResponse(token, userDetails.getUsername(), user.getRole().name());
    }
}

