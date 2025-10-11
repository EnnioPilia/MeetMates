package com.example.meetmates.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.meetmates.dto.EventDetailsDTO;
import com.example.meetmates.dto.EventRequest;
import com.example.meetmates.dto.EventResponse;
import com.example.meetmates.dto.EventUserDTO;
import com.example.meetmates.model.core.Address;
import com.example.meetmates.model.core.Event;
import com.example.meetmates.model.core.EventUser;
import com.example.meetmates.model.core.User;
import com.example.meetmates.model.link.PictureEvent;
import com.example.meetmates.model.media.Picture;
import com.example.meetmates.repository.ActivityRepository;
import com.example.meetmates.repository.AddressRepository;
import com.example.meetmates.repository.EventRepository;
import com.example.meetmates.repository.EventUserRepository;
import com.example.meetmates.repository.PictureEventRepository;
import com.example.meetmates.repository.PictureRepository;
import com.example.meetmates.repository.UserRepository;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final ActivityRepository activityRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final EventUserRepository eventUserRepository;
    private final PictureRepository pictureRepository;
    private final PictureEventRepository pictureEventRepository;

    public EventService(
            EventRepository eventRepository,
            ActivityRepository activityRepository,
            AddressRepository addressRepository,
            UserRepository userRepository,
            EventUserRepository eventUserRepository,
            PictureRepository pictureRepository,
            PictureEventRepository pictureEventRepository
    ) {
        this.eventRepository = eventRepository;
        this.activityRepository = activityRepository;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.eventUserRepository = eventUserRepository;
        this.pictureRepository = pictureRepository;
        this.pictureEventRepository = pictureEventRepository;
    }

    // 🔹 Conversion Event -> EventResponse
    private EventResponse toResponse(Event e) {
        String organizerName = e.getParticipants().stream()
                .filter(p -> p.getRole() == EventUser.ParticipantRole.ORGANIZER)
                .findFirst()
                .map(p -> p.getUser().getFirstName() + " " + p.getUser().getLastName())
                .orElse("Inconnu");

        List<String> participantNames = e.getParticipants().stream()
                .filter(p -> p.getRole() == EventUser.ParticipantRole.PARTICIPANT)
                .map(p -> p.getUser().getFirstName() + " " + p.getUser().getLastName())
                .collect(Collectors.toList());

        String imageUrl = (e.getPictures() != null && !e.getPictures().isEmpty())
                ? e.getPictures().stream()
                        .filter(PictureEvent::isMain)
                        .findFirst()
                        .map(pe -> pe.getPicture().getUrl())
                        .orElse(e.getPictures().get(0).getPicture().getUrl())
                : null;

        return new EventResponse(
                e.getId(),
                e.getTitle(),
                e.getDescription(),
                e.getEventDate(),
                e.getStartTime(),
                e.getEndTime(),
                e.getMaxParticipants(),
                e.getStatus(),
                e.getMaterial(),
                e.getLevel(),
                e.getActivity() != null ? e.getActivity().getName() : null,
                e.getAddress() != null ? e.getAddress().getFullAddress() : null,
                organizerName,
                participantNames,
                imageUrl
        );
    }

    // ✅ Liste complète (avec images)
    public List<EventResponse> findAllResponses() {
        return eventRepository.findAllWithPictures()
                .stream()
                .map(EventResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public EventResponse findResponseById(UUID id) {
        Event event = eventRepository.findByIdWithAllRelations(id)
                .orElseThrow(() -> new RuntimeException("Événement introuvable avec l'id: " + id));
        return toResponse(event);
    }

    // ✅ Événements d’une activité (avec images)
    public List<EventResponse> getEventResponsesByActivity(UUID activityId) {
        return eventRepository.findByActivityIdWithPictures(activityId)
                .stream()
                .map(EventResponse::from)
                .toList();
    }

    // ✅ Création d’un événement
    public EventResponse createEvent(EventRequest req) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        User organizer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        var activity = activityRepository.findById(req.getActivityId())
                .orElseThrow(() -> new RuntimeException("Activité introuvable"));

        if (req.getAddress() == null) {
            throw new IllegalArgumentException("Adresse requise");
        }
        Address address = addressRepository.save(req.getAddress());

        Event event = new Event();
        event.setTitle(req.getTitle());
        event.setDescription(req.getDescription());
        event.setEventDate(req.getEventDate());
        event.setStartTime(req.getStartTime());
        event.setEndTime(req.getEndTime());
        event.setMaxParticipants(req.getMaxParticipants());
        event.setStatus(req.getStatus());
        event.setMaterial(req.getMaterial());
        event.setLevel(req.getLevel());
        event.setActivity(activity);
        event.setAddress(address);

        Event savedEvent = eventRepository.save(event);

        EventUser organizerLink = new EventUser();
        organizerLink.setEvent(savedEvent);
        organizerLink.setUser(organizer);
        organizerLink.setRole(EventUser.ParticipantRole.ORGANIZER);
        organizerLink.setParticipationStatus(EventUser.ParticipationStatus.ACCEPTED);
        eventUserRepository.save(organizerLink);

        if (savedEvent.getParticipants() == null) {
            savedEvent.setParticipants(new ArrayList<>());
        }
        savedEvent.getParticipants().add(organizerLink);

        return toResponse(savedEvent);
    }

    // ✅ Ajout d’une image à un événement
    @Transactional
    public EventResponse addPictureToEvent(UUID eventId, MultipartFile file, boolean isMain) {
        Event event = eventRepository.findByIdWithPictures(eventId)
                .orElseThrow(() -> new RuntimeException("Événement introuvable"));

        try {
            String imageUrl = "https://cdn.meetmates.com/uploads/" + file.getOriginalFilename();

            Picture picture = new Picture();
            picture.setName(file.getOriginalFilename());
            picture.setUrl(imageUrl);
            picture.setType(Picture.PictureType.EVENT);
            pictureRepository.save(picture);

            PictureEvent link = new PictureEvent();
            link.setEvent(event);
            link.setPicture(picture);
            link.setMain(isMain);
            pictureEventRepository.save(link);

            event.getPictures().add(link);
            eventRepository.save(event);

            Event refreshed = eventRepository.findByIdWithPictures(event.getId())
                    .orElseThrow(() -> new RuntimeException("Erreur lors du rechargement de l’événement"));

            return toResponse(refreshed);

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l’ajout de la photo à l’événement", e);
        }
    }

    // ✅ Suppression
    public void delete(UUID id) {
        eventRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public EventDetailsDTO findEventDetailsById(UUID eventId) {
        Event event = eventRepository.findByIdWithAllRelations(eventId)
                .orElseThrow(() -> new RuntimeException("Événement introuvable avec l'id: " + eventId));

        String organizerName = event.getParticipants().stream()
                .filter(p -> p.getRole() == EventUser.ParticipantRole.ORGANIZER)
                .findFirst()
                .map(p -> p.getUser().getFirstName() + " " + p.getUser().getLastName())
                .orElse("Inconnu");

        List<EventUserDTO> accepted = event.getParticipants().stream()
                .filter(p -> p.getParticipationStatus() == EventUser.ParticipationStatus.ACCEPTED)
                .map(this::toEventUserDTO)
                .toList();

        List<EventUserDTO> pending = event.getParticipants().stream()
                .filter(p -> p.getParticipationStatus() == EventUser.ParticipationStatus.PENDING)
                .map(this::toEventUserDTO)
                .toList();

        List<EventUserDTO> rejected = event.getParticipants().stream()
                .filter(p -> p.getParticipationStatus() == EventUser.ParticipationStatus.REJECTED)
                .map(this::toEventUserDTO)
                .toList();

        String imageUrl = (event.getPictures() != null && !event.getPictures().isEmpty())
                ? event.getPictures().stream()
                        .filter(PictureEvent::isMain)
                        .findFirst()
                        .map(pe -> pe.getPicture().getUrl())
                        .orElse(event.getPictures().get(0).getPicture().getUrl())
                : null;

        String participationStatus = null;
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            var currentUserOpt = userRepository.findByEmail(auth.getName());
            if (currentUserOpt.isPresent()) {
                var currentUser = currentUserOpt.get();
                for (EventUser eu : event.getParticipants()) {
                    if (eu.getUser() != null && currentUser.getId().equals(eu.getUser().getId())) {
                        participationStatus = eu.getParticipationStatus().name();
                        break;
                    }
                }
            }
        }

        return new EventDetailsDTO(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getEventDate().toString(),
                event.getStartTime().toString(),
                event.getEndTime().toString(),
                event.getAddress() != null ? event.getAddress().getFullAddress() : null,
                event.getActivity() != null ? event.getActivity().getName() : null,
                organizerName,
                event.getLevel().toString(),
                event.getMaterial().toString(),
                event.getStatus().toString(),
                event.getMaxParticipants(),
                imageUrl,
                participationStatus,
                accepted,
                pending,
                rejected
        );
    }

    private EventUserDTO toEventUserDTO(EventUser eu) {
        Event event = eu.getEvent();
        var user = eu.getUser();

        return new EventUserDTO(
                eu.getId(),
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                eu.getRole().name(),
                eu.getParticipationStatus().name(),
                eu.getJoinedAt() != null ? eu.getJoinedAt().toString() : null,
                event.getStatus().name(),
                event.getEventDate().toString(),
                event.getAddress() != null ? event.getAddress().getFullAddress() : null
        );
    }
}
