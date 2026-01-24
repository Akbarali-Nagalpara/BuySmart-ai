package com.example.backend.security;


import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtTokenUtil {

    private final String secret = "jhdhgfgdsdhjfefbehfughruigfrufgiugfurgfhfurgigrhgerrurhguihrbkj";  // Change later
    private final long expiration = 1000 * 60 * 60 * 24;   // 24 hours
    private final UserRepository userRepository;

    public JwtTokenUtil(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }
    public User getUserFromToken(String token) {
        // remove "Bearer " prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secret)
                .build()
                .parseClaimsJws(token)
                .getBody();

        String email = claims.getSubject(); // subject = email

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for token"));
    }



    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secret)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(secret).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

