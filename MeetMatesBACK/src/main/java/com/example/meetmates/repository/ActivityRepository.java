package com.example.meetmates.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.meetmates.model.core.Activity;

public interface ActivityRepository extends JpaRepository<Activity, UUID> {
    List<Activity> findByCategory_CategoryId(UUID categoryId);
}
