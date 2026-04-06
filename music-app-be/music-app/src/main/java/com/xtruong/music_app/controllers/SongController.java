package com.xtruong.music_app.controllers;

import com.xtruong.music_app.dto.response.SongResponse;
import com.xtruong.music_app.services.SongService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/songs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SongController {

    private final SongService songService;

    @GetMapping
    public ResponseEntity<List<SongResponse>> getHomeSongs() {
        return ResponseEntity.ok(songService.getAllSongsForHome());
    }

    @PostMapping("/upload")
    public ResponseEntity<SongResponse> uploadSong(
            @RequestParam("title") String title,
            @RequestParam("audio") MultipartFile audioFile,
            @RequestParam(value = "cover", required = false) MultipartFile coverFile,
            @RequestParam("uploaderId") Long uploaderId) { // Sau này uploaderId sẽ lấy tự động từ JWT token

        SongResponse response = songService.uploadSong(title, audioFile, coverFile, uploaderId);
        return ResponseEntity.ok(response);
    }
}