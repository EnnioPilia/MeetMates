package com.example.meetmates.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.meetmates.model.core.User;
import com.example.meetmates.model.link.PictureUser;
import com.example.meetmates.model.link.PictureUserID;
import com.example.meetmates.model.media.Picture;

@Repository
public interface PictureUserRepository extends JpaRepository<PictureUser, PictureUserID> {

    // Récupérer toutes les jointures par user
    List<PictureUser> findByUser(User user);

    // Récupérer toutes les jointures par picture
    List<PictureUser> findByPicture(Picture picture);

    // Récupérer toutes les jointures par userId
    List<PictureUser> findByUser_Id(UUID userId);

    // Récupérer toutes les jointures par pictureId
    List<PictureUser> findByPicture_Id(UUID pictureId);
}
