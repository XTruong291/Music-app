package com.xtruong.music_app.services.impl;

import com.xtruong.music_app.dto.request.CreatePlaylistRequest;
import com.xtruong.music_app.dto.response.PlaylistDetailResponse;
import com.xtruong.music_app.dto.response.PlaylistSummaryResponse;
import com.xtruong.music_app.dto.response.SongResponse;
import com.xtruong.music_app.entities.Playlist;
import com.xtruong.music_app.entities.Song;
import com.xtruong.music_app.entities.User;
import com.xtruong.music_app.repositories.PlaylistRepository;
import com.xtruong.music_app.repositories.SongRepository;
import com.xtruong.music_app.repositories.UserRepository;
import com.xtruong.music_app.services.PlaylistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlaylistServiceImpl implements PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final UserRepository userRepository;
    private final SongRepository songRepository;

    @Override
    public List<PlaylistSummaryResponse> getPlaylistsByUser(Long userId) {
        return playlistRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toSummaryResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PlaylistSummaryResponse createPlaylist(CreatePlaylistRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Khong tim thay user: " + request.getUserId()));

        Playlist playlist = Playlist.builder()
                .title(request.getTitle())
                .coverUrl(request.getCoverUrl())
                .user(user)
                .songs(new ArrayList<>())
                .build();

        Playlist saved = playlistRepository.save(playlist);
        return toSummaryResponse(saved);
    }

    @Override
    public PlaylistDetailResponse getPlaylistDetail(Long playlistId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Khong tim thay playlist: " + playlistId));

        return toDetailResponse(playlist);
    }

    @Override
    public PlaylistDetailResponse addSongToPlaylist(Long playlistId, Long songId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Khong tim thay playlist: " + playlistId));
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Khong tim thay bai hat: " + songId));

        boolean alreadyInPlaylist = playlist.getSongs().stream()
                .anyMatch(item -> item.getId().equals(songId));
        if (!alreadyInPlaylist) {
            playlist.getSongs().add(song);
        }

        Playlist saved = playlistRepository.save(playlist);
        return toDetailResponse(saved);
    }

    private PlaylistSummaryResponse toSummaryResponse(Playlist playlist) {
        List<Song> playlistSongs = playlist.getSongs() != null ? playlist.getSongs() : List.of();
        String previewCoverUrl = playlistSongs.isEmpty()
                ? playlist.getCoverUrl()
                : playlistSongs.get(0).getCoverUrl();

        return PlaylistSummaryResponse.builder()
                .id(playlist.getId())
                .title(playlist.getTitle())
                .coverUrl(previewCoverUrl)
                .userId(playlist.getUser().getId())
                .songCount(playlistSongs.size())
                .build();
    }

    private PlaylistDetailResponse toDetailResponse(Playlist playlist) {
        List<Song> playlistSongs = playlist.getSongs() != null ? playlist.getSongs() : List.of();

        List<SongResponse> songs = playlistSongs.stream()
                .map(song -> SongResponse.builder()
                        .id(song.getId())
                        .title(song.getTitle())
                        .audioUrl(song.getAudioUrl())
                        .coverUrl(song.getCoverUrl())
                        .uploaderName(song.getUploader() != null ? song.getUploader().getUsername() : "Unknown")
                        .build())
                .collect(Collectors.toList());

        return PlaylistDetailResponse.builder()
                .id(playlist.getId())
                .title(playlist.getTitle())
                .coverUrl(playlist.getCoverUrl())
                .userId(playlist.getUser().getId())
                .createdAt(playlist.getCreatedAt())
                .songs(songs)
                .build();
    }
}
