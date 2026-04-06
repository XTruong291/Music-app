import axios from "axios";
import { Song } from "@/store/player-store";

const PLAYLIST_API_BASE_URL = "http://localhost:8089/api/playlists";

export interface PlaylistSummary {
  id: number;
  title: string;
  coverUrl: string | null;
  userId: number;
  songCount: number;
}

export interface PlaylistDetail {
  id: number;
  title: string;
  coverUrl: string | null;
  userId: number;
  createdAt: string;
  songs: Song[];
}

export async function fetchPlaylistsByUser(userId: number) {
  const response = await axios.get<PlaylistSummary[]>(PLAYLIST_API_BASE_URL, {
    params: { userId },
  });
  return response.data;
}

export async function createPlaylistApi(payload: {
  title: string;
  userId: number;
  coverUrl?: string;
}) {
  const response = await axios.post<PlaylistSummary>(PLAYLIST_API_BASE_URL, payload);
  return response.data;
}

export async function fetchPlaylistDetail(playlistId: number) {
  const response = await axios.get<PlaylistDetail>(`${PLAYLIST_API_BASE_URL}/${playlistId}`);
  return response.data;
}

export async function addSongToPlaylistApi(playlistId: number, songId: number) {
  const response = await axios.post<PlaylistDetail>(`${PLAYLIST_API_BASE_URL}/${playlistId}/songs`, {
    songId,
  });
  return response.data;
}
