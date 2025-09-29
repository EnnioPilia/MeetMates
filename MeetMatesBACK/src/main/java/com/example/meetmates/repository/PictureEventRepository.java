package com.example.meetmates.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.meetmates.model.core.Event;
import com.example.meetmates.model.link.PictureEvent;
import com.example.meetmates.model.link.PictureEventID;

public interface PictureEventRepository extends JpaRepository<PictureEvent, PictureEventID> {

    @Query("SELECT pe.picture FROM PictureEvent pe WHERE pe.event = :event")
    List<com.example.meetmates.model.media.Picture> findPicturesByEvent(@Param("event") Event event);

    @Modifying
    @Query("DELETE FROM PictureEvent pe WHERE pe.event = :event")
    void deleteByEvent(@Param("event") Event event);
}
