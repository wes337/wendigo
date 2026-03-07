"use client";

import { useCallback, useRef, useState, useImperativeHandle, forwardRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { cdn, insetShadow } from "@/app/styles";

function ToolbarButton({ editor, action, isActive, icon, label }) {
  let active = false;
  if (isActive && editor) {
    if (typeof isActive === "string") {
      active = editor.isActive(isActive);
    } else {
      const [name, attrs] = Object.entries(isActive)[0];
      active = editor.isActive(name, attrs);
    }
  }

  return (
    <button
      type="button"
      title={label}
      onMouseDown={(e) => {
        e.preventDefault();
        action();
      }}
      className={`flex items-center justify-center w-[26px] h-[26px] border-1 rounded-[2px] cursor-pointer ${
        active
          ? "bg-blue-200 border-blue-500"
          : "bg-zinc-200 border-zinc-400 hover:bg-zinc-100"
      } ${insetShadow}`}
    >
      <img src={`${cdn}/icons/small/${icon}.png`} alt={label} className="w-[16px] h-[16px]" />
    </button>
  );
}

function Toolbar({ editor, onUploadImage }) {
  const addLink = useCallback(() => {
    if (!editor) return;
    const url = prompt("Enter URL:");
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-zinc-300 border-1 border-zinc-400 rounded-[2px]">
      <ToolbarButton editor={editor} action={() => editor.chain().focus().toggleBold().run()} isActive="bold" icon="text_bold" label="Bold" />
      <ToolbarButton editor={editor} action={() => editor.chain().focus().toggleItalic().run()} isActive="italic" icon="text_italic" label="Italic" />
      <ToolbarButton editor={editor} action={() => editor.chain().focus().toggleUnderline().run()} isActive="underline" icon="text_underline" label="Underline" />
      <div className="w-px bg-zinc-400 mx-0.5" />
      <ToolbarButton editor={editor} action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={{ heading: { level: 2 } }} icon="text_heading_2" label="Heading 2" />
      <ToolbarButton editor={editor} action={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={{ heading: { level: 3 } }} icon="text_heading_3" label="Heading 3" />
      <div className="w-px bg-zinc-400 mx-0.5" />
      <ToolbarButton editor={editor} action={() => editor.chain().focus().toggleBlockquote().run()} isActive="blockquote" icon="text_indent" label="Blockquote" />
      <ToolbarButton editor={editor} action={() => editor.chain().focus().toggleBulletList().run()} isActive="bulletList" icon="text_list_bullets" label="Bullet List" />
      <ToolbarButton editor={editor} action={() => editor.chain().focus().toggleOrderedList().run()} isActive="orderedList" icon="text_list_numbers" label="Ordered List" />
      <div className="w-px bg-zinc-400 mx-0.5" />
      <ToolbarButton editor={editor} action={addLink} isActive="link" icon="link" label="Link" />
      <ToolbarButton editor={editor} action={onUploadImage} icon="image_add" label="Image" />
      <ToolbarButton editor={editor} action={() => editor.chain().focus().setHorizontalRule().run()} icon="text_horizontalrule" label="Horizontal Rule" />
      <div className="w-px bg-zinc-400 mx-0.5" />
      <ToolbarButton editor={editor} action={() => editor.chain().focus().undo().run()} icon="arrow_undo" label="Undo" />
      <ToolbarButton editor={editor} action={() => editor.chain().focus().redo().run()} icon="arrow_redo" label="Redo" />
    </div>
  );
}

export default forwardRef(function RichEditor({ content }, ref) {
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "about-prose outline-none min-h-[200px] p-4 bg-zinc-100 border-1 border-zinc-400 rounded-[2px] " + insetShadow,
      },
    },
  });

  useImperativeHandle(ref, () => ({
    getHTML: () => editor?.getHTML() ?? "",
  }), [editor]);

  const handleImageUpload = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const onImageSelected = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      setUploading(true);
      try {
        const xhr = new XMLHttpRequest();
        const result = await new Promise((resolve, reject) => {
          xhr.open("POST", "/api/upload-image");
          xhr.setRequestHeader("x-filename", file.name);
          xhr.onload = () => {
            if (xhr.status === 200) resolve(JSON.parse(xhr.responseText));
            else reject(new Error("Upload failed"));
          };
          xhr.onerror = () => reject(new Error("Upload failed"));
          xhr.send(file);
        });
        editor.chain().focus().setImage({ src: result.url }).run();
      } catch {
        alert("Image upload failed");
      } finally {
        setUploading(false);
        e.target.value = "";
      }
    },
    [editor]
  );

  return (
    <div className="flex flex-col gap-1">
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onImageSelected}
      />
      <Toolbar editor={editor} onUploadImage={handleImageUpload} />
      {uploading && (
        <div className="text-xs text-zinc-500">Uploading image...</div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
});
