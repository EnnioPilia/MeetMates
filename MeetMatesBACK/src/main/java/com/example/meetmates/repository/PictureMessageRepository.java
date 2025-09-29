package com.example.meetmates.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.meetmates.model.conversation.Message;
import com.example.meetmates.model.link.PictureMessage;
import com.example.meetmates.model.link.PictureMessageID;
import com.example.meetmates.model.media.Picture;

@Repository
public interface PictureMessageRepository extends JpaRepository<PictureMessage, PictureMessageID> {

    // Récupérer toutes les jointures par message
    List<PictureMessage> findByMessage(Message message);

    // Récupérer toutes les jointures par picture
    List<PictureMessage> findByPicture(Picture picture);

    // Récupérer toutes les jointures par messageId
    List<PictureMessage> findByMessage_Id(UUID messageId);

    // Récupérer toutes les jointures par pictureId
    List<PictureMessage> findByPicture_Id(UUID pictureId);
}
