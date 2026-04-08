package com.xtruong.music_app.services;

import com.xtruong.music_app.dto.response.SongResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SongService {
    List<SongResponse> getAllSongsForHome();

    SongResponse uploadSong(String title, MultipartFile audioFile, MultipartFile coverFile, Long uploaderId);

    
}
