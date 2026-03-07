"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { input, btn, insetShadow } from "@/app/styles";

export default function UploadForm() {
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();
    const file = fileRef.current?.files[0];
    if (!file) return;

    setError(null);
    setProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    xhr.setRequestHeader("x-filename", file.name);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      setProgress(null);
      if (xhr.status === 200) {
        fileRef.current.value = "";
        router.refresh();
      } else {
        setError("Upload failed");
      }
    };

    xhr.onerror = () => {
      setProgress(null);
      setError("Upload failed");
    };

    xhr.send(file);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2.5">
        <input ref={fileRef} type="file" required className={input} />
        <button type="submit" disabled={progress !== null} className={btn}>
          {progress !== null ? `${progress}%` : "Upload"}
        </button>
      </div>
      {progress !== null && (
        <div className={`w-full h-[8px] bg-zinc-400/25 rounded-[2px] border-1 border-zinc-500/50 overflow-hidden ${insetShadow}`}>
          <div
            className="h-full bg-blue-400 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </form>
  );
}
