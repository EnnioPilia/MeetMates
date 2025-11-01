package com.example.meetmates.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.meetmates.model.core.Event;
import com.example.meetmates.model.core.User;
import com.example.meetmates.model.link.PictureEvent;
import com.example.meetmates.model.link.PictureEventID;
import com.example.meetmates.model.media.Picture;
import com.example.meetmates.model.media.PictureUser;
import com.example.meetmates.repository.PictureEventRepository;
import com.example.meetmates.repository.PictureRepository;
import com.example.meetmates.repository.PictureUserRepository;
import com.example.meetmates.repository.UserRepository;

@Service
public class PictureService {

    private final PictureRepository pictureRepository;
    private final PictureEventRepository pictureEventRepository;
    private final PictureUserRepository pictureUserRepository;
    private final UserRepository userRepository;

    public PictureService(PictureRepository pictureRepository,
            PictureEventRepository pictureEventRepository,
            PictureUserRepository pictureUserRepository,
            UserRepository userRepository) {
        this.pictureRepository = pictureRepository;
        this.pictureEventRepository = pictureEventRepository;
        this.pictureUserRepository = pictureUserRepository;
        this.userRepository = userRepository;
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

    @Transactional
    public PictureUser uploadUserProfilePicture(User user, MultipartFile file) {
        try {
            String imageUrl = "https://cdn.meetmates.com/profiles/" + file.getOriginalFilename();

            Optional<PictureUser> existing = pictureUserRepository.findByUser(user);
            PictureUser pictureUser;

            if (existing.isPresent()) {
                pictureUser = existing.get();
                pictureUser.setUrl(imageUrl);
                pictureUser.setUpdatedAt(LocalDateTime.now());
            } else {
                pictureUser = new PictureUser();
                pictureUser.setUser(user);
                pictureUser.setUrl(imageUrl);
                pictureUser.setPublicId(file.getOriginalFilename());
                pictureUser.setMain(true);
                pictureUser.setCreatedAt(LocalDateTime.now());
            }

            return pictureUserRepository.save(pictureUser);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l’ajout de la photo de profil", e);
        }
    }

    @Transactional
    public User saveUserProfilePicture(User user, MultipartFile file) throws IOException {
        String imageUrl = "https://cdn.meetmates.com/profiles/" + file.getOriginalFilename();

        user.setProfilePictureUrl(imageUrl);
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUserProfilePicture(User user) {
        try {
            User existingUser = userRepository.findById(user.getId())
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

            Optional<PictureUser> existingPicture = pictureUserRepository.findByUser(existingUser);
            if (existingPicture.isPresent()) {
                pictureUserRepository.delete(existingPicture.get());
            }

            existingUser.setProfilePictureUrl(null);

            userRepository.saveAndFlush(existingUser);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la suppression de la photo de profil", e);
        }
    }
}
