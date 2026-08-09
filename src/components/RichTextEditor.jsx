import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiLink,
  FiCode,
  FiImage,
  FiPlus,
  FiMinus,
} from 'react-icons/fi';
import {
  LuHeading1,
  LuHeading2,
  LuList,
  LuListOrdered,
  LuQuote,
} from 'react-icons/lu';
import { supabase } from '../lib/supabase';
import { useState, useRef, useCallback, useEffect } from 'react';

const lowlight = createLowlight(common);

const RichTextEditor = ({ content, onChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showInsertMenu, setShowInsertMenu] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [bubbleMenu, setBubbleMenu] = useState(null); // { top, left }
  const fileInputRef = useRef(null);
  const bubbleRef = useRef(null);

  const uploadImage = async (file) => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      return data?.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image: ' + (error.message || error.error || JSON.stringify(error)));
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const url = await uploadImage(file);
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
    e.target.value = '';
    setShowInsertMenu(false);
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: 'Tell your story...',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Underline,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      updateBubbleMenu(editor);
    },
    editorProps: {
      attributes: {
        class: 'medium-editor-content',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer?.files?.length > 0) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
            uploadImage(file).then(url => {
              if (url && coordinates) {
                view.dispatch(view.state.tr.insert(coordinates.pos, view.state.schema.nodes.image.create({ src: url })));
              } else if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            });
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const item of items) {
          if (item.type.startsWith('image/')) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) {
              uploadImage(file).then(url => {
                if (url) {
                  editor.chain().focus().setImage({ src: url }).run();
                }
              });
            }
            return true;
          }
        }
        return false;
      },
    },
  });

  const updateBubbleMenu = useCallback((editorInstance) => {
    const ed = editorInstance || editor;
    if (!ed) return;

    const { from, to } = ed.state.selection;
    const hasSelection = from !== to;
    const isImage = ed.isActive('image');

    if (hasSelection && !isImage) {
      const view = ed.view;
      const start = view.coordsAtPos(from);
      const end = view.coordsAtPos(to);
      const top = Math.min(start.top, end.top);
      const left = (start.left + end.left) / 2;

      setBubbleMenu({ top: top - 50, left });
    } else {
      setBubbleMenu(null);
      setShowLinkInput(false);
      setLinkUrl('');
    }
  }, [editor]);

  // Hide bubble menu on scroll to prevent stale positioning
  useEffect(() => {
    const handleScroll = () => {
      if (editor) updateBubbleMenu(editor);
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [editor, updateBubbleMenu]);

  const setLink = useCallback(() => {
    if (!editor) return;
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
    setShowLinkInput(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  if (!editor) return null;

  return (
    <div className="medium-editor">
      {/* Bubble Menu - floating toolbar on text selection */}
      {bubbleMenu && (
        <div
          ref={bubbleRef}
          className="bubble-menu"
          style={{
            position: 'fixed',
            top: `${bubbleMenu.top}px`,
            left: `${bubbleMenu.left}px`,
            transform: 'translateX(-50%)',
            zIndex: 100,
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {showLinkInput ? (
            <div className="bubble-link-input">
              <input
                type="text"
                placeholder="Paste or type a link..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); setLink(); }
                  if (e.key === 'Escape') { setShowLinkInput(false); setLinkUrl(''); }
                }}
                autoFocus
              />
              <button onClick={setLink} className="bubble-link-confirm">
                Apply
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'is-active' : ''}
                title="Bold"
              >
                <FiBold size={15} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}
                title="Italic"
              >
                <FiItalic size={15} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive('underline') ? 'is-active' : ''}
                title="Underline"
              >
                <FiUnderline size={15} />
              </button>

              <div className="bubble-divider" />

              <button
                onClick={() => {
                  if (editor.isActive('link')) {
                    editor.chain().focus().unsetLink().run();
                  } else {
                    const previousUrl = editor.getAttributes('link').href || '';
                    setLinkUrl(previousUrl);
                    setShowLinkInput(true);
                  }
                }}
                className={editor.isActive('link') ? 'is-active' : ''}
                title="Link"
              >
                <FiLink size={15} />
              </button>

              <div className="bubble-divider" />

              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
                title="Heading 1"
              >
                <LuHeading1 size={17} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                title="Heading 2"
              >
                <LuHeading2 size={17} />
              </button>

              <div className="bubble-divider" />

              <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive('blockquote') ? 'is-active' : ''}
                title="Quote"
              >
                <LuQuote size={15} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={editor.isActive('code') ? 'is-active' : ''}
                title="Inline Code"
              >
                <FiCode size={15} />
              </button>
            </>
          )}
        </div>
      )}

      {/* Editor content */}
      <div className="insert-menu-wrapper">
        <EditorContent editor={editor} />

        {/* Floating "+" button for inserting blocks */}
        <div className="floating-insert-container">
          <button
            className={`floating-insert-btn ${showInsertMenu ? 'is-open' : ''}`}
            onClick={() => setShowInsertMenu(!showInsertMenu)}
            type="button"
            title="Add content"
          >
            <FiPlus size={20} />
          </button>

          {showInsertMenu && (
            <div className="insert-menu">
              <button
                type="button"
                onClick={() => { fileInputRef.current?.click(); }}
                disabled={isUploading}
              >
                <FiImage size={16} />
                <span>Image</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleCodeBlock().run();
                  setShowInsertMenu(false);
                }}
              >
                <FiCode size={16} />
                <span>Code Block</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleBulletList().run();
                  setShowInsertMenu(false);
                }}
              >
                <LuList size={16} />
                <span>Bullet List</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleOrderedList().run();
                  setShowInsertMenu(false);
                }}
              >
                <LuListOrdered size={16} />
                <span>Numbered List</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleBlockquote().run();
                  setShowInsertMenu(false);
                }}
              >
                <LuQuote size={16} />
                <span>Quote</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().setHorizontalRule().run();
                  setShowInsertMenu(false);
                }}
              >
                <FiMinus size={16} />
                <span>Divider</span>
              </button>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
          disabled={isUploading}
        />
      </div>

      {isUploading && (
        <div className="upload-indicator">Uploading image...</div>
      )}

      <style>{`
        .medium-editor {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .insert-menu-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
          position: relative;
        }

        /* Editor content area */
        .medium-editor-content {
          outline: none;
          font-family: 'Georgia', 'Charter', serif;
          font-size: 19px;
          line-height: 1.8;
          color: var(--text-secondary);
          min-height: 300px;
          padding: 0;
        }

        .medium-editor-content > *:first-child {
          margin-top: 0;
        }

        .medium-editor .tiptap {
          flex: 1;
          overflow-y: auto;
          padding: 0 0 200px 0;
        }

        /* Placeholder */
        .medium-editor-content p.is-editor-empty:first-child::before {
          color: var(--text-muted);
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
          font-style: italic;
        }

        /* Typography */
        .medium-editor-content h1 {
          font-family: 'Quicksand', sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: var(--text);
          margin: 1.5em 0 0.5em;
          line-height: 1.3;
        }

        .medium-editor-content h2 {
          font-family: 'Quicksand', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: var(--text);
          margin: 1.3em 0 0.4em;
          line-height: 1.3;
        }

        .medium-editor-content h3 {
          font-family: 'Quicksand', sans-serif;
          font-size: 20px;
          font-weight: 600;
          color: var(--text);
          margin: 1.2em 0 0.3em;
        }

        .medium-editor-content p {
          margin: 0 0 1em;
        }

        .medium-editor-content a {
          color: var(--accent);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .medium-editor-content blockquote {
          border-left: 3px solid var(--accent);
          padding-left: 1.2em;
          margin: 1.5em 0;
          color: var(--text-muted);
          font-style: italic;
          font-size: 20px;
        }

        .medium-editor-content ul,
        .medium-editor-content ol {
          padding-left: 1.5em;
          margin: 1em 0;
        }

        .medium-editor-content li {
          margin: 0.3em 0;
        }

        .medium-editor-content code {
          background: rgba(255, 255, 255, 0.06);
          border-radius: 4px;
          padding: 2px 6px;
          font-family: 'Fira Code', 'JetBrains Mono', monospace;
          font-size: 0.88em;
          color: var(--accent);
        }

        .medium-editor-content pre {
          background: #1a1a2e;
          border-radius: 8px;
          padding: 1.2rem 1.5rem;
          margin: 1.5em 0;
          overflow-x: auto;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .medium-editor-content pre code {
          background: none;
          padding: 0;
          color: #e0e0e0;
          font-size: 14px;
          line-height: 1.6;
        }

        .medium-editor-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 2em 0;
          display: block;
        }

        .medium-editor-content hr {
          border: none;
          text-align: center;
          margin: 2em 0;
        }

        .medium-editor-content hr::before {
          content: '...';
          font-size: 28px;
          letter-spacing: 0.6em;
          color: var(--text-muted);
        }

        /* Bubble Menu */
        .bubble-menu {
          display: flex;
          align-items: center;
          background: #1a1a1a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 4px;
          gap: 2px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
          animation: bubbleIn 0.12s ease-out;
        }

        @keyframes bubbleIn {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        [data-theme="light"] .bubble-menu {
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .bubble-menu button {
          padding: 6px 8px;
          background: transparent;
          border: none;
          border-radius: 4px;
          color: #999;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }

        .bubble-menu button:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
        }

        [data-theme="light"] .bubble-menu button:hover {
          background: rgba(0, 0, 0, 0.06);
          color: #1a1a1a;
        }

        .bubble-menu button.is-active {
          background: var(--accent);
          color: #000;
        }

        .bubble-divider {
          width: 1px;
          height: 20px;
          background: rgba(255, 255, 255, 0.1);
          margin: 0 2px;
        }

        [data-theme="light"] .bubble-divider {
          background: rgba(0, 0, 0, 0.1);
        }

        /* Link input in bubble menu */
        .bubble-link-input {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 2px;
        }

        .bubble-link-input input {
          background: transparent;
          border: none;
          color: var(--text);
          font-size: 13px;
          padding: 4px 8px;
          outline: none;
          width: 200px;
        }

        .bubble-link-input input::placeholder {
          color: var(--text-muted);
        }

        .bubble-link-confirm {
          padding: 4px 10px !important;
          background: var(--accent) !important;
          color: #000 !important;
          border-radius: 4px !important;
          font-size: 12px;
          font-weight: 600;
        }

        /* Floating insert button */
        .floating-insert-container {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 50;
        }

        .floating-insert-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--accent);
          border: none;
          color: #000;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(0, 255, 136, 0.3);
        }

        .floating-insert-btn:hover {
          transform: scale(1.1);
        }

        .floating-insert-btn.is-open {
          transform: rotate(45deg);
        }

        .floating-insert-btn.is-open:hover {
          transform: rotate(45deg) scale(1.1);
        }

        .insert-menu {
          position: absolute;
          bottom: 60px;
          right: 0;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 180px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
          animation: insertMenuIn 0.15s ease-out;
        }

        @keyframes insertMenuIn {
          from { opacity: 0; transform: translateY(8px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .insert-menu button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 14px;
          transition: all 0.15s;
          white-space: nowrap;
        }

        .insert-menu button:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text);
        }

        [data-theme="light"] .insert-menu button:hover {
          background: rgba(0, 0, 0, 0.04);
        }

        /* Upload indicator */
        .upload-indicator {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          padding: 10px 20px;
          border-radius: 8px;
          color: var(--accent);
          font-size: 14px;
          z-index: 100;
          animation: fadeIn 0.2s;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* Lowlight syntax highlighting */
        .medium-editor-content pre .hljs-comment,
        .medium-editor-content pre .hljs-quote { color: #6a737d; }
        .medium-editor-content pre .hljs-keyword,
        .medium-editor-content pre .hljs-selector-tag { color: #ff7b72; }
        .medium-editor-content pre .hljs-string,
        .medium-editor-content pre .hljs-addition { color: #a5d6ff; }
        .medium-editor-content pre .hljs-number { color: #79c0ff; }
        .medium-editor-content pre .hljs-built_in { color: #ffa657; }
        .medium-editor-content pre .hljs-function .hljs-title { color: #d2a8ff; }
        .medium-editor-content pre .hljs-attr { color: #79c0ff; }
        .medium-editor-content pre .hljs-variable { color: #ffa657; }
        .medium-editor-content pre .hljs-type { color: #ff7b72; }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
