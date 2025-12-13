package com.example.meetmates.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.meetmates.exception.ApiException;
import com.example.meetmates.exception.ErrorCode;
import com.example.meetmates.model.PictureUser;
import com.example.meetmates.model.User;
import com.example.meetmates.repository.PictureUserRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Service pour la gestion des photos de profil des utilisateurs.
 *
 * Ce service permet de : -valider les fichiers image uploadés -créer ou mettre
 * à jour la photo de profil principale -supprimer la photo de profil existante
 * (soft delete)
 *
 * Les images sont simulées comme étant stockées sur un CDN externe.
 */
@Slf4j
@Service
public class PictureService {

    private static final long MAX_FILE_SIZE = 2 * 1024 * 1024;

    private static final List<String> ALLOWED_MIME_TYPES = List.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    private final PictureUserRepository pictureUserRepository;

    public PictureService(PictureUserRepository pictureUserRepository) {
        this.pictureUserRepository = pictureUserRepository;
    }

    /**
     * Upload et définit une nouvelle photo de profil principale pour un
     * utilisateur.
     *
     * Si une photo principale existe déjà, celle-ci est désactivée (main =
     * false) et conservée dans l’historique.
     *
     * Une nouvelle entité {@link PictureUser} est créée et marquée comme photo
     * principale (main = true).
     *
     * @param user l’utilisateur concerné
     * @param file le fichier image à uploader
     * @return l’URL publique de la nouvelle photo de profil
     * @throws ApiException si le fichier est invalide (taille ou type)
     */
    @Transactional
    public String updateProfilePicture(User user, MultipartFile file) {

        validateFile(file);

        pictureUserRepository.findByUserAndMainTrue(user)
                .ifPresent(old -> {
                    old.setMain(false);
                    old.setUpdatedAt(LocalDateTime.now());
                });

        String publicId = UUID.randomUUID().toString();
        String imageUrl = "https://cdn.meetmates.com/profiles/" + publicId;

        PictureUser picture = new PictureUser();
        picture.setUser(user);
        picture.setUrl(imageUrl);
        picture.setPublicId(publicId);
        picture.setMain(true);
        picture.setCreatedAt(LocalDateTime.now());
        user.getPictures().add(picture);

        pictureUserRepository.save(picture);

        return imageUrl;
    }

    /**
     * Supprime la photo de profil principale de l’utilisateur via un soft delete.
     * 
     * La photo n’est pas supprimée physiquement en base de données : elle est
     * marquée comme supprimée ({@code deletedAt}) et désactivée
     * ({@code main = false}).
     *
     * @param user l’utilisateur concerné
     */
    @Transactional
    public void deleteProfilePicture(User user) {

        pictureUserRepository.findByUserAndMainTrue(user)
                .ifPresent(picture -> {
                    picture.setMain(false);
                    picture.setDeletedAt(LocalDateTime.now());
                    picture.setUpdatedAt(LocalDateTime.now());
                });

        log.info("[PICTURE] Photo de profil supprimée (soft) pour user={}", user.getEmail());
    }

    private void validateFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new ApiException(ErrorCode.INVALID_FILE);
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ApiException(ErrorCode.FILE_TOO_LARGE);
        }

        if (!ALLOWED_MIME_TYPES.contains(file.getContentType())) {
            throw new ApiException(ErrorCode.INVALID_FILE_TYPE);
        }
    }
}
