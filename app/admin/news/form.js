"use client";

import { useActionState, useCallback, useRef } from "react";
import { box, input, submitBtn } from "@/app/styles";
import RichEditor from "@/app/admin/editor";

export default function ArticleForm({ action, article }) {
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
      {article && <input type="hidden" name="id" value={article.id} />}

      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold">Title</span>
        <input
          name="title"
          defaultValue={article?.title}
          required
          className={input}
        />
      </label>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-bold">Content</span>
        <RichEditor ref={editorRef} content={article?.content ?? ""} />
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold">Author</span>
        <input
          name="author"
          defaultValue={article?.author || "Wendigo Corp PR Dept."}
          className={input}
        />
      </label>

      {state?.error && (
        <div className="text-red-600 text-sm">{state.error}</div>
      )}

      <button type="submit" className={submitBtn}>
        {article ? "Update" : "Create"} Article
      </button>
    </form>
  );
}
