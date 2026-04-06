package com.xtruong.music_app.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PlaylistSummaryResponse {
    private Long id;
    private String title;
    private String coverUrl;
    private Long userId;
    private Integer songCount;
}
