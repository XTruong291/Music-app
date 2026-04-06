package com.xtruong.music_app.services.impl;

import com.xtruong.music_app.dto.response.SongResponse;
import com.xtruong.music_app.entities.Song;
import com.xtruong.music_app.entities.User;
import com.xtruong.music_app.repositories.SongRepository;
import com.xtruong.music_app.repositories.UserRepository;
import com.xtruong.music_app.services.FileUploadService;
import com.xtruong.music_app.services.SongService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SongServiceImpl implements SongService {

    private final SongRepository songRepository;
    private final FileUploadService fileUploadService;
    private final UserRepository userRepository;

    @Override
    public List<SongResponse> getAllSongsForHome() {
        List<Song> songs = songRepository.findAll();

        // Map dữ liệu từ Entity sang DTO an toàn
        return songs.stream().map(song -> SongResponse.builder()
                .id(song.getId())
                .title(song.getTitle())
                .audioUrl(song.getAudioUrl())
                .coverUrl(song.getCoverUrl())
                // Tránh lỗi NullPointerException nếu uploader bị null
                .uploaderName(song.getUploader() != null ? song.getUploader().getUsername() : "Unknown")
                .build()
        ).collect(Collectors.toList());
    }

    @Override
    public SongResponse uploadSong(String title, MultipartFile audioFile, MultipartFile coverFile, Long uploaderId) {
        try {
            User uploader = userRepository.findById(uploaderId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy User với ID: " + uploaderId));
            // 1 & 2: Dùng Cloudinary để lấy link thật


            String audioUrl = fileUploadService.uploadFile(audioFile);
            String coverUrl = null;
            if (coverFile != null && !coverFile.isEmpty()) {
                coverUrl = fileUploadService.uploadFile(coverFile);
            }

            // 3. Tạo entity Song và lưu vào Database
            Song newSong = Song.builder()
                    .title(title)
                    .audioUrl(audioUrl)
                    .coverUrl(coverUrl)
                    .duration(0)
                    .listens(0L)
                    .uploader(uploader)
                    .build();

            Song savedSong = songRepository.save(newSong);

            // 4. Trả về DTO với link xịn
            return SongResponse.builder()
                    .id(savedSong.getId())
                    .title(savedSong.getTitle())
                    .audioUrl(savedSong.getAudioUrl())
                    .coverUrl(savedSong.getCoverUrl())
                    .uploaderName("Mock User")
                    .build();

        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi upload file lên Cloudinary: " + e.getMessage());
        }
    }
}