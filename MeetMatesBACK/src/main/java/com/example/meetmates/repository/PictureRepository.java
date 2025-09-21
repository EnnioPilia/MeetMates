package com.example.meetmates.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.meetmates.model.Event;
import com.example.meetmates.model.Picture;
import com.example.meetmates.model.User;

@Repository
public interface PictureRepository extends JpaRepository<Picture, UUID> {

    // Récupérer toutes les photos d’un événement
    List<Picture> findByEvent(Event event);

    // Récupérer toutes les photos d’un utilisateur
    List<Picture> findByUser(User user);

    // Récupérer les photos d’un utilisateur pour un type spécifique (PROFILE ou EVENT)
    List<Picture> findByUserAndType(User user, Picture.PictureType type);

    // Supprimer toutes les photos d’un utilisateur
    void deleteByUser(User user);

    // Supprimer toutes les photos d’un événement
    void deleteByEvent(Event event);
}
