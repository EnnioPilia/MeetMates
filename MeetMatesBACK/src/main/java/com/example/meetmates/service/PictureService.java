package com.example.meetmates.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.meetmates.model.core.Event;
import com.example.meetmates.model.link.PictureEvent;
import com.example.meetmates.model.link.PictureEventID;
import com.example.meetmates.model.media.Picture;
import com.example.meetmates.repository.PictureEventRepository;
import com.example.meetmates.repository.PictureRepository;

@Service
public class PictureService {

    private final PictureRepository pictureRepository;
    private final PictureEventRepository pictureEventRepository;

    public PictureService(PictureRepository pictureRepository, PictureEventRepository pictureEventRepository) {
        this.pictureRepository = pictureRepository;
        this.pictureEventRepository = pictureEventRepository;
    }

    public Picture save(Picture picture) {
        return pictureRepository.save(picture);
    }

    public List<Picture> getAll() {
        return pictureRepository.findAll();
    }

    public void delete(UUID id) {
        pictureRepository.deleteById(id);
    }

    // Associer une picture à un event
    public void linkPictureToEvent(Picture picture, Event event) {
        if (picture.getId() == null) {
            pictureRepository.save(picture);
        }

        PictureEvent pictureEvent = new PictureEvent();
        pictureEvent.setPicture(picture);
        pictureEvent.setEvent(event);
        pictureEvent.setId(new PictureEventID(picture.getId(), event.getId()));

        pictureEventRepository.save(pictureEvent);
    }

    // Récupérer toutes les pictures liées à un event
    public List<Picture> getPicturesByEvent(Event event) {
        return pictureEventRepository.findPicturesByEvent(event);
    }
}
