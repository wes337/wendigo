"use client";

import { useActionState, useCallback, useRef } from "react";
import { box, input, submitBtn } from "@/app/styles";
import RichEditor from "@/app/admin/editor";

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / 1048576).toFixed(2) + " MB";
}

export default function PostForm({ action, post, files }) {
  const [state, formAction] = useActionState(action, null);
  const editorRef = useRef(null);

  const handleSubmit = useCallback(
    (formData) => {
      if (editorRef.current) {
        formData.set("content", editorRef.current.getHTML());
      }
      formAction(formData);
    },
    [formAction]
  );

  return (
    <form action={handleSubmit} className={box}>
      {post && <input type="hidden" name="id" value={post.id} />}

      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold">Title</span>
        <input
          name="title"
          defaultValue={post?.title}
          required
          className={input}
        />
      </label>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-bold">Content</span>
        <RichEditor ref={editorRef} content={post?.content ?? ""} />
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold">Author</span>
        <input
          name="author"
          defaultValue={post?.author || "Wendigo"}
          className={input}
        />
      </label>

      <div className="flex flex-col gap-2.5">
        <span className="text-sm font-bold">Files</span>
        {files.length === 0 && (
          <div className="text-sm text-zinc-500">
            No files uploaded yet.
          </div>
        )}
        {files.map((file) => (
          <label key={file.id} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              name="files"
              value={file.id}
              defaultChecked={post?.fileIds?.includes(file.id)}
            />
            <span className="truncate">{file.name}</span>
            <span className="text-xs text-zinc-500 whitespace-nowrap ml-auto">
              {formatSize(Number(file.size))}
            </span>
          </label>
        ))}
      </div>

      {state?.error && (
        <div className="text-red-600 text-sm">{state.error}</div>
      )}

      <button type="submit" className={submitBtn}>
        {post ? "Update" : "Create"} Post
      </button>
    </form>
  );
}
