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
import com.example.meetmates.repository.ActivityRepository;
import com.example.meetmates.repository.AddressRepository;
import com.example.meetmates.repository.EventRepository;
import com.example.meetmates.repository.EventUserRepository;
import com.example.meetmates.repository.UserRepository;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final ActivityRepository activityRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final EventUserRepository eventUserRepository;
    private final EventMapper eventMapper;
    private final PictureService pictureService;

    public EventService(EventRepository eventRepository,
            ActivityRepository activityRepository,
            AddressRepository addressRepository,
            UserRepository userRepository,
            EventUserRepository eventUserRepository,
            EventMapper eventMapper,
            PictureService pictureService) {
        this.eventRepository = eventRepository;
        this.activityRepository = activityRepository;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.eventUserRepository = eventUserRepository;
        this.eventMapper = eventMapper;
        this.pictureService = pictureService;
    }

    @Transactional
    public EventResponse createEvent(EventRequest req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User organizer = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        var activity = activityRepository.findById(req.getActivityId())
                .orElseThrow(() -> new RuntimeException("Activité introuvable"));

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

        Event saved = eventRepository.save(event);
        addOrganizer(saved, organizer);

        return eventMapper.toResponse(saved);
    }

    @Transactional
    public EventResponse addPictureToEvent(UUID eventId, MultipartFile file, boolean isMain) {
        Event event = eventRepository.findByIdWithPictures(eventId)
                .orElseThrow(() -> new RuntimeException("Événement introuvable"));
        pictureService.addPictureToEvent(event, file, isMain);
        eventRepository.save(event);
        return eventMapper.toResponse(event);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> findAllResponses() {
        return eventRepository.findAllWithPictures()
                .stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EventDetailsDTO findEventDetailsById(UUID id) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        var user = userRepository.findByEmail(auth.getName()).orElse(null);

        Event event = eventRepository.findByIdWithAllRelations(id)
                .orElseThrow(() -> new RuntimeException("Événement introuvable avec l'id: " + id));

        String participationStatus = null;
        if (user != null) {
            participationStatus = event.getParticipants().stream()
                    .filter(p -> p.getUser().getId().equals(user.getId()))
                    .map(p -> p.getParticipationStatus().name())
                    .findFirst()
                    .orElse("NOT_PARTICIPATING");
        }

        String organizerName = event.getParticipants().stream()
                .filter(p -> p.getRole() == EventUser.ParticipantRole.ORGANIZER)
                .findFirst()
                .map(p -> p.getUser().getFirstName() + " " + p.getUser().getLastName())
                .orElse("Inconnu");

        List<EventUserDTO> accepted = event.getParticipants().stream()
                .filter(p -> p.getParticipationStatus() == EventUser.ParticipationStatus.ACCEPTED)
                .map(eventMapper::toEventUserDTO)
                .collect(Collectors.toList());

        List<EventUserDTO> pending = event.getParticipants().stream()
                .filter(p -> p.getParticipationStatus() == EventUser.ParticipationStatus.PENDING)
                .map(eventMapper::toEventUserDTO)
                .collect(Collectors.toList());

        List<EventUserDTO> rejected = event.getParticipants().stream()
                .filter(p -> p.getParticipationStatus() == EventUser.ParticipationStatus.REJECTED)
                .map(eventMapper::toEventUserDTO)
                .collect(Collectors.toList());

        String imageUrl = (event.getPictures() != null && !event.getPictures().isEmpty())
                ? event.getPictures().stream()
                        .filter(pe -> pe.isMain())
                        .findFirst()
                        .map(pe -> pe.getPicture().getUrl())
                        .orElse(event.getPictures().get(0).getPicture().getUrl())
                : "/assets/default-event.jpg";

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

    @Transactional(readOnly = true)
    public List<EventResponse> getEventResponsesByActivity(UUID activityId) {
        return eventRepository.findByActivityIdWithPictures(activityId)
                .stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    @Transactional
    public void delete(UUID id) {
        eventRepository.deleteById(id);
    }

    private void addOrganizer(Event event, User organizer) {
        EventUser link = new EventUser();
        link.setEvent(event);
        link.setUser(organizer);
        link.setRole(EventUser.ParticipantRole.ORGANIZER);
        link.setParticipationStatus(EventUser.ParticipationStatus.ACCEPTED);
        eventUserRepository.save(link);

        if (event.getParticipants() == null) {
            event.setParticipants(new ArrayList<>());
        }
        event.getParticipants().add(link);
    }
    
  public EventResponse updateEvent(UUID id, EventRequest updatedEvent) {
    return eventRepository.findById(id)
            .map(event -> {
                // 📝 Champs simples
                event.setTitle(updatedEvent.getTitle());
                event.setDescription(updatedEvent.getDescription());
                event.setEventDate(updatedEvent.getEventDate());
                event.setStartTime(updatedEvent.getStartTime());
                event.setEndTime(updatedEvent.getEndTime());
                event.setMaxParticipants(updatedEvent.getMaxParticipants());
                event.setStatus(updatedEvent.getStatus());
                event.setMaterial(updatedEvent.getMaterial());
                event.setLevel(updatedEvent.getLevel());

                // 🏠 Mise à jour de l’adresse si fournie
                if (updatedEvent.getAddress() != null) {
                    event.setAddress(updatedEvent.getAddress());
                }

                // 🔗 Activité associée (facultatif selon ton modèle)
                if (updatedEvent.getActivityId() != null) {
                    event.setActivity(activityRepository.findById(updatedEvent.getActivityId())
                            .orElseThrow(() -> new RuntimeException("Activity not found")));
                }

                // 💾 Sauvegarde
                Event saved = eventRepository.save(event);
                return eventMapper.toResponse(saved);
            })
            .orElseThrow(() -> new RuntimeException("Event not found"));
}

}
