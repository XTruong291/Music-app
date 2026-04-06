// components/shared/MusicPlayer.tsx
"use client";

import { MouseEvent, useEffect, useMemo, useRef } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { usePlayerStore } from "@/store/player-store";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    playNext,
    playPrevious,
    setCurrentTime,
    setDuration,
    setVolume,
  } = usePlayerStore();
  const lastSongUrlRef = useRef<string | null>(null);

  // Chỉ đổi source khi thực sự đổi bài, tránh restart khi chỉ pause/resume.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong?.audioUrl) return;
    if (lastSongUrlRef.current === currentSong.audioUrl) return;

    lastSongUrlRef.current = currentSong.audioUrl;
    audio.src = currentSong.audioUrl;
    audio.load();
    audio.play().catch((error) => {
      console.error("Không thể tự phát audio:", error);
    });
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((error) => {
        console.error("Không thể phát audio:", error);
      });
      return;
    }

    audio.pause();
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  const progressPercent = useMemo(() => {
    if (!duration) return 0;
    return Math.min((currentTime / duration) * 100, 100);
  }, [currentTime, duration]);

  const seekAudio = (event: MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const nextTime = (clickX / rect.width) * duration;

    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  return (
    <div className="w-full h-full bg-black border-t border-neutral-800 flex items-center justify-between px-2 md:px-4">
      <audio
        ref={audioRef}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onEnded={playNext}
      />

      {/* CỘT TRÁI: Thông tin bài hát đang phát */}
      <div className="flex items-center gap-4 w-full md:w-[30%]">
        <img
          src={
            currentSong?.coverUrl ||
            "https://placehold.co/56x56/333/FFF?text=Cover"
          }
          alt={currentSong?.title || "Song Cover"}
          className="w-14 h-14 rounded-md object-cover shadow-md"
        />
        <div className="hidden md:block">
          <h4 className="text-white text-sm font-semibold hover:underline cursor-pointer truncate max-w-[200px]">
            {currentSong?.title || "Chưa có bài hát nào"}
          </h4>
          <p className="text-neutral-400 text-xs hover:underline cursor-pointer truncate max-w-[200px] mt-1">
            {currentSong?.uploaderName || "Ca sĩ bí ẩn"}
          </p>
        </div>
      </div>

      {/* CỘT GIỮA: Bộ điều khiển (Play, Next, Progress Bar) */}
      <div className="flex flex-col items-center justify-center w-full md:w-[40%] max-w-[722px] gap-2">
        {/* Hàng nút bấm */}
        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={playPrevious}
            className="text-neutral-400 hover:text-white transition"
            type="button"
          >
            <SkipBack size={24} fill="currentColor" />
          </button>

          {/* Nút Play/Pause có nền trắng */}
          <button
            onClick={togglePlay}
            className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition"
            type="button"
          >
            {isPlaying ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <Play size={18} fill="currentColor" className="ml-1" />
            )}
          </button>

          <button
            onClick={playNext}
            className="text-neutral-400 hover:text-white transition"
            type="button"
          >
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>

        {/* Thanh tiến trình (Progress Bar) */}
        <div className="hidden md:flex w-full items-center gap-2 text-xs text-neutral-400">
          <span>{formatTime(currentTime)}</span>

          <div
            className="flex-1 h-1 bg-neutral-600 rounded-full flex items-center group cursor-pointer"
            onClick={seekAudio}
          >
            <div
              className="bg-white h-full rounded-full group-hover:bg-green-500 relative"
              style={{ width: `${progressPercent}%` }}
            >
              {/* Cục tròn nhỏ hiện ra khi hover */}
              <div className="hidden group-hover:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-md"></div>
            </div>
          </div>

          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* CỘT PHẢI: Thanh điều chỉnh âm lượng */}
      <div className="hidden md:flex items-center justify-end w-[30%] gap-3 text-neutral-400">
        <Volume2 size={20} className="hover:text-white" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          className="w-24 accent-white cursor-pointer"
        />
      </div>
    </div>
  );
}
