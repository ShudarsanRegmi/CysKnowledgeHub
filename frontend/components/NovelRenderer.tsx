import React, { useMemo } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import type { JSONContent } from '@tiptap/react';

// ─── Tiptap extensions that match our Novel editor setup ─────────────────────
const RENDER_EXTENSIONS = [
  StarterKit,
  Image.configure({ allowBase64: true }),
  Link.configure({ openOnClick: false }),
];

// ─── Utility: raw word count from Tiptap JSON ────────────────────────────────
export function wordCountFromNovelJson(content: JSONContent): number {
  let words = 0;
  const traverse = (node: JSONContent) => {
    if (node.type === 'text' && node.text) {
      words += node.text.trim().split(/\s+/).filter(Boolean).length;
    }
    node.content?.forEach(traverse);
  };
  traverse(content);
  return words;
}

export function wordCountFromMarkdown(md: string): number {
  return md.replace(/[#*_`~\[\](){}|>!]|-{3,}|={3,}/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

/** Returns estimated reading time in minutes (200 wpm). */
export function readingTime(content: string, contentType: 'markdown' | 'novel' = 'markdown'): number {
  let words = 0;
  if (contentType === 'novel') {
    try {
      const json: JSONContent = JSON.parse(content);
      words = wordCountFromNovelJson(json);
    } catch {
      words = wordCountFromMarkdown(content);
    }
  } else {
    words = wordCountFromMarkdown(content);
  }
  return Math.max(1, Math.ceil(words / 200));
}

// ─── Derive a plain-text excerpt from content ─────────────────────────────────
export function excerptFromContent(
  content: string,
  contentType: 'markdown' | 'novel' = 'markdown',
  maxLen = 160
): string {
  let text = '';
  if (contentType === 'novel') {
    try {
      const json: JSONContent = JSON.parse(content);
      const parts: string[] = [];
      const traverse = (node: JSONContent) => {
        if (node.type === 'text' && node.text) parts.push(node.text);
        node.content?.forEach(traverse);
      };
      traverse(json);
      text = parts.join(' ');
    } catch {
      text = content;
    }
  } else {
    text = content.replace(/[#*_`~\[\](){}|>!]|-{3,}|={3,}|\n/g, ' ');
  }
  text = text.replace(/\s+/g, ' ').trim();
  return text.length > maxLen ? text.slice(0, maxLen).replace(/\s+\S*$/, '') + '…' : text;
}

// ─── Main renderer component ─────────────────────────────────────────────────

interface NovelRendererProps {
  content: string;
  contentType?: 'markdown' | 'novel';
  className?: string;
}

const NovelRenderer: React.FC<NovelRendererProps> = ({
  content,
  contentType = 'markdown',
  className = '',
}) => {
  const html = useMemo(() => {
    if (contentType !== 'novel') return null;
    try {
      const json: JSONContent = JSON.parse(content);
      return generateHTML(json, RENDER_EXTENSIONS);
    } catch {
      return `<p>${content}</p>`;
    }
  }, [content, contentType]);

  if (contentType === 'novel' && html) {
    return (
      <div
        className={`novel-content ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // Fallback: Markdown renderer for legacy content
  return (
    <div data-color-mode="dark" className={className}>
      <MDEditor.Markdown
        source={content}
        style={{ background: 'transparent', color: '#e5e7eb', fontSize: 15, lineHeight: 1.7 }}
      />
    </div>
  );
};

export default NovelRenderer;
