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

import lombok.extern.slf4j.Slf4j;

/**
 * Service pour la gestion des photos de profil des utilisateurs. Permet de
 * générer l’URL d’une image, d’uploader, sauvegarder ou supprimer les photos de profil.
 */
@Slf4j
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

    /**
     * Génère l'URL de l’image stockée sur le CDN. Cette méthode est utilisée pour simuler l’upload vers un CDN.
     *
     * @param file le fichier image à uploader
     * @return l’URL complète de l’image
     * @throws IOException si le fichier est vide
     */
    public String uploadProfilePicture(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IOException("Le fichier est vide");
        }

        return "https://cdn.meetmates.com/profiles/" + file.getOriginalFilename();
    }

    /**
     * Upload et sauvegarde la photo de profil pour un utilisateur dans la table
     * PictureUser. Si une photo existe déjà, elle est mise à jour.
     *
     * @param user l’utilisateur pour lequel la photo est uploadée
     * @param file le fichier image
     * @return l’entité PictureUser mise à jour ou créée
     */
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
                log.info("[PICTURE] Photo de profil mise à jour pour user={}", user.getEmail());
            } else {
                pictureUser = new PictureUser();
                pictureUser.setUser(user);
                pictureUser.setUrl(imageUrl);
                pictureUser.setPublicId(file.getOriginalFilename());
                pictureUser.setMain(true);
                pictureUser.setCreatedAt(LocalDateTime.now());
                log.info("Nouvelle photo de profil créée pour user={}", user.getEmail());
            }

            return pictureUserRepository.save(pictureUser);
        } catch (Exception e) {
            log.error("Erreur lors de l’upload de la photo pour user={}", user.getEmail(), e);
            throw new RuntimeException("Erreur lors de l’ajout de la photo de profil", e);
        }
    }

    /**
     * Sauvegarde l’URL de la photo de profil directement dans l’entité User.
     *
     * @param user l’utilisateur à mettre à jour
     * @param file le fichier image
     * @return l’utilisateur mis à jour
     * @throws IOException si le fichier est invalide
     */
    @Transactional
    public User saveUserProfilePicture(User user, MultipartFile file) throws IOException {
        try {
            String imageUrl = "https://cdn.meetmates.com/profiles/" + file.getOriginalFilename();
            user.setProfilePictureUrl(imageUrl);
            User saved = userRepository.save(user);
            log.info("Photo de profil sauvegardée dans User pour user={}", user.getEmail());
            return saved;
        } catch (Exception e) {
            log.error("Erreur lors de la sauvegarde de la photo dans User pour user={}", user.getEmail(), e);
            throw e;
        }
    }

    /**
     * Supprime la photo de profil de l’utilisateur. Supprime également l’entité
     * PictureUser associée si elle existe.
     *
     * @param user l’utilisateur dont la photo doit être supprimée
     */
    @Transactional
    public void deleteUserProfilePicture(User user) {
        try {
            User existingUser = userRepository.findById(user.getId())
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

            Optional<PictureUser> existingPicture = pictureUserRepository.findByUser(existingUser);
            existingPicture.ifPresent(pictureUserRepository::delete);

            existingUser.setProfilePictureUrl(null);

            userRepository.saveAndFlush(existingUser);
        } catch (Exception e) {
            log.error("Erreur lors de la suppression de la photo pour user={}", user.getEmail(), e);
            throw new RuntimeException("Erreur lors de la suppression de la photo de profil", e);
        }
    }
}
