package com.quadzone.auth.token;

import com.quadzone.user.User;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"user"})
@Entity
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(unique = true, length = 512) // Store the token string
    public String token;

    @Builder.Default
    public boolean loggedOut = false;

    @Builder.Default
    public boolean revoked = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    public User user;
}