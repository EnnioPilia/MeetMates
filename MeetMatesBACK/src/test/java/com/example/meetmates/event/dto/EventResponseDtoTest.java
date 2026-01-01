package com.example.meetmates.event.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.Test;

import com.example.meetmates.event.model.Event;
import com.example.meetmates.event.model.Event.EventStatus;
import com.example.meetmates.event.model.Event.Level;
import com.example.meetmates.event.model.Event.MaterialOption;
import com.example.meetmates.event.model.EventUser;
import com.example.meetmates.event.model.EventUser.ParticipantRole;
import com.example.meetmates.user.model.User;

class EventResponseDtoTest {

    @Test
    void should_map_event_to_event_response_dto() {
        // ===== GIVEN =====

        User organizer = new User();
        organizer.setId(UUID.randomUUID());
        organizer.setFirstName("Alice");
        organizer.setLastName("Martin");

        User participant = new User();
        participant.setId(UUID.randomUUID());
        participant.setFirstName("Bob");
        participant.setLastName("Dupont");

        Event event = new Event();
        event.setId(UUID.randomUUID());
        event.setTitle("Tournoi de tennis");
        event.setDescription("Tournoi amical");
        event.setEventDate(LocalDate.of(2026, 1, 15));
        event.setStartTime(LocalTime.of(9, 0));
        event.setEndTime(LocalTime.of(12, 0));
        event.setMaxParticipants(8);
        event.setStatus(EventStatus.OPEN);
        event.setMaterial(MaterialOption.NOT_REQUIRED);
        event.setLevel(Level.ALL_LEVELS);

        EventUser organizerEU = new EventUser();
        organizerEU.setUser(organizer);
        organizerEU.setRole(ParticipantRole.ORGANIZER);
        organizerEU.setEvent(event);

        EventUser participantEU = new EventUser();
        participantEU.setUser(participant);
        participantEU.setRole(ParticipantRole.PARTICIPANT);
        participantEU.setEvent(event);

        event.setParticipants(List.of(organizerEU, participantEU));

        // ===== WHEN =====
        EventResponseDto dto = EventResponseDto.from(event);

        // ===== THEN =====
        assertNotNull(dto);
        assertEquals(event.getId(), dto.id());
        assertEquals("Tournoi de tennis", dto.title());
        assertEquals("Tournoi amical", dto.description());
        assertEquals(LocalDate.of(2026, 1, 15), dto.eventDate());
        assertEquals(LocalTime.of(9, 0), dto.startTime());
        assertEquals(LocalTime.of(12, 0), dto.endTime());
        assertEquals(8, dto.maxParticipants());
        assertEquals(EventStatus.OPEN, dto.status());
        assertEquals(MaterialOption.NOT_REQUIRED, dto.material());
        assertEquals(Level.ALL_LEVELS, dto.level());

        assertEquals(organizer.getId(), dto.organizerId());
        assertEquals("Alice Martin", dto.organizerName());

        assertEquals(1, dto.participantNames().size());
        assertEquals("Bob Dupont", dto.participantNames().get(0));
    }

    @Test
    void should_return_null_when_event_is_null() {
        // WHEN
        EventResponseDto dto = EventResponseDto.from(null);

        // THEN
        assertNull(dto);
    }
}
