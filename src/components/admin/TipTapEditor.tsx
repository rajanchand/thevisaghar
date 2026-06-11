"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";

interface TipTapEditorProps {
  content: string | { html?: string } | Record<string, unknown>;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function TipTapEditor({
  content,
  onChange,
  placeholder = "Write something amazing...",
}: TipTapEditorProps) {
  // Convert content if it's JSON or string
  const initialContent = typeof content === "object" && content !== null ? (content as { html?: string })?.html || "" : (content as string);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-gold underline hover:text-navy transition-colors",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full my-4 shadow-md",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[300px] px-4 py-3 border border-t-0 border-gray-200 rounded-b-xl bg-white",
      },
    },
  });

  // Keep editor content in sync with external values if updated externally (like when loading edit data)
  useEffect(() => {
    if (editor && content) {
      const currentHTML = editor.getHTML();
      const targetHTML = typeof content === "object" && content !== null ? (content as { html?: string })?.html || "" : (content as string);
      if (currentHTML !== targetHTML) {
        editor.commands.setContent(targetHTML);
      }
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="animate-pulse h-[350px] bg-gray-100 border border-gray-200 rounded-xl" />
    );
  }

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter the URL:", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="w-full flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg hover:bg-gray-200 transition-colors ${
            editor.isActive("bold") ? "bg-navy text-white hover:bg-navy/90" : "text-gray-600"
          }`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg hover:bg-gray-200 transition-colors ${
            editor.isActive("italic") ? "bg-navy text-white hover:bg-navy/90" : "text-gray-600"
          }`}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg hover:bg-gray-200 transition-colors ${
            editor.isActive("heading", { level: 2 })
              ? "bg-navy text-white hover:bg-navy/90"
              : "text-gray-600"
          }`}
          title="Heading 2"
        >
          <Heading1 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded-lg hover:bg-gray-200 transition-colors ${
            editor.isActive("heading", { level: 3 })
              ? "bg-navy text-white hover:bg-navy/90"
              : "text-gray-600"
          }`}
          title="Heading 3"
        >
          <Heading2 size={16} />
        </button>
        <div className="h-4 w-[1px] bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg hover:bg-gray-200 transition-colors ${
            editor.isActive("bulletList") ? "bg-navy text-white hover:bg-navy/90" : "text-gray-600"
          }`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg hover:bg-gray-200 transition-colors ${
            editor.isActive("orderedList") ? "bg-navy text-white hover:bg-navy/90" : "text-gray-600"
          }`}
          title="Ordered List"
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg hover:bg-gray-200 transition-colors ${
            editor.isActive("blockquote") ? "bg-navy text-white hover:bg-navy/90" : "text-gray-600"
          }`}
          title="Blockquote"
        >
          <Quote size={16} />
        </button>
        <div className="h-4 w-[1px] bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={addLink}
          className={`p-2 rounded-lg hover:bg-gray-200 transition-colors ${
            editor.isActive("link") ? "bg-navy text-white hover:bg-navy/90" : "text-gray-600"
          }`}
          title="Insert Link"
        >
          <LinkIcon size={16} />
        </button>
        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-600"
          title="Insert Image"
        >
          <ImageIcon size={16} />
        </button>
        <div className="h-4 w-[1px] bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-600 disabled:opacity-40"
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-600 disabled:opacity-40"
          title="Redo"
        >
          <Redo size={16} />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
