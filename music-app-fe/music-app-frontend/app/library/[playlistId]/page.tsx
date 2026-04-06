"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ArrowLeft, Play, PlusCircle } from "lucide-react";
import { Song, usePlayerStore } from "@/store/player-store";
import {
  addSongToPlaylistApi,
  fetchPlaylistDetail,
  PlaylistDetail,
} from "@/lib/playlist-api";

const API_BASE_URL = "http://localhost:8089/api/songs";

interface PlaylistDetailPageProps {
  params: Promise<{ playlistId: string }>;
}

export default function PlaylistDetailPage({ params }: PlaylistDetailPageProps) {
  const [playlistId, setPlaylistId] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlistDetail, setPlaylistDetail] = useState<PlaylistDetail | null>(null);
  const [message, setMessage] = useState("");

  const { playSong, setQueue } = usePlayerStore();

  useEffect(() => {
    params.then((value) => setPlaylistId(value.playlistId));
  }, [params]);

  useEffect(() => {
    axios
      .get<Song[]>(API_BASE_URL)
      .then((response) => {
        setSongs(response.data);
        setQueue(response.data);
      })
      .catch((error) => {
        console.error("Loi tai bai hat:", error);
      });
  }, [setQueue]);

  useEffect(() => {
    if (!playlistId) return;

    fetchPlaylistDetail(Number(playlistId))
      .then((data) => setPlaylistDetail(data))
      .catch((error) => {
        console.error("Loi tai chi tiet playlist:", error);
        setPlaylistDetail(null);
      });
  }, [playlistId]);

  const selectedPlaylist = playlistDetail;

  const playlistSongs = useMemo(() => {
    if (!selectedPlaylist) return [];
    return selectedPlaylist.songs;
  }, [selectedPlaylist]);

  const songsOutsidePlaylist = useMemo(() => {
    if (!selectedPlaylist) return [];
    const inPlaylistIds = new Set(selectedPlaylist.songs.map((song) => song.id));
    return songs.filter((song) => !inPlaylistIds.has(song.id));
  }, [selectedPlaylist, songs]);

  const playlistCover =
    playlistSongs[0]?.coverUrl || "https://placehold.co/240x240/333/FFF?text=Playlist";

  const handleAddSong = (song: Song) => {
    if (!selectedPlaylist) return;
    addSongToPlaylistApi(selectedPlaylist.id, song.id)
      .then((data) => {
        setPlaylistDetail(data);
        setMessage(`Da them "${song.title}" vao playlist.`);
      })
      .catch((error) => {
        console.error("Loi them bai vao playlist:", error);
        setMessage("Khong the them bai hat vao playlist. Vui long thu lai.");
      });
  };

  if (!selectedPlaylist) {
    return (
      <div className="text-white p-4 md:p-6">
        <p className="text-neutral-300">Khong tim thay playlist.</p>
        <Link href="/library" className="inline-block mt-3 text-green-400 hover:underline">
          Quay lai Thu vien
        </Link>
      </div>
    );
  }

  return (
    <div className="text-white p-4 md:p-6 pb-32 space-y-6">
      <Link
        href="/library"
        className="inline-flex items-center gap-2 text-sm text-neutral-300 hover:text-white"
      >
        <ArrowLeft size={16} />
        Quay lai Thu vien
      </Link>

      <section className="rounded-xl p-4 md:p-6 bg-gradient-to-b from-emerald-800/50 via-neutral-900 to-neutral-950 border border-neutral-800">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <img
            src={playlistCover}
            alt={selectedPlaylist.title}
            className="w-36 h-36 md:w-44 md:h-44 object-cover rounded-md shadow-2xl"
          />
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-300">Playlist</p>
            <h2 className="text-3xl md:text-5xl font-bold mt-1">{selectedPlaylist.title}</h2>
            <p className="text-sm text-neutral-300 mt-2">
              {playlistSongs.length} bài hát
            </p>
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 md:p-5">
        <h3 className="font-semibold text-lg mb-3">Danh sách bài hát</h3>
        {playlistSongs.length > 0 ? (
          <div className="space-y-2">
            {playlistSongs.map((song, idx) => (
              <button
                key={song.id}
                type="button"
                onClick={() => playSong(song, songs.findIndex((s) => s.id === song.id), songs)}
                className="w-full flex items-center justify-between gap-3 p-3 rounded-md bg-neutral-900 hover:bg-neutral-800 text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-neutral-400 text-sm w-6">{idx + 1}</span>
                  <img
                    src={song.coverUrl || "https://placehold.co/48x48/333/FFF?text=No"}
                    alt={song.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{song.title}</p>
                    <p className="truncate text-xs text-neutral-400">{song.uploaderName}</p>
                  </div>
                </div>
                <Play size={16} className="text-neutral-300 shrink-0" />
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-400">Playlist nay chua co bai hat nao.</p>
        )}
      </section>

      <section className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 md:p-5">
        <h3 className="font-semibold text-lg mb-3">Them nhac tu Home</h3>
        {songsOutsidePlaylist.length > 0 ? (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {songsOutsidePlaylist.map((song) => (
              <div
                key={song.id}
                className="flex items-center justify-between gap-3 p-3 rounded-md bg-neutral-900"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{song.title}</p>
                  <p className="truncate text-xs text-neutral-400">{song.uploaderName}</p>
                </div>
                <button
                  onClick={() => handleAddSong(song)}
                  type="button"
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-green-500 text-black text-sm font-semibold hover:bg-green-400"
                >
                  <PlusCircle size={16} />
                  Them
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-400">Tat ca bai hat da nam trong playlist nay.</p>
        )}
      </section>

      {message && (
        <p className="text-sm text-green-300 bg-green-950/40 border border-green-800 rounded-md px-3 py-2">
          {message}
        </p>
      )}
    </div>
  );
}
