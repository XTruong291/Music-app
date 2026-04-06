package com.xtruong.music_app.services;

import com.xtruong.music_app.dto.request.CreatePlaylistRequest;
import com.xtruong.music_app.dto.response.PlaylistDetailResponse;
import com.xtruong.music_app.dto.response.PlaylistSummaryResponse;

import java.util.List;

public interface PlaylistService {
    List<PlaylistSummaryResponse> getPlaylistsByUser(Long userId);
    PlaylistSummaryResponse createPlaylist(CreatePlaylistRequest request);
    PlaylistDetailResponse getPlaylistDetail(Long playlistId);
    PlaylistDetailResponse addSongToPlaylist(Long playlistId, Long songId);
}
