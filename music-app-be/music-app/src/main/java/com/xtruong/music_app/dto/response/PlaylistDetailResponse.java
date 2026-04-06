package com.xtruong.music_app.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PlaylistDetailResponse {
    private Long id;
    private String title;
    private String coverUrl;
    private Long userId;
    private LocalDateTime createdAt;
    private List<SongResponse> songs;
}
