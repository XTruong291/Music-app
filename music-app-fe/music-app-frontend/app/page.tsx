"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Ellipsis, Play } from "lucide-react";
import { Song, usePlayerStore } from "@/store/player-store";
import {
  addSongToPlaylistApi,
  fetchPlaylistsByUser,
  PlaylistSummary,
} from "@/lib/playlist-api";

const API_BASE_URL = "http://localhost:8089/api/songs";
const DEFAULT_USER_ID = 1;

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoadingSongs, setIsLoadingSongs] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [playlists, setPlaylists] = useState<PlaylistSummary[]>([]);
  const [openMenuSongId, setOpenMenuSongId] = useState<number | null>(null);

  const { playSong, setQueue, currentSong, isPlaying } = usePlayerStore();

  const fetchSongs = useCallback(async () => {
    setIsLoadingSongs(true);
    setErrorMessage("");

    try {
      const response = await axios.get<Song[]>(API_BASE_URL);
      setSongs(response.data);
      setQueue(response.data);
    } catch (error) {
      console.error("Loi keo du lieu nhac:", error);
      setErrorMessage("Khong tai duoc danh sach bai hat. Hay thu lai.");
    } finally {
      setIsLoadingSongs(false);
    }
  }, [setQueue]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  useEffect(() => {
    fetchPlaylistsByUser(DEFAULT_USER_ID)
      .then((data) => setPlaylists(data))
      .catch((error) => {
        console.error("Loi tai playlists:", error);
      });
  }, []);

  const handleAddToPlaylist = async (song: Song, playlistId: number) => {
    try {
      const playlistDetail = await addSongToPlaylistApi(playlistId, song.id);
      setActionMessage(`Da luu vao playlist "${playlistDetail.title}".`);
      setOpenMenuSongId(null);
      const latestPlaylists = await fetchPlaylistsByUser(DEFAULT_USER_ID);
      setPlaylists(latestPlaylists);
    } catch (error) {
      console.error("Loi luu bai vao playlist:", error);
      setActionMessage("Khong the luu bai hat vao playlist. Vui long thu lai.");
    }
  };

  return (
    <div className="pb-28 p-4 md:p-6 space-y-6">
      <h2 className="text-3xl font-bold text-white">Bai hat moi nhat</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {isLoadingSongs &&
          Array.from({ length: 10 }).map((_, index) => (
            <div
              key={`loading-${index}`}
              className="bg-neutral-900 p-4 rounded-lg animate-pulse"
            >
              <div className="w-full aspect-square bg-neutral-800 rounded-md mb-4" />
              <div className="h-4 bg-neutral-800 rounded mb-2" />
              <div className="h-3 bg-neutral-800 rounded w-2/3" />
            </div>
          ))}

        {songs.map((song, index) => (
          <div
            key={song.id}
            className="bg-neutral-900 p-4 rounded-lg hover:bg-neutral-800 transition duration-300 group cursor-pointer border border-transparent hover:border-neutral-700"
            onClick={() => playSong(song, index, songs)}
          >
            <div className="relative mb-4">
              <img
                src={
                  song.coverUrl ||
                  "https://placehold.co/300x300/333/FFF?text=No+Cover"
                }
                alt={song.title}
                className="w-full aspect-square object-cover rounded-md shadow-lg"
              />

              <button
                onClick={(event) => {
                  event.stopPropagation();
                  playSong(song, index, songs);
                }}
                className="absolute bottom-2 right-2 bg-green-500 rounded-full p-3 text-black opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:scale-105 hover:bg-green-400"
                type="button"
              >
                <Play fill="currentColor" size={24} />
              </button>

              <button
                onClick={(event) => {
                  event.stopPropagation();
                  setOpenMenuSongId((current) => (current === song.id ? null : song.id));
                }}
                className="absolute top-2 right-2 bg-black/60 rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition"
                type="button"
              >
                <Ellipsis size={18} />
              </button>

              {openMenuSongId === song.id && (
                <div
                  className="absolute top-12 right-2 w-56 rounded-md border border-neutral-700 bg-neutral-950 shadow-xl p-2 z-20"
                  onClick={(event) => event.stopPropagation()}
                >
                  <p className="text-xs text-neutral-400 px-2 py-1">Luu vao playlist</p>
                  {playlists.length > 0 ? (
                    <div className="max-h-40 overflow-y-auto">
                      {playlists.map((playlist) => (
                        <button
                          key={playlist.id}
                          onClick={() => handleAddToPlaylist(song, playlist.id)}
                          className="w-full text-left px-2 py-2 rounded text-sm text-neutral-200 hover:bg-neutral-800"
                          type="button"
                        >
                          {playlist.title}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-2 py-2">
                      <p className="text-sm text-neutral-300">
                        Chua co playlist. Hay qua Thu vien de tao playlist moi.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <h3 className="font-semibold text-white truncate text-base">
              {song.title}
            </h3>
            {currentSong?.id === song.id && (
              <p className="text-xs text-green-400 mt-1">
                {isPlaying ? "Đang phát..." : "Đã chọn"}
              </p>
            )}
            <p className="text-sm text-neutral-400 truncate mt-1">
              {song.uploaderName}
            </p>
          </div>
        ))}

        {!isLoadingSongs && songs.length === 0 && (
          <p className="text-neutral-500 col-span-full">
            He thong chua co bai hat nao. Bam nut Them nhac ben duoi de bat dau.
          </p>
        )}
      </div>

      {errorMessage && (
        <p className="text-sm text-red-400 bg-red-950/40 border border-red-800 rounded-md px-3 py-2">
          {errorMessage}
        </p>
      )}
      {actionMessage && (
        <p className="text-sm text-green-300 bg-green-950/40 border border-green-800 rounded-md px-3 py-2">
          {actionMessage}
        </p>
      )}
    </div>
  );
}
