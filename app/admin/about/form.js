"use client";

import { useActionState, useCallback, useRef } from "react";
import { updatePage } from "@/app/admin/about/actions";
import { submitBtn } from "@/app/styles";
import RichEditor from "@/app/admin/editor";

export default function AboutForm({ content }) {
  const [state, formAction, pending] = useActionState(updatePage, null);
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
    <form action={handleSubmit}>
      <input type="hidden" name="slug" value="about" />

      <div className="flex flex-col gap-2.5">
        <RichEditor ref={editorRef} content={content} />

        {state?.error && (
          <div className="text-red-600 text-sm">{state.error}</div>
        )}
        {state?.success && (
          <div className="text-green-700 text-sm">Saved!</div>
        )}

        <button type="submit" disabled={pending} className={submitBtn}>
          {pending ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
