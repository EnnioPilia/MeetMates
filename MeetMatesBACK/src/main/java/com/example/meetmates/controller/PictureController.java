package com.example.meetmates.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.meetmates.model.media.Picture;
import com.example.meetmates.service.PictureService;

@RestController
@RequestMapping("/picture")
public class PictureController {

    private final PictureService pictureService;

    public PictureController(PictureService pictureService) {
        this.pictureService = pictureService;
    }

    @PostMapping
    public Picture createPicture(@RequestBody Picture picture) {
        return pictureService.save(picture);
    }

    @GetMapping
    public List<Picture> getAllPictures() {
        return pictureService.getAll();
    }

    @DeleteMapping("/{id}")
    public void deletePicture(@PathVariable UUID id) {
        pictureService.delete(id);
    }
}
