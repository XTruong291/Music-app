package com.xtruong.music_app.repositories;

import com.xtruong.music_app.entities.Playlist;
import com.xtruong.music_app.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {


    List<Playlist> findByUser_Username(String username);


}
