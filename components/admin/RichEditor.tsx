"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExt from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import YoutubeExt from "@tiptap/extension-youtube";
import UnderlineExt from "@tiptap/extension-underline";
import { Node, mergeAttributes } from "@tiptap/core";
import { useEffect, useRef, useState } from "react";

/* ── Custom iframe node ──────────────────────────────────────────────── */
const IframeNode = Node.create({
  name: "iframe",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
      width: { default: "100%" },
      height: { default: "450" },
    };
  },
  parseHTML() {
    return [{ tag: "iframe[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { class: "embed-wrapper" },
      ["iframe", mergeAttributes(HTMLAttributes, {
        allowfullscreen: "true",
        loading: "lazy",
        scrolling: "no",
      })],
    ];
  },
  addNodeView() {
    return ({ node }) => {
      const wrapper = document.createElement("div");
      wrapper.className = "embed-wrapper";
      wrapper.style.cssText = "max-width:50%;margin:1.5rem auto;border-radius:12px;overflow:hidden;background:rgba(0,0,0,0.04);";
      const iframe = document.createElement("iframe");
      iframe.src = node.attrs.src ?? "";
      iframe.style.cssText = "width:100%;height:560px;border:0;display:block;";
      iframe.setAttribute("allowfullscreen", "true");
      iframe.setAttribute("loading", "lazy");
      iframe.setAttribute("scrolling", "no");
      wrapper.appendChild(iframe);
      return { dom: wrapper };
    };
  },
});

/* ── Types ───────────────────────────────────────────────────────────── */
interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}
type ActivePanel = "link" | "image" | "youtube" | "embed" | null;

/* ── Small reusable pieces ───────────────────────────────────────────── */
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
  return <div className="w-px h-4 mx-0.5 self-center" style={{ background: "rgba(255,255,255,0.1)" }} />;
}

function PanelInput({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-wrap items-center gap-2 px-3 py-2 border-b"
      style={{ background: "rgba(255,61,0,0.06)", borderColor: "rgba(255,61,0,0.2)" }}
    >
      {children}
    </div>
  );
}

/* ── Shared input style ──────────────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#fff",
  borderRadius: "6px",
  padding: "4px 10px",
  fontSize: "12px",
  outline: "none",
  flex: 1,
  minWidth: 0,
};

const btnStyle: React.CSSProperties = {
  background: "#FF3D00",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "4px 12px",
  fontSize: "12px",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const ghostBtnStyle: React.CSSProperties = {
  ...btnStyle,
  background: "rgba(255,255,255,0.1)",
};

/* ── Main component ──────────────────────────────────────────────────── */
export function RichEditor({ value, onChange, placeholder = "Write content here…", minHeight = 320 }: Props) {
  const [panel, setPanel] = useState<ActivePanel>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [ytUrl, setYtUrl] = useState("");
  const [embedCode, setEmbedCode] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      UnderlineExt,
      LinkExt.configure({ openOnClick: false, HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" } }),
      ImageExt.configure({ inline: false, allowBase64: false }),
      YoutubeExt.configure({ width: 640, height: 360, nocookie: true }),
      IframeNode,
    ],
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
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  /* ── Panel toggle helper ─────────────────────────────────────────── */
  function togglePanel(p: ActivePanel) {
    if (panel === p) { setPanel(null); return; }
    // Pre-fill link if cursor is already on one
    if (p === "link" && editor) {
      const href = editor.getAttributes("link").href ?? "";
      setLinkUrl(href);
    }
    setPanel(p);
  }

  /* ── Actions ─────────────────────────────────────────────────────── */
  function applyLink() {
    if (!editor) return;
    if (linkUrl.trim()) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl.trim() }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setPanel(null); setLinkUrl("");
  }

  function insertImageUrl() {
    if (!editor || !imgUrl.trim()) return;
    editor.chain().focus().setImage({ src: imgUrl.trim() }).run();
    setPanel(null); setImgUrl("");
  }

  async function uploadImage(file: File) {
    if (!editor) return;
    setUploading(true);
    try {
      const sigRes = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: "nitinmonga" }),
      });
      const sig = await sigRes.json();
      if (!sig.ok) throw new Error(sig.error);
      const form = new FormData();
      form.append("file", file);
      form.append("api_key", sig.apiKey);
      form.append("timestamp", sig.timestamp);
      form.append("signature", sig.signature);
      form.append("folder", sig.folder);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: "POST", body: form });
      const data = await res.json();
      if (data.secure_url) {
        editor.chain().focus().setImage({ src: data.secure_url }).run();
        setPanel(null);
      }
    } catch { /* silent */ } finally { setUploading(false); }
  }

  function insertYoutube() {
    if (!editor || !ytUrl.trim()) return;
    editor.commands.setYoutubeVideo({ src: ytUrl.trim() });
    setPanel(null); setYtUrl("");
  }

  function insertEmbed() {
    if (!editor || !embedCode.trim()) return;
    const code = embedCode.trim();

    // Instagram: extract permalink from embed code
    const igMatch = code.match(/data-instgrm-permalink=["']([^"'?]+)/);
    // Generic iframe src
    const srcMatch = code.match(/src=["']([^"']+)["']/);
    // Plain URL
    const isUrl = code.startsWith("http");

    let src = "";
    if (igMatch) {
      src = igMatch[1].replace(/\/$/, "") + "/embed/";
    } else if (srcMatch) {
      src = srcMatch[1];
    } else if (isUrl) {
      src = code;
    }

    if (!src) return;
    editor.chain().focus().insertContent({ type: "iframe", attrs: { src } }).run();
    setPanel(null); setEmbedCode("");
  }

  if (!editor) return null;

  const isLinkActive = editor.isActive("link");

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
        <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline">
          <span style={{ textDecoration: "underline" }}>U</span>
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

        {/* ── NEW: Link ─────────────────────────────────────────── */}
        <ToolBtn onClick={() => togglePanel("link")} active={isLinkActive || panel === "link"} title="Hyperlink">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5.5 8.5a3.5 3.5 0 005 0l1.5-1.5a3.5 3.5 0 00-5-5L5.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M8.5 5.5a3.5 3.5 0 00-5 0L2 7a3.5 3.5 0 005 5l1.5-1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </ToolBtn>

        {/* ── NEW: Image ────────────────────────────────────────── */}
        <ToolBtn onClick={() => togglePanel("image")} active={panel === "image"} title="Insert image">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
            <circle cx="4.5" cy="5.5" r="1.2" fill="currentColor"/>
            <path d="M1 10l3.5-3L7 9.5l2.5-3L13 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </ToolBtn>

        {/* ── NEW: YouTube ──────────────────────────────────────── */}
        <ToolBtn onClick={() => togglePanel("youtube")} active={panel === "youtube"} title="Embed YouTube video">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="2.5" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M5.5 5l4 2-4 2V5z" fill="currentColor"/>
          </svg>
        </ToolBtn>

        {/* ── NEW: Embed (Instagram / iframes) ─────────────────── */}
        <ToolBtn onClick={() => togglePanel("embed")} active={panel === "embed"} title="Embed iframe (Instagram, etc.)">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M4 7h6M7 5v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
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

      {/* ── Link panel ───────────────────────────────────────────────── */}
      {panel === "link" && (
        <PanelInput>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ color: "#FF3D00", flexShrink: 0 }}>
            <path d="M5.5 8.5a3.5 3.5 0 005 0l1.5-1.5a3.5 3.5 0 00-5-5L5.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M8.5 5.5a3.5 3.5 0 00-5 0L2 7a3.5 3.5 0 005 5l1.5-1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <input
            autoFocus
            type="url"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") applyLink(); if (e.key === "Escape") setPanel(null); }}
            style={{ ...inputStyle, minWidth: "220px" }}
          />
          <button type="button" style={btnStyle} onClick={applyLink}>Apply</button>
          {isLinkActive && (
            <button type="button" style={ghostBtnStyle} onClick={() => { editor.chain().focus().unsetLink().run(); setPanel(null); }}>Remove</button>
          )}
          <button type="button" style={ghostBtnStyle} onClick={() => setPanel(null)}>Cancel</button>
        </PanelInput>
      )}

      {/* ── Image panel ──────────────────────────────────────────────── */}
      {panel === "image" && (
        <PanelInput>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ color: "#FF3D00", flexShrink: 0 }}>
            <rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
            <circle cx="4.5" cy="5.5" r="1.2" fill="currentColor"/>
            <path d="M1 10l3.5-3L7 9.5l2.5-3L13 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            autoFocus
            type="url"
            placeholder="Paste image URL…"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") insertImageUrl(); if (e.key === "Escape") setPanel(null); }}
            style={{ ...inputStyle, minWidth: "200px" }}
          />
          <button type="button" style={btnStyle} onClick={insertImageUrl}>Insert URL</button>
          <button
            type="button"
            style={ghostBtnStyle}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? "Uploading…" : "Upload file"}
          </button>
          <button type="button" style={ghostBtnStyle} onClick={() => setPanel(null)}>Cancel</button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ""; }}
          />
        </PanelInput>
      )}

      {/* ── YouTube panel ────────────────────────────────────────────── */}
      {panel === "youtube" && (
        <PanelInput>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ color: "#FF3D00", flexShrink: 0 }}>
            <rect x="1" y="2.5" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M5.5 5l4 2-4 2V5z" fill="currentColor"/>
          </svg>
          <input
            autoFocus
            type="url"
            placeholder="YouTube URL or video ID…"
            value={ytUrl}
            onChange={(e) => setYtUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") insertYoutube(); if (e.key === "Escape") setPanel(null); }}
            style={{ ...inputStyle, minWidth: "240px" }}
          />
          <button type="button" style={btnStyle} onClick={insertYoutube}>Embed</button>
          <button type="button" style={ghostBtnStyle} onClick={() => setPanel(null)}>Cancel</button>
        </PanelInput>
      )}

      {/* ── Embed / iframe panel ─────────────────────────────────────── */}
      {panel === "embed" && (
        <div
          className="flex flex-col gap-2 px-3 py-2 border-b"
          style={{ background: "rgba(255,61,0,0.06)", borderColor: "rgba(255,61,0,0.2)" }}
        >
          <div className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ color: "#FF3D00", flexShrink: 0 }}>
              <rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M4 7h6M7 5v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
              Paste iframe HTML, Instagram embed code, or a direct iframe src URL
            </span>
          </div>
          <textarea
            autoFocus
            rows={3}
            placeholder={`<iframe src="https://..." ...></iframe>\nor paste Instagram embed code\nor https://www.youtube.com/embed/...`}
            value={embedCode}
            onChange={(e) => setEmbedCode(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Escape") setPanel(null); }}
            style={{
              ...inputStyle,
              resize: "vertical",
              fontFamily: "monospace",
              fontSize: "11px",
              minWidth: "100%",
              padding: "8px 10px",
              lineHeight: 1.5,
            }}
          />
          <div className="flex gap-2">
            <button type="button" style={btnStyle} onClick={insertEmbed}>Insert Embed</button>
            <button type="button" style={ghostBtnStyle} onClick={() => setPanel(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── Editor body ───────────────────────────────────────────────── */}
      <EditorContent
        editor={editor}
        style={{ minHeight: `${minHeight}px`, background: "rgba(255,255,255,0.03)" }}
      />
    </div>
  );
}
