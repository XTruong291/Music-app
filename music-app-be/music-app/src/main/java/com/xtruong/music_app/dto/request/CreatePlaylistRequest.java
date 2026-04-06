package com.xtruong.music_app.dto.request;

import lombok.Data;

@Data
public class CreatePlaylistRequest {
    private String title;
    private Long userId;
    private String coverUrl;
}
