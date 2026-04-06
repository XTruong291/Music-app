package com.xtruong.music_app.controllers;

import com.xtruong.music_app.dto.request.AddSongToPlaylistRequest;
import com.xtruong.music_app.dto.request.CreatePlaylistRequest;
import com.xtruong.music_app.dto.response.PlaylistDetailResponse;
import com.xtruong.music_app.dto.response.PlaylistSummaryResponse;
import com.xtruong.music_app.services.PlaylistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/playlists")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PlaylistController {

    private final PlaylistService playlistService;

    @GetMapping
    public ResponseEntity<List<PlaylistSummaryResponse>> getPlaylistsByUser(@RequestParam("userId") Long userId) {
        return ResponseEntity.ok(playlistService.getPlaylistsByUser(userId));
    }

    @PostMapping
    public ResponseEntity<PlaylistSummaryResponse> createPlaylist(@RequestBody CreatePlaylistRequest request) {
        return ResponseEntity.ok(playlistService.createPlaylist(request));
    }

    @GetMapping("/{playlistId}")
    public ResponseEntity<PlaylistDetailResponse> getPlaylistDetail(@PathVariable Long playlistId) {
        return ResponseEntity.ok(playlistService.getPlaylistDetail(playlistId));
    }

    @PostMapping("/{playlistId}/songs")
    public ResponseEntity<PlaylistDetailResponse> addSongToPlaylist(
            @PathVariable Long playlistId,
            @RequestBody AddSongToPlaylistRequest request) {
        return ResponseEntity.ok(playlistService.addSongToPlaylist(playlistId, request.getSongId()));
    }
}
