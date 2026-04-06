package com.xtruong.music_app.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "songs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Song {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String audioUrl; // Đường dẫn file .mp3 (sau này lưu trên Cloud)

    private String coverUrl; // Ảnh bìa bài hát

    private Integer duration; // Thời lượng bài hát (tính bằng giây)

    @Column(columnDefinition = "bigint default 0")
    private Long listens; // Số lượt nghe

    // Quan hệ N-1: Nhiều bài hát do 1 User upload
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploader_id", nullable = false)
    private User uploader;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime uploadedAt;

    // Quan hệ N-N: Bài hát này nằm trong những Playlist nào
    @ManyToMany(mappedBy = "songs")
    private List<Playlist> playlists = new ArrayList<>();
}
