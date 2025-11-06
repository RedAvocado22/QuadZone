package com.quadzone.user.address;

import com.quadzone.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "address")
public class Address {
    @Column(name = "created_at", nullable = false)
    private final LocalDateTime createdAt = LocalDateTime.now();
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;
    @Column(name = "address_line1", nullable = false, length = 255)
    private String addressLine1;
    @Column(name = "address_line2", length = 255)
    private String addressLine2;
    @Column(nullable = false, length = 100)
    private String city;
    @Column(name = "state_province", nullable = false, length = 100)
    private String stateProvince;
    @Column(name = "postal_code", nullable = false, length = 20)
    private String postalCode;
    @Column(length = 50)
    private String country;
    @Column(name = "is_default")
    private Boolean isDefault;
    // Relationship to Customer
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}