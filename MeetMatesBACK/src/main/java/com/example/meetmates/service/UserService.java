package com.example.meetmates.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.dto.UpdateUserDto;
import com.example.meetmates.exception.ErrorCode;
import com.example.meetmates.exception.ForbiddenException;
import com.example.meetmates.exception.NotFoundException;
import com.example.meetmates.mapper.UserMapper;
import com.example.meetmates.model.TokenType;
import com.example.meetmates.model.User;
import com.example.meetmates.model.UserStatus;
import com.example.meetmates.repository.TokenRepository;
import com.example.meetmates.repository.UserRepository;



@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository,
                       TokenRepository tokenRepository,
                       UserMapper userMapper) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.userMapper = userMapper;
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .filter(u -> u.getDeletedAt() == null)
                .toList();
    }

    @Transactional(readOnly = true)
    public User findActiveByEmailOrThrow(String email) {
        return userRepository.findByEmailAndDeletedAtIsNull(email.toLowerCase())
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND));
    }

    @Transactional
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND));

        if (user.getStatus() == UserStatus.BANNED) {
            throw new ForbiddenException(ErrorCode.USER_BANNED);
        }

        if (!user.isEnabled()) {
            throw new ForbiddenException(ErrorCode.USER_DISABLED);
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }

    @Transactional
    public User updateProfile(User user, UpdateUserDto dto) {
        if (user == null) {
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
        }
        userMapper.updateFromDto(dto, user);
        return userRepository.save(user);
    }

    @Transactional
    public User clearProfilePicture(User user) {
        if (user == null) {
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
        }
        user.setProfilePictureUrl(null);
        return userRepository.save(user);
    }

    @Transactional
    public boolean hardDeleteById(UUID userId) {

        if (!userRepository.existsById(userId)) {
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
        }

        tokenRepository.deleteByUser_IdAndType(userId, TokenType.REFRESH);
        tokenRepository.deleteByUser_IdAndType(userId, TokenType.VERIFICATION);
        tokenRepository.deleteByUser_IdAndType(userId, TokenType.PASSWORD_RESET);

        userRepository.deleteById(userId);
        return true;
    }

    @Transactional
    public boolean softDeleteByEmail(String email) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(email.toLowerCase())
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND));

        tokenRepository.deleteByUser_Id(user.getId());
        if (user.getTokens() != null) user.getTokens().clear();

        user.setDeletedAt(LocalDateTime.now());
        user.setStatus(UserStatus.DELETED);
        user.setEnabled(false);

        userRepository.save(user);
        return true;
    }
}
