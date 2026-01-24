package com.example.backend.security;


import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Skip JWT validation for public endpoints
        String requestPath = request.getRequestURI();
        if (requestPath.startsWith("/api/auth/") || 
            requestPath.startsWith("/api/products/") ||
            requestPath.startsWith("/api/cache/") ||
            requestPath.startsWith("/api/prices/") ||
            requestPath.startsWith("/api/analysis/") ||
            requestPath.startsWith("/api/search-history/") ||
            requestPath.startsWith("/api/dashboard/") ||
            requestPath.startsWith("/api/history/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            if (jwtTokenUtil.isTokenValid(token)) {

                String email = jwtTokenUtil.getEmailFromToken(token);

                UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        filterChain.doFilter(request, response);
    }
}

