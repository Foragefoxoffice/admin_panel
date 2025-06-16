"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import FormulaFormatter from "@/contexts/FormulaFormatter";

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
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { MathJaxContext, MathJax } from "better-react-mathjax";
import { useEffect, useState } from "react";

export default function RichTextEditor({ value, onChange }) {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [textColor, setTextColor] = useState("#000000");
  const [highlightColor, setHighlightColor] = useState("#ffff00");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
        codeBlock: false,
      }),
      BulletList,
      OrderedList,
      ListItem,
      Bold,
      Italic,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
      Subscript,
      Superscript,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Code,
      CodeBlock.configure({
        languageClassPrefix: "language-",
      }),
      HorizontalRule,
    ],
    content: value || "<p></p>",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      handlePaste: (view, event) => {
        const clipboardData = event.clipboardData || window.clipboardData;
        const text = clipboardData.getData("text/plain");

        // Let the default paste handler handle it
        return false;
      },
    },
  });

  useEffect(() => {
    if (editor && value && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!editor) return null;

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    }
    setShowLinkInput(false);
    setLinkUrl("");
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
    setShowLinkInput(false);
  };

  const setTextColorCommand = () => {
    editor.chain().focus().setColor(textColor).run();
  };

  const setHighlightColorCommand = () => {
    editor.chain().focus().setHighlight({ color: highlightColor }).run();
  };

  return (
    <MathJaxContext config={{
      loader: { load: ["input/tex", "output/chtml"] },
      tex: {
        packages: { '[+]': ['color', 'mhchem', 'chemfig'] },
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
      }
    }}>
      <div className="border p-4 rounded-lg mt-5">
        {/* Main Toolbar */}
        <div className="mb-2  flex flex-wrap gap-2">
          {/* Text Formatting */}
          <ToolbarButton editor={editor} command="toggleBold" type="bold" label="B" />
          <ToolbarButton editor={editor} command="toggleItalic" type="italic" label="I" />
          <ToolbarButton editor={editor} command="toggleUnderline" type="underline" label="U" />
          <ToolbarButton editor={editor} command="toggleCode" type="code" label="</>" />
          <ToolbarButton
            editor={editor}
            command="insertMath"
            type="math"
            label="∑"
          />

          <ToolbarButton editor={editor} command="insertLatexSub" type="latexSub" label="X₍ₙ₎" />
          <ToolbarButton editor={editor} command="insertLatexSup" type="latexSup" label="Xⁿ" />
          <ToolbarButton editor={editor} command="insertquotation" type="latexSub" label="\(" />
          <ToolbarButton editor={editor} command="insertarray" type="latexSup" label="\)" />

          {/* Lists */}
          <ToolbarButton editor={editor} command="toggleBulletList" type="bulletList" label="• List" />
          <ToolbarButton editor={editor} command="toggleOrderedList" type="orderedList" label="1. List" />

          {/* Scripts */}
          <ToolbarButton editor={editor} command="toggleSubscript" type="subscript" label="X₂" />
          <ToolbarButton editor={editor} command="toggleSuperscript" type="superscript" label="X²" />

          {/* Link */}
          <div className="relative">
            <button
              onClick={() => setShowLinkInput(!showLinkInput)}
              className={`px-3 py-1 rounded ${editor.isActive("link") ? "bg-blue-100 text-blue-600" : "bg-gray-100 hover:bg-gray-200"}`}
            >
              🔗
            </button>
            {showLinkInput && (
              <div className="absolute z-10 top-full left-0 mt-1 p-2 bg-white border rounded shadoh-8lg">
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="Enter URL"
                  className="border p-1 mb-2 h-8full"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={addLink}
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    Apply
                  </button>
                  <button
                    onClick={removeLink}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Text Alignment */}
          <div className="border-l border-gray-300 h-6 mx-2"></div>
          <ToolbarButton editor={editor} command="setTextAlign" type={{ textAlign: "left" }} label="≡" />
          <ToolbarButton editor={editor} command="setTextAlign" type={{ textAlign: "center" }} label="≡" />
          <ToolbarButton editor={editor} command="setTextAlign" type={{ textAlign: "right" }} label="≡" />

          {/* Colors */}
          <div className="border-l border-gray-300 h-6 mx-2"></div>
          <div className="flex items-center gap-3">
            <input
              type="color"
              style={{ margin: 0, height: 25, padding: 0, border: 'none', width: 25, background: "transparent" }}
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              onBlur={setTextColorCommand}

            />
            <input
              type="color"
              style={{ margin: 0, height: 25, padding: 0, border: 'none', width: 25, background: "transparent" }}
              value={highlightColor}
              onChange={(e) => setHighlightColor(e.target.value)}
              onBlur={setHighlightColorCommand}


            />
          </div>

          {/* Advanced */}
          <div className="border-l border-gray-300 h-6 "></div>
          <ToolbarButton editor={editor} command="toggleCodeBlock" type="codeBlock" label="</> Block" />
          <ToolbarButton editor={editor} command="setHorizontalRule" type="" label="---" />
        </div>

        {/* Bubble Menu for quick formatting */}
        {editor && (
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <div className="flex bg-white border rounded shadoh-8lg p-1 space-x-1">
              <ToolbarButton editor={editor} command="toggleBold" type="bold" label="B" />
              <ToolbarButton editor={editor} command="toggleItalic" type="italic" label="I" />
              <ToolbarButton editor={editor} command="toggleUnderline" type="underline" label="U" />
              <button
                onClick={() => {
                  const url = prompt("Enter URL:");
                  if (url) editor.chain().focus().setLink({ href: url }).run();
                }}
                className={`px-2 py-1 rounded ${editor.isActive("link") ? "bg-blue-100" : "bg-gray-100"}`}
              >
                🔗
              </button>
            </div>
          </BubbleMenu>
        )}

        {/* Editor Content */}
        <EditorContent
          editor={editor}
          className="min-h-[150px] p-4 border rounded ProseMirror focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        {/* Rendered Math Preview */}
        <div className="mt-4 p-3 border-t text-gray-700 text-sm">
          <h3 className="font-medium mb-2">Math Preview:</h3>
          <MathJax dynamic>
           <div
  className="preview overflow-auto break-words whitespace-pre-wrap"
  dangerouslySetInnerHTML={{ __html: editor?.getHTML() }}
/>

          </MathJax>
        </div>
      </div>
    </MathJaxContext>
  );
}

function ToolbarButton({ editor, command, type, label }) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        if (command === "setTextAlign") {
          editor.chain().focus()[command](type.textAlign).run();
        } else if (command === "insertMath") {
          const latex = '\\(\\frac{}{}\\)';
          editor.chain().focus().insertContent(latex).run();
        } else if (command === "insertLatexSub") {
          const latex = '_{ }';
          editor.chain().focus().insertContent(latex).run();
        } else if (command === "insertLatexSup") {
          const latex = '^{ }';
          editor.chain().focus().insertContent(latex).run();

        } else if (command === "insertquotation") {
          const latex = '\(';
          editor.chain().focus().insertContent(latex).run();
        } else if (command === "insertarray") {
          const latex = '\)';
          editor.chain().focus().insertContent(latex).run();
        }
        else {
          editor.chain().focus()[command]().run();
        }
      }}
      className={`px-3 py-1 rounded  ${editor.isActive(type) ? "richoptionhover" : "richoption"
        }`}
    >
      {label}
    </button>
  );
}

