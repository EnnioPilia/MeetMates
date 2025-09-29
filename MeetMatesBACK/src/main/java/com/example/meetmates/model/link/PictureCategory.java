package com.example.meetmates.model.link;

import com.example.meetmates.model.core.Category;
import com.example.meetmates.model.media.Picture;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

@Entity
@Table(name = "picture_category")
public class PictureCategory {

    @EmbeddedId
    private PictureCategoryID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("pictureId")
    @JoinColumn(name = "picture_id")
    private Picture picture;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("categoryId")
    @JoinColumn(name = "category_id")
    private Category category;

    // Getters & Setters
    public PictureCategoryID getId() { return id; }
    public void setId(PictureCategoryID id) { this.id = id; }
    public Picture getPicture() { return picture; }
    public void setPicture(Picture picture) { this.picture = picture; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
}
