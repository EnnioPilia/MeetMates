package com.example.meetmates.common.service;

import java.util.ArrayList;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;

import com.example.meetmates.common.exception.ApiException;
import com.example.meetmates.common.exception.ErrorCode;
import com.example.meetmates.user.model.PictureUser;
import com.example.meetmates.user.model.User;
import com.example.meetmates.user.repository.PictureUserRepository;

class PictureServiceTest {

    @Mock
    private PictureUserRepository pictureUserRepository;

    @InjectMocks
    private PictureService pictureService;

    private User user;
    private MultipartFile validFile;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setEmail("test@mail.com");
        user.setPictures(new ArrayList<>());

        validFile = mock(MultipartFile.class);
        when(validFile.isEmpty()).thenReturn(false);
        when(validFile.getSize()).thenReturn(1024L);
        when(validFile.getContentType()).thenReturn("image/jpeg");
    }

    @Test
    void should_upload_profile_picture_successfully() {
        // Simule qu'il n'y a pas de photo principale existante
        when(pictureUserRepository.findByUserAndMainTrue(user)).thenReturn(Optional.empty());

        String imageUrl = pictureService.updateProfilePicture(user, validFile);

        assertThat(imageUrl).startsWith("https://cdn.meetmates.com/profiles/");
        assertThat(user.getPictures()).hasSize(1);
        assertThat(user.getPictures().get(0).isMain()).isTrue();

        verify(pictureUserRepository).save(any(PictureUser.class));
    }

    @Test
    void should_disable_old_main_picture_when_uploading_new() {
        PictureUser oldPicture = new PictureUser();
        oldPicture.setMain(true);

        when(pictureUserRepository.findByUserAndMainTrue(user)).thenReturn(Optional.of(oldPicture));

        pictureService.updateProfilePicture(user, validFile);

        assertThat(oldPicture.isMain()).isFalse();
        assertThat(oldPicture.getUpdatedAt()).isNotNull();
    }

    @Test
    void should_throw_if_file_is_empty() {
        when(validFile.isEmpty()).thenReturn(true);

        assertThatThrownBy(() -> pictureService.updateProfilePicture(user, validFile))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.INVALID_FILE);
    }

    @Test
    void should_throw_if_file_is_too_large() {
        when(validFile.getSize()).thenReturn(5 * 1024 * 1024L);

        assertThatThrownBy(() -> pictureService.updateProfilePicture(user, validFile))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.FILE_TOO_LARGE);
    }

    @Test
    void should_throw_if_file_type_is_invalid() {
        when(validFile.getContentType()).thenReturn("application/pdf");

        assertThatThrownBy(() -> pictureService.updateProfilePicture(user, validFile))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.INVALID_FILE_TYPE);
    }

    @Test
    void should_soft_delete_profile_picture() {
        PictureUser picture = new PictureUser();
        picture.setMain(true);

        when(pictureUserRepository.findByUserAndMainTrue(user)).thenReturn(Optional.of(picture));

        pictureService.deleteProfilePicture(user);

        assertThat(picture.isMain()).isFalse();
        assertThat(picture.getDeletedAt()).isNotNull();
        assertThat(picture.getUpdatedAt()).isNotNull();
    }

    @Test
    void should_do_nothing_if_no_main_picture_on_delete() {
        when(pictureUserRepository.findByUserAndMainTrue(user)).thenReturn(Optional.empty());

        pictureService.deleteProfilePicture(user);

        verify(pictureUserRepository, never()).save(any());
    }
}
