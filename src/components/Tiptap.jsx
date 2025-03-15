"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { useEffect } from "react";

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ bulletList: false, orderedList: false, listItem: false }),
      BulletList,
      OrderedList,
      ListItem,
      Bold,
      Italic,
      Underline,
      Link,
      Subscript,
      Superscript,
    ],
    content: value || "<p>Start typing...</p>",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      handlePaste: (view, event) => {
        event.preventDefault();
        const clipboardData = event.clipboardData || window.clipboardData;
        const text = clipboardData.getData("text/plain") || clipboardData.getData("text/html");

        let formattedText = formatPastedContent(text);

        view.dispatch(view.state.tr.insertText(formattedText));
        return true;
      },
    },
  });

  useEffect(() => {
    if (editor && value && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border p-4 rounded-lg">
      {/* Toolbar */}
      <div className="mb-2 space-x-2 flex">
        <ToolbarButton editor={editor} command="toggleBold" type="bold" label="B" />
        <ToolbarButton editor={editor} command="toggleItalic" type="italic" label="I" />
        <ToolbarButton editor={editor} command="toggleUnderline" type="underline" label="U" />
        <ToolbarButton editor={editor} command="toggleBulletList" type="bulletList" label="• List" />
        <ToolbarButton editor={editor} command="toggleOrderedList" type="orderedList" label="1. List" />
        <ToolbarButton editor={editor} command="toggleSubscript" type="subscript" label="X₂" />
        <ToolbarButton editor={editor} command="toggleSuperscript" type="superscript" label="X²" />
        <button
          onClick={() => {
            const url = prompt("Enter URL:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          className={`px-3 py-1 rounded ${editor.isActive("link") ? "richoptionhover" : "richoption"}`}
        >
          🔗
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="min-h-[150px] p-2 border ProseMirror" />
    </div>
  );
}

// Toolbar Button Component
function ToolbarButton({ editor, command, type, label }) {
  return (
    <button
      onClick={() => editor.chain().focus()[command]().run()}
      className={`px-3 py-1 rounded ${editor.isActive(type) ? "richoptionhover" : "richoption"}`}
    >
      {label}
    </button>
  );
}

function formatPastedContent(text) {
  const subscriptMap = { "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉" };
  const superscriptMap = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "+": "⁺", "-": "⁻", "=": "⁼", "⊕": "⊕" };

  // Convert subscripts (C_6 → C₆)
  text = text.replace(/([A-Za-z])_([0-9]+)/g, (_, base, sub) =>
    base + sub.split("").map(c => subscriptMap[c] || c).join("")
  );

  // Convert superscripts (H^⊕ → H⁺)
  text = text.replace(/([A-Za-z0-9])\^([\+\-0-9⊕]+)/g, (_, base, sup) =>
    base + sup.split("").map(c => superscriptMap[c] || c).join("")
  );

  // Convert reaction arrows and annotations
  text = text
    .replace(/→┴\(([^)]+)\)/g, "→ ($1)") // Converts →┴(Zn dust) → (Zn dust)
    .replace(/→┴([^→\s]+)/g, "→ ($1)") // Converts →┴X → (X)
    .replace(/→┴\(([^)]+)\)┬\(([^)]+)\)/g, "→ ($1, $2)") // Converts →┴(Zn dust)┬(CH₃Cl) → (Zn dust, CH₃Cl)
    .replace(/⟶/g, "→"); // Normal reaction arrow "→"

  return text;
}
