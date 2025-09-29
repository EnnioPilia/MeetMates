package com.example.meetmates.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.meetmates.model.core.Event;
import com.example.meetmates.repository.EventRepository;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<Event> findAll() {
        return eventRepository.findAll();
    }

    public Event findById(UUID id) {
        return eventRepository.findById(id).orElse(null);
    }

    public Event save(Event event) {
        return eventRepository.save(event);
    }

    public void delete(UUID id) {
        eventRepository.deleteById(id);
    }
}
