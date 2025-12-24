package com.example.meetmates.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.dto.EventResponseDto;
import com.example.meetmates.mapper.EventMapper;
import com.example.meetmates.model.User;
import com.example.meetmates.repository.EventRepository;
import com.example.meetmates.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {
    
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EventMapper eventMapper;
    private final UserService userService;
    private final EventService eventService;

    /* ===================== USERS ===================== */

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .filter(u -> u.getDeletedAt() == null)
                .toList();
    }

    @Transactional
    public void softDeleteUser(UUID userId) {
        userService.softDeleteById(userId);
    }

    @Transactional
    public void hardDeleteUser(UUID userId) {
        userService.hardDeleteById(userId);
    }

    /* ===================== EVENTS ===================== */

@Transactional(readOnly = true)
public List<EventResponseDto> getAllEvents() {
    return eventRepository.findAll()
            .stream()
            .map(eventMapper::toResponse)
            .toList();
}


    @Transactional
    public void softDeleteEvent(UUID eventId) {
        eventService.softDeleteById(eventId);
    }

    @Transactional
    public void hardDeleteEvent(UUID eventId) {
        eventService.hardDeleteById(eventId);
    }
}
