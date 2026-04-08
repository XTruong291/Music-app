"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ListMusic, ListPlus, Play, UploadCloud, X } from "lucide-react";
import { createPlaylistApi, fetchPlaylistsByUser, PlaylistSummary } from "@/lib/playlist-api";
import { useEffect } from "react";

const DEFAULT_USER_ID = 1;

export default function LibraryPage() {
  const [playlists, setPlaylists] = useState<PlaylistSummary[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(true);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadPlaylists = async () => {
    setIsLoadingPlaylists(true);
    try {
      const data = await fetchPlaylistsByUser(DEFAULT_USER_ID);
      setPlaylists(data);
      setErrorMessage("");
    } catch (error) {
      console.error("Loi tai playlists:", error);
      setErrorMessage("Khong tai duoc playlists.");
    } finally {
      setIsLoadingPlaylists(false);
    }
  };

  useEffect(() => {
    loadPlaylists();
  }, []);

  const handleCreatePlaylist = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      const created = await createPlaylistApi({
        title: newPlaylistName.trim(),
        userId: DEFAULT_USER_ID,
      });
      await loadPlaylists();
      setMessage(`Da tao playlist "${created.title}".`);
    } catch (error) {
      console.error("Loi tao playlist:", error);
      setErrorMessage("Khong tao duoc playlist. Vui long thu lai.");
    }

    setNewPlaylistName("");
    setIsCreateModalOpen(false);
  };
 
 
  return (
    <div className="text-white p-4 md:p-6 pb-32 space-y-6">
      <h1 className="text-3xl font-bold">Thu vien cua ban</h1>

      <section className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 md:p-5">
        <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <ListMusic size={18} />
          Danh sach playlist
        </h2>

        {isLoadingPlaylists ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`playlist-skeleton-${index}`}
                className="flex items-center gap-3 px-3 py-2 rounded-lg border bg-neutral-900 border-neutral-800 animate-pulse"
              >
                <div className="w-14 h-14 rounded-md bg-neutral-800 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="h-4 w-1/2 rounded bg-neutral-800" />
                  <div className="h-3 w-1/3 rounded bg-neutral-800 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : playlists.length > 0 ? (
          <div className="space-y-2">
            {playlists.map((playlist) => (
              <Link
                key={playlist.id}
                href={`/library/${playlist.id}`}
                className="group flex items-center gap-3 px-3 py-2 rounded-lg border transition bg-neutral-900 text-white border-neutral-700 hover:border-green-500/70 hover:bg-neutral-800"
              >
                <div className="relative w-14 h-14 shrink-0">
                  <img
                    src={playlist.coverUrl || "https://placehold.co/56x56/333/FFF?text=PL"}
                    alt={playlist.title}
                    className="w-14 h-14 rounded-md object-cover"
                  />
                  <div className="absolute inset-0 rounded-md bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <Play size={16} className="text-white" fill="currentColor" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{playlist.title}</p>
                  <p className="text-xs text-neutral-400 mt-1">{playlist.songCount} bai hat</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-neutral-400 text-sm">
            Ban chua co playlist nao. Hay bam nut Tao de tao playlist dau tien.
          </p>
        )}
      </section>

      {message && (
        <p className="text-sm text-green-300 bg-green-950/40 border border-green-800 rounded-md px-3 py-2">
          {message}
        </p>
      )}
      {errorMessage && (
        <p className="text-sm text-red-300 bg-red-950/40 border border-red-800 rounded-md px-3 py-2">
          {errorMessage}
        </p>
      )}

      <div className="fixed bottom-28 left-0 right-0 px-4 md:px-6">
        <div className="max-w-[1024px] mx-auto flex items-center justify-between bg-neutral-950 border border-neutral-800 rounded-xl p-3">
          <button
            onClick={() => {
              setIsCreateModalOpen(true);
              setMessage("");
            }}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-800 hover:bg-neutral-700"
          >
            <ListPlus size={18} />
            Them playlist
          </button>

          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-green-500 text-black font-semibold hover:bg-green-400"
          >
            <UploadCloud size={18} />
            Upload nhac
          </Link>
        </div>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-neutral-950 border border-neutral-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Tao playlist moi</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                type="button"
                className="p-1 rounded hover:bg-neutral-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePlaylist} className="space-y-3">
              <input
                value={newPlaylistName}
                onChange={(event) => setNewPlaylistName(event.target.value)}
                placeholder="Nhap ten playlist..."
                className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-white outline-none focus:border-green-500"
                autoFocus
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  type="button"
                  className="px-3 py-2 rounded-md bg-neutral-800 hover:bg-neutral-700"
                >
                  Huy
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 rounded-md bg-green-500 text-black font-semibold hover:bg-green-400"
                >
                  Tao playlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
