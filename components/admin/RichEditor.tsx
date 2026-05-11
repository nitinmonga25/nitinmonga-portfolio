"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

function ToolBtn({
  onClick, active, title, children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className="w-7 h-7 flex items-center justify-center rounded font-body text-xs transition-colors"
      style={{
        background: active ? "rgba(255,61,0,0.2)" : "transparent",
        color: active ? "#FF3D00" : "rgba(255,255,255,0.55)",
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-4 mx-0.5" style={{ background: "rgba(255,255,255,0.1)" }} />;
}

export function RichEditor({ value, onChange, placeholder = "Write content here…", minHeight = 320 }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        "data-placeholder": placeholder,
        class: "rich-body",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", overflow: "hidden" }}>

      {/* ── Toolbar ──────────────────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b"
        style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
      >
        {/* Format */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
          <span style={{ fontWeight: 700 }}>B</span>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
          <span style={{ fontStyle: "italic" }}>I</span>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
          <span style={{ textDecoration: "line-through" }}>S</span>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline code">
          <span style={{ fontFamily: "monospace", fontSize: "11px" }}>{"`x`"}</span>
        </ToolBtn>

        <Divider />

        {/* Headings */}
        {([1, 2, 3] as const).map((level) => (
          <ToolBtn
            key={level}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            active={editor.isActive("heading", { level })}
            title={`Heading ${level}`}
          >
            <span style={{ fontSize: "10px", fontWeight: 700 }}>H{level}</span>
          </ToolBtn>
        ))}

        <Divider />

        {/* Lists */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="2" cy="4" r="1.2" fill="currentColor"/>
            <circle cx="2" cy="7" r="1.2" fill="currentColor"/>
            <circle cx="2" cy="10" r="1.2" fill="currentColor"/>
            <rect x="5" y="3.2" width="7" height="1.5" rx="0.5" fill="currentColor"/>
            <rect x="5" y="6.2" width="7" height="1.5" rx="0.5" fill="currentColor"/>
            <rect x="5" y="9.2" width="7" height="1.5" rx="0.5" fill="currentColor"/>
          </svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered list">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <text x="0.5" y="5.5" fontSize="5" fill="currentColor" fontFamily="monospace">1.</text>
            <text x="0.5" y="8.5" fontSize="5" fill="currentColor" fontFamily="monospace">2.</text>
            <text x="0.5" y="11.5" fontSize="5" fill="currentColor" fontFamily="monospace">3.</text>
            <rect x="6" y="3.2" width="6" height="1.5" rx="0.5" fill="currentColor"/>
            <rect x="6" y="6.2" width="6" height="1.5" rx="0.5" fill="currentColor"/>
            <rect x="6" y="9.2" width="6" height="1.5" rx="0.5" fill="currentColor"/>
          </svg>
        </ToolBtn>

        <Divider />

        {/* Blocks */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="2" width="2" height="10" rx="1" fill="currentColor" opacity="0.8"/>
            <rect x="5" y="3.5" width="8" height="1.5" rx="0.5" fill="currentColor"/>
            <rect x="5" y="6.5" width="6" height="1.5" rx="0.5" fill="currentColor"/>
            <rect x="5" y="9" width="7" height="1.5" rx="0.5" fill="currentColor"/>
          </svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code block">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M4 5L2 7l2 2M10 5l2 2-2 2M7.5 3.5l-1 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false} title="Horizontal rule">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="6.2" width="12" height="1.5" rx="0.5" fill="currentColor"/>
          </svg>
        </ToolBtn>

        <Divider />

        {/* History */}
        <ToolBtn onClick={() => editor.chain().focus().undo().run()} active={false} title="Undo">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 6a4.5 4.5 0 108 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M2 3v3h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()} active={false} title="Redo">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M11 6a4.5 4.5 0 10-8 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M11 3v3H8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </ToolBtn>
      </div>

      {/* ── Editor body ───────────────────────────────────────────────── */}
      <EditorContent
        editor={editor}
        style={{ minHeight: `${minHeight}px`, background: "rgba(255,255,255,0.03)" }}
      />
    </div>
  );
}
