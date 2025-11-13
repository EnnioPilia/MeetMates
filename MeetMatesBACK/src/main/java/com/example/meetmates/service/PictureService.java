package com.example.meetmates.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.meetmates.model.PictureUser;
import com.example.meetmates.model.User;
import com.example.meetmates.repository.PictureUserRepository;
import com.example.meetmates.repository.UserRepository;

@Service
public class PictureService {

    private final PictureUserRepository pictureUserRepository;
    private final UserRepository userRepository;

    public PictureService(
            PictureUserRepository pictureUserRepository,
            UserRepository userRepository) {
        this.pictureUserRepository = pictureUserRepository;
        this.userRepository = userRepository;
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
