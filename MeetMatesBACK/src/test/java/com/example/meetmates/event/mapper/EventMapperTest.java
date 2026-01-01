package com.example.meetmates.event.mapper;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.Test;

import com.example.meetmates.event.dto.EventResponseDto;
import com.example.meetmates.event.model.Event;
import com.example.meetmates.event.model.Event.EventStatus;
import com.example.meetmates.event.model.Event.Level;
import com.example.meetmates.event.model.Event.MaterialOption;
import com.example.meetmates.event.model.EventUser;
import com.example.meetmates.event.model.EventUser.ParticipantRole;
import com.example.meetmates.user.model.User;

class EventMapperTest {

    private final EventMapper mapper = new EventMapper();

    @Test
    void should_map_event_to_event_response_dto_with_organizer_and_participants() {
        // GIVEN
        User organizer = new User();
        organizer.setId(UUID.randomUUID());
        organizer.setFirstName("Alice");
        organizer.setLastName("Martin");

        User participant = new User();
        participant.setFirstName("Bob");
        participant.setLastName("Dupont");

        Event event = new Event();
        event.setId(UUID.randomUUID());
        event.setTitle("Tournoi");
        event.setDescription("Tournoi sportif");
        event.setEventDate(LocalDate.now());
        event.setStartTime(LocalTime.of(10, 0));
        event.setEndTime(LocalTime.of(12, 0));
        event.setMaxParticipants(10);
        event.setStatus(EventStatus.OPEN);
        event.setMaterial(MaterialOption.PROVIDED);
        event.setLevel(Level.BEGINNER);

        EventUser organizerEU = new EventUser();
        organizerEU.setUser(organizer);
        organizerEU.setRole(ParticipantRole.ORGANIZER);
        organizerEU.setEvent(event);

        EventUser participantEU = new EventUser();
        participantEU.setUser(participant);
        participantEU.setRole(ParticipantRole.PARTICIPANT);
        participantEU.setEvent(event);

        event.setParticipants(List.of(organizerEU, participantEU));

        // WHEN
        EventResponseDto dto = mapper.toResponse(event);

        // THEN
        assertNotNull(dto);
        assertEquals("Tournoi", dto.title());
        assertEquals("Alice Martin", dto.organizerName());
        assertEquals(1, dto.participantNames().size());
        assertEquals("Bob Dupont", dto.participantNames().get(0));
        assertEquals(EventStatus.OPEN, dto.status());
        assertEquals(MaterialOption.PROVIDED, dto.material());
        assertEquals(Level.BEGINNER, dto.level());
    }
}
