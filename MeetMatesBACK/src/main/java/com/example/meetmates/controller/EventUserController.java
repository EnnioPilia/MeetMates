package com.example.meetmates.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.meetmates.dto.ApiResponse;
import com.example.meetmates.dto.EventUserDto;
import com.example.meetmates.exception.ErrorCode;
import com.example.meetmates.exception.NotFoundException;
import com.example.meetmates.exception.UnauthorizedException;
import com.example.meetmates.model.User;
import com.example.meetmates.repository.UserRepository;
import com.example.meetmates.service.EventUserService;
import com.example.meetmates.service.MessageService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/event-user")
public class EventUserController {

    private final EventUserService eventUserService;
    private final UserRepository userRepository;
    private final MessageService messageService;

    public EventUserController(EventUserService eventUserService,
                               UserRepository userRepository,
                               MessageService messageService) {
        this.eventUserService = eventUserService;
        this.userRepository = userRepository;
        this.messageService = messageService;
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException(ErrorCode.AUTH_UNAUTHORIZED);
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND));
    }

    @PostMapping("/{eventId}/join")
    public ResponseEntity<ApiResponse<EventUserDto>> joinEvent(@PathVariable UUID eventId, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        EventUserDto dto = eventUserService.joinEvent(eventId, user.getId());
        String message = messageService.get("event.join.success");
        return ResponseEntity.ok(new ApiResponse<>(message, dto));
    }

    @DeleteMapping("/{eventId}/leave")
    public ResponseEntity<ApiResponse<EventUserDto>> leaveEvent(@PathVariable UUID eventId, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        EventUserDto dto = eventUserService.leaveEvent(eventId, user.getId());
        String message = messageService.get("event.leave.success");
        return ResponseEntity.ok(new ApiResponse<>(message, dto));
    }

    @PutMapping("/{eventUserId}/accept")
    public ResponseEntity<ApiResponse<EventUserDto>> acceptParticipant(@PathVariable UUID eventUserId) {
        EventUserDto dto = eventUserService.acceptParticipant(eventUserId);
        String message = messageService.get("event.participant.accept.success");
        return ResponseEntity.ok(new ApiResponse<>(message, dto));
    }

    @PutMapping("/{eventUserId}/reject")
    public ResponseEntity<ApiResponse<EventUserDto>> rejectParticipant(@PathVariable UUID eventUserId) {
        EventUserDto dto = eventUserService.rejectParticipant(eventUserId);
        String message = messageService.get("event.participant.reject.success");
        return ResponseEntity.ok(new ApiResponse<>(message, dto));
    }

    @GetMapping("/participating")
    public ResponseEntity<ApiResponse<List<EventUserDto>>> getEventsParticipating(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<EventUserDto> dtos = eventUserService.findByUserId(user.getId());
        String message = messageService.get("event.participating.list.success");
        return ResponseEntity.ok(new ApiResponse<>(message, dtos));
    }

    @GetMapping("/organized")
    public ResponseEntity<ApiResponse<List<EventUserDto>>> getEventsOrganized(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<EventUserDto> dtos = eventUserService.findOrganizedByUserId(user.getId());
        String message = messageService.get("event.organized.list.success");
        return ResponseEntity.ok(new ApiResponse<>(message, dtos));
    }

    @DeleteMapping("/{eventId}/participants/{userId}")
    public ResponseEntity<ApiResponse<Void>> removeParticipant(
            @PathVariable UUID eventId,
            @PathVariable UUID userId,
            Authentication authentication) {

        User organizer = getAuthenticatedUser(authentication);
        eventUserService.removeParticipant(eventId, userId, organizer.getId());
        String message = messageService.get("event.participant.remove.success");
        return ResponseEntity.ok(new ApiResponse<>(message, null));
    }
}
