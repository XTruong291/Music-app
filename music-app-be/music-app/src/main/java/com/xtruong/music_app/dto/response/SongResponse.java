package com.xtruong.music_app.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SongResponse {
    private Long id;
    private String title;
    private String audioUrl;
    private String coverUrl;
    private String uploaderName; // Chỉ lấy tên người up, không lấy toàn bộ thông tin User
}
