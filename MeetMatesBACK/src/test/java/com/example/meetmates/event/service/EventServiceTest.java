package com.example.meetmates.event.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import com.example.meetmates.activity.model.Activity;
import com.example.meetmates.activity.repository.ActivityRepository;
import com.example.meetmates.common.exception.ApiException;
import com.example.meetmates.common.exception.ErrorCode;
import com.example.meetmates.event.dto.EventDetailsDto;
import com.example.meetmates.event.dto.EventRequestDto;
import com.example.meetmates.event.dto.EventResponseDto;
import com.example.meetmates.event.mapper.EventMapper;
import com.example.meetmates.event.model.Event;
import com.example.meetmates.event.model.EventUser;
import com.example.meetmates.event.model.EventUser.ParticipantRole;
import com.example.meetmates.event.repository.EventRepository;
import com.example.meetmates.event.repository.EventUserRepository;
import com.example.meetmates.user.model.User;
import com.example.meetmates.user.repository.UserRepository;

class EventServiceTest {

    @Mock private EventRepository eventRepository;
    @Mock private ActivityRepository activityRepository;
    @Mock private EventUserRepository eventUserRepository;
    @Mock private EventMapper eventMapper;
    @Mock private UserRepository userRepository;

    @InjectMocks private EventService eventService;

    private User mockUser;
    private EventRequestDto mockRequest;
    private Authentication mockAuth;
    private SecurityContext mockSecurityContext;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Utilisateur mocké pour SecurityContext
        mockUser = new User();
        mockUser.setId(UUID.randomUUID());
        mockUser.setEmail("user@test.com");
        mockUser.setFirstName("John");
        mockUser.setLastName("Doe");

        // Mock SecurityContext
        mockAuth = mock(Authentication.class);
        when(mockAuth.isAuthenticated()).thenReturn(true);
        when(mockAuth.getName()).thenReturn(mockUser.getEmail());

        mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        // Mock UserRepository pour retourner l'utilisateur authentifié
        when(userRepository.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));

        // DTO de création d'événement
        mockRequest = new EventRequestDto();
        mockRequest.setTitle("Test Event");
        mockRequest.setDescription("Description");
        mockRequest.setEventDate(LocalDate.now().plusDays(1));
        mockRequest.setStartTime(LocalTime.of(10, 0));
        mockRequest.setEndTime(LocalTime.of(12, 0));
        mockRequest.setMaxParticipants(10);
    }

    @Test
    void createEvent_success() {
        // Mock activité
        Activity activity = new Activity();
        activity.setId(UUID.randomUUID());
        when(activityRepository.findById(any())).thenReturn(Optional.of(activity));

        // Mock EventRepository
        Event savedEvent = new Event();
        savedEvent.setId(UUID.randomUUID());
        when(eventRepository.save(any(Event.class))).thenReturn(savedEvent);

        // Mock EventMapper
        EventResponseDto mockDto = mock(EventResponseDto.class);
        when(eventMapper.toResponse(any(Event.class))).thenReturn(mockDto);

        EventResponseDto result = eventService.createEvent(mockRequest);

        assertNotNull(result);
        verify(eventUserRepository, times(1)).save(any(EventUser.class));
        verify(eventRepository, times(1)).save(any(Event.class));
    }

    @Test
    void createEvent_activityNotFound() {
        when(activityRepository.findById(any())).thenReturn(Optional.empty());

        ApiException ex = assertThrows(ApiException.class,
            () -> eventService.createEvent(mockRequest));

        assertEquals(ErrorCode.ACTIVITY_NOT_FOUND, ex.getErrorCode());
    }

    @Test
    void deleteEvent_success() {
        Event event = new Event();
        event.setId(UUID.randomUUID());
        EventUser eu = new EventUser();
        eu.setUser(mockUser);
        eu.setRole(ParticipantRole.ORGANIZER);
        event.setParticipants(List.of(eu));

        when(eventRepository.findById(any())).thenReturn(Optional.of(event));

        eventService.deleteEvent(event.getId());

        assertNotNull(event.getDeletedAt());
        verify(eventRepository, times(1)).save(event);
    }

    @Test
    void deleteEvent_notOrganizer() {
        Event event = new Event();
        event.setId(UUID.randomUUID());
        User otherUser = new User();
        otherUser.setId(UUID.randomUUID());
        EventUser eu = new EventUser();
        eu.setUser(otherUser);
        eu.setRole(ParticipantRole.PARTICIPANT);
        event.setParticipants(List.of(eu));

        when(eventRepository.findById(any())).thenReturn(Optional.of(event));

        ApiException ex = assertThrows(ApiException.class,
            () -> eventService.deleteEvent(event.getId()));

        assertEquals(ErrorCode.EVENT_FORBIDDEN, ex.getErrorCode());
    }
    @Test
void findEventDetailsById_success() {
    UUID eventId = UUID.randomUUID();

    Event event = new Event();
    event.setId(eventId);
    event.setTitle("Test Event");
    event.setDescription("Desc");
    event.setEventDate(LocalDate.now());
    event.setStartTime(LocalTime.of(10, 0));
    event.setEndTime(LocalTime.of(12, 0));
    event.setLevel(Event.Level.ALL_LEVELS);
    event.setMaterial(Event.MaterialOption.NOT_REQUIRED);
    event.setStatus(Event.EventStatus.OPEN);
    event.setMaxParticipants(10);

    // Organizer
    EventUser organizerEU = new EventUser();
    organizerEU.setUser(mockUser);
    organizerEU.setRole(ParticipantRole.ORGANIZER);
    organizerEU.setParticipationStatus(EventUser.ParticipationStatus.ACCEPTED);

    // Participant pending
    EventUser pendingEU = new EventUser();
    pendingEU.setUser(new User());
    pendingEU.setRole(ParticipantRole.PARTICIPANT);
    pendingEU.setParticipationStatus(EventUser.ParticipationStatus.PENDING);

    event.setParticipants(List.of(organizerEU, pendingEU));

    when(eventRepository.findByIdWithAllRelations(eventId))
            .thenReturn(Optional.of(event));

    EventDetailsDto dto = eventService.findEventDetailsById(eventId);

    assertNotNull(dto);
    assertEquals("Test Event", dto.title());
    assertEquals("John Doe", dto.organizerName());
    assertEquals("ACCEPTED", dto.participationStatus());
    assertEquals(1, dto.acceptedParticipants().size());
    assertEquals(1, dto.pendingParticipants().size());
}
@Test
void findAllResponses_success() {
    Event event = new Event();
    EventResponseDto dto = mock(EventResponseDto.class);

    when(eventRepository.findAllActiveWithDetails())
            .thenReturn(List.of(event));
    when(eventMapper.toResponse(event)).thenReturn(dto);

    List<EventResponseDto> result = eventService.findAllResponses();

    assertEquals(1, result.size());
    verify(eventMapper).toResponse(event);
}
@Test
void getEventResponsesByActivity_success() {
    UUID activityId = UUID.randomUUID();
    Event event = new Event();

    when(activityRepository.findById(activityId))
            .thenReturn(Optional.of(new Activity()));
    when(eventRepository.findActiveByActivityIdWithDetails(activityId))
            .thenReturn(List.of(event));
    when(eventMapper.toResponse(event))
            .thenReturn(mock(EventResponseDto.class));

    List<EventResponseDto> result =
            eventService.getEventResponsesByActivity(activityId);

    assertEquals(1, result.size());
}
@Test
void getEventResponsesByActivity_activityNotFound() {
    UUID activityId = UUID.randomUUID();

    when(activityRepository.findById(activityId))
            .thenReturn(Optional.empty());

    ApiException ex = assertThrows(ApiException.class,
            () -> eventService.getEventResponsesByActivity(activityId));

    assertEquals(ErrorCode.ACTIVITY_NOT_FOUND, ex.getErrorCode());
}
@Test
void updateEvent_success() {
    UUID eventId = UUID.randomUUID();
    Event event = new Event();
    event.setId(eventId);

    EventRequestDto dto = new EventRequestDto();
    dto.setTitle("Updated title");
    dto.setDescription("Updated desc");
    dto.setEventDate(LocalDate.now());
    dto.setStartTime(LocalTime.of(9, 0));
    dto.setEndTime(LocalTime.of(11, 0));
    dto.setMaxParticipants(20);

    when(eventRepository.findById(eventId))
            .thenReturn(Optional.of(event));
    when(eventRepository.save(event))
            .thenReturn(event);
    when(eventMapper.toResponse(event))
            .thenReturn(mock(EventResponseDto.class));

    EventResponseDto result =
            eventService.updateEvent(eventId, dto);

    assertNotNull(result);
    assertEquals("Updated title", event.getTitle());
}
@Test
void searchEvents_success() {
    Event event = new Event();

    when(eventRepository.searchActiveEvents("sport"))
            .thenReturn(List.of(event));
    when(eventMapper.toResponse(event))
            .thenReturn(mock(EventResponseDto.class));

    List<EventResponseDto> result =
            eventService.searchEvents("sport");

    assertEquals(1, result.size());
}
@Test
void searchEvents_blank_shouldReturnEmpty() {
    List<EventResponseDto> result =
            eventService.searchEvents("  ");

    assertEquals(0, result.size());
}

}
