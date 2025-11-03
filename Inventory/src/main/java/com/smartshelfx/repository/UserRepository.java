package com.smartshelfx.repository;

import com.smartshelfx.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Update this method to find by email
    Optional<User> findByEmail(String email);
}