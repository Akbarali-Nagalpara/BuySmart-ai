package com.example.backend.serviceImp;


import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setLastLogin(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Override
    public User login(String email, String password) {

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) return null;

        User user = userOpt.get();

        if (!passwordEncoder.matches(password, user.getPassword()))
            return null;

        user.setLastLogin(LocalDateTime.now());
        return userRepository.save(user);
    }

}

