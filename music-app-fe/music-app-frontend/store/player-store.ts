"use client";

import { create } from "zustand";

export interface Song {
  id: number;
  title: string;
  audioUrl: string;
  coverUrl: string;
  uploaderName: string;
}

interface PlayerState {
  queue: Song[];
  currentIndex: number;
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  setQueue: (songs: Song[]) => void;
  playSong: (song: Song, index: number, queue: Song[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  currentIndex: -1,
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.7,

  setQueue: (songs) => set({ queue: songs }),

  playSong: (song, index, queue) =>
    set({
      currentSong: song,
      currentIndex: index,
      queue,
      isPlaying: true,
      currentTime: 0,
      duration: 0,
    }),

  togglePlay: () => {
    const { currentSong, queue } = get();

    // Nếu chưa chọn bài nào thì bấm Play sẽ phát bài đầu tiên.
    if (!currentSong && queue.length > 0) {
      set({
        currentSong: queue[0],
        currentIndex: 0,
        isPlaying: true,
        currentTime: 0,
      });
      return;
    }

    set((state) => ({ isPlaying: !state.isPlaying }));
  },

  playNext: () => {
    const { queue, currentIndex } = get();
    if (queue.length === 0) return;

    const nextIndex = (currentIndex + 1) % queue.length;
    set({
      currentIndex: nextIndex,
      currentSong: queue[nextIndex],
      isPlaying: true,
      currentTime: 0,
      duration: 0,
    });
  },

  playPrevious: () => {
    const { queue, currentIndex } = get();
    if (queue.length === 0) return;

    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    set({
      currentIndex: prevIndex,
      currentSong: queue[prevIndex],
      isPlaying: true,
      currentTime: 0,
      duration: 0,
    });
  },

  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
}));
