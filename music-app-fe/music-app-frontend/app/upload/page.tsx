"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ArrowLeft, Loader2, UploadCloud } from "lucide-react";

const API_BASE_URL = "http://localhost:8089/api/songs";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [uploaderId, setUploaderId] = useState("1");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const canSubmit = useMemo(() => {
    return title.trim().length > 0 && uploaderId.trim().length > 0 && !!audioFile;
  }, [title, uploaderId, audioFile]);

  const handleFileChange =
    (setter: (file: File | null) => void) => (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.target.files?.[0] ?? null);
    };

  const resetForm = () => {
    setTitle("");
    setAudioFile(null);
    setCoverFile(null);
  };

  const handleUploadSong = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || !audioFile) return;

    setIsUploading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("audio", audioFile);
    if (coverFile) {
      formData.append("cover", coverFile);
    }
    formData.append("uploaderId", uploaderId.trim());

    try {
      await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("Upload thanh cong. Bam 'Quay ve Home' de thay bai moi.");
      resetForm();
    } catch (error) {
      console.error("Loi upload bai hat:", error);
      setErrorMessage("Upload that bai. Kiem tra file hoac uploaderId roi thu lai.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="pb-24 p-4 md:p-6">
      <div className="max-w-3xl mx-auto bg-neutral-950 border border-neutral-800 rounded-xl p-4 md:p-6">
        <div className="flex items-center justify-between gap-3 mb-5">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <UploadCloud size={22} />
            Them nhac moi
          </h1>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-800 hover:bg-neutral-700 text-sm"
          >
            <ArrowLeft size={16} />
            Quay ve Home
          </Link>
        </div>

        <form onSubmit={handleUploadSong} className="grid md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2 text-sm text-neutral-300 md:col-span-2">
            Ten bai hat
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-white outline-none focus:border-green-500"
              placeholder="Vi du: Nang tho"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-neutral-300">
            Uploader ID
            <input
              value={uploaderId}
              onChange={(event) => setUploaderId(event.target.value)}
              className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-white outline-none focus:border-green-500"
              placeholder="Vi du: 1"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-neutral-300">
            File nhac (bat buoc)
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange(setAudioFile)}
              className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-white file:mr-3 file:px-3 file:py-1 file:rounded file:border-0 file:bg-neutral-700 file:text-white"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-neutral-300 md:col-span-2">
            Anh bia (khong bat buoc)
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange(setCoverFile)}
              className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-white file:mr-3 file:px-3 file:py-1 file:rounded file:border-0 file:bg-neutral-700 file:text-white"
            />
          </label>

          <div className="md:col-span-2 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={!canSubmit || isUploading}
              className="px-4 py-2 rounded-md bg-green-500 text-black font-semibold hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading ? <Loader2 size={16} className="animate-spin" /> : null}
              {isUploading ? "Dang upload..." : "Upload bai hat"}
            </button>

            <span className="text-xs text-neutral-400">
              {audioFile ? `Audio: ${audioFile.name}` : "Chua chon file nhac"}
            </span>
            <span className="text-xs text-neutral-400">
              {coverFile ? `Cover: ${coverFile.name}` : "Khong co cover"}
            </span>
          </div>
        </form>

        {errorMessage && (
          <p className="mt-4 text-sm text-red-400 bg-red-950/40 border border-red-800 rounded-md px-3 py-2">
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p className="mt-4 text-sm text-green-400 bg-green-950/40 border border-green-800 rounded-md px-3 py-2">
            {successMessage}
          </p>
        )}
      </div>
    </div>
  );
}
