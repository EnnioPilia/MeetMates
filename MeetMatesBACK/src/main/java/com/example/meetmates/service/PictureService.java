package com.example.meetmates.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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

    public PictureService(PictureRepository pictureRepository,
            PictureEventRepository pictureEventRepository) {
        this.pictureRepository = pictureRepository;
        this.pictureEventRepository = pictureEventRepository;
    }

    @Transactional
    public Picture save(Picture picture) {
        return pictureRepository.save(picture);
    }

    @Transactional(readOnly = true)
    public List<Picture> getAll() {
        return pictureRepository.findAll();
    }

    @Transactional
    public void delete(UUID id) {
        pictureRepository.deleteById(id);
    }

    @Transactional
    public void linkPictureToEvent(Picture picture, Event event) {
        if (picture.getId() == null) {
            picture = pictureRepository.save(picture);
        }

        boolean alreadyLinked = pictureEventRepository.existsByPictureAndEvent(picture, event);
        if (alreadyLinked) {
            return;
        }

        PictureEvent pictureEvent = new PictureEvent();
        pictureEvent.setPicture(picture);
        pictureEvent.setEvent(event);
        pictureEvent.setId(new PictureEventID(picture.getId(), event.getId()));

        pictureEventRepository.save(pictureEvent);

        if (event.getPictures() != null) {
            event.getPictures().add(pictureEvent);
        }
    }

    @Transactional(readOnly = true)
    public List<Picture> getPicturesByEvent(Event event) {
        return pictureEventRepository.findPicturesByEvent(event);
    }

    @Transactional
    public void addPictureToEvent(Event event, MultipartFile file, boolean isMain) {
        try {
            String imageUrl = "https://cdn.meetmates.com/uploads/" + file.getOriginalFilename();

            Picture picture = new Picture();
            picture.setName(file.getOriginalFilename());
            picture.setUrl(imageUrl);
            picture.setType(Picture.PictureType.EVENT);
            pictureRepository.save(picture);

            PictureEvent pictureEvent = new PictureEvent();
            pictureEvent.setEvent(event);
            pictureEvent.setPicture(picture);
            pictureEvent.setMain(isMain);

            pictureEventRepository.save(pictureEvent);

            if (event.getPictures() != null) {
                event.getPictures().add(pictureEvent);
            }
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l’ajout de la photo à l’événement", e);
        }
    }

}
