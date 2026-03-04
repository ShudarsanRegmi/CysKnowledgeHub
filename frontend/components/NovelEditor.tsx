import React, { useState } from 'react';
import { EditorRoot, EditorContent, StarterKit } from 'novel';
import type { JSONContent } from 'novel';
import {
  ChevronDown, ChevronUp, Lightbulb,
  Slash, Bold, Italic, Code2, Quote, Minus,
} from 'lucide-react';

const TIPS = [
  {
    icon: Slash,
    iconColor: 'text-violet-400',
    iconBg: 'bg-violet-500/10 border-violet-500/20',
    key: '/',
    label: 'Slash command',
    desc: 'Open the block menu — insert headings, lists, images, code blocks and more',
    accent: 'hover:border-violet-500/30',
  },
  {
    icon: Bold,
    iconColor: 'text-sky-400',
    iconBg: 'bg-sky-500/10 border-sky-500/20',
    key: 'Ctrl+B',
    label: 'Bold',
    desc: 'Select text and press Ctrl+B, or wrap it in **double asterisks**',
    accent: 'hover:border-sky-500/30',
  },
  {
    icon: Italic,
    iconColor: 'text-pink-400',
    iconBg: 'bg-pink-500/10 border-pink-500/20',
    key: 'Ctrl+I',
    label: 'Italic',
    desc: 'Select text and press Ctrl+I, or wrap it in _underscores_',
    accent: 'hover:border-pink-500/30',
  },
  {
    icon: Code2,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    key: '```',
    label: 'Code block',
    desc: 'Type ``` on a new line to start a fenced code block',
    accent: 'hover:border-emerald-500/30',
  },
  {
    icon: Quote,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    key: '>',
    label: 'Blockquote',
    desc: 'Start a line with > to turn it into a styled quote block',
    accent: 'hover:border-amber-500/30',
  },
  {
    icon: Minus,
    iconColor: 'text-gray-400',
    iconBg: 'bg-gray-500/10 border-gray-600/30',
    key: '---',
    label: 'Divider',
    desc: 'Type --- on its own line to insert a horizontal rule',
    accent: 'hover:border-gray-600/40',
  },
];

interface NovelEditorProps {
  initialContent?: JSONContent | null;
  onChange: (content: JSONContent) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Wrapper around Novel.sh editor using EditorRoot + EditorContent compound API.
 * Stores content as Tiptap JSONContent (serialised to JSON string in parent).
 */
const NovelEditor: React.FC<NovelEditorProps> = ({
  initialContent,
  onChange,
  placeholder = 'Start writing…',
  disabled = false,
  className = '',
}) => {
  const [guideOpen, setGuideOpen] = useState(false);

  if (disabled) {
    return (
      <div className={`relative rounded-xl border border-gray-700 bg-gray-900 min-h-64 px-6 py-4 opacity-60 pointer-events-none ${className}`}>
        <p className="text-gray-500 text-sm italic">Content locked – article is not in an editable state.</p>
      </div>
    );
  }

  return (
    <div className={`novel-editor-wrapper relative rounded-xl border border-gray-700 bg-gray-900 overflow-hidden ${className}`}>

      {/* ── Quick-start guide ─────────────────────────────────────────────── */}
      <div className="border-b border-gray-800/80">

        {/* Header toggle */}
        <button
          type="button"
          onClick={() => setGuideOpen((o) => !o)}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-800/40 transition-colors group"
        >
          <div className="flex items-center justify-center w-5 h-5 rounded-md bg-amber-400/10 border border-amber-400/20 flex-shrink-0">
            <Lightbulb className="w-3 h-3 text-amber-400" />
          </div>
          <span className="text-xs font-semibold text-gray-400 group-hover:text-gray-200 transition-colors">
            Editor tips
          </span>
          <span className="text-[11px] text-gray-600 group-hover:text-gray-500 transition-colors">
            — press <kbd className="font-mono bg-gray-800 border border-gray-700 text-violet-400 rounded px-1 py-px">/</kbd> anywhere to open the block menu
          </span>
          <div className="ml-auto flex items-center gap-1.5 text-[10px] text-gray-600 group-hover:text-gray-500 transition-colors flex-shrink-0">
            {guideOpen ? (
              <>hide <ChevronUp className="w-3 h-3" /></>
            ) : (
              <><span className="hidden sm:inline">show all</span> <ChevronDown className="w-3 h-3" /></>
            )}
          </div>
        </button>

        {/* Expanded tips grid */}
        {guideOpen && (
          <div className="px-4 pb-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {TIPS.map(({ icon: Icon, iconColor, iconBg, key, label, desc, accent }) => (
                <div
                  key={key}
                  className={`flex items-start gap-3 p-3 rounded-xl bg-gray-800/40 border border-gray-800 ${accent} transition-colors`}
                >
                  <div className={`w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                    <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-semibold text-gray-200">{label}</span>
                      <kbd className={`font-mono text-[10px] bg-gray-900 border border-gray-700 rounded px-1.5 py-px ${iconColor}`}>
                        {key}
                      </kbd>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-3 text-[11px] text-gray-600 text-center">
              More shortcuts available via the <kbd className="font-mono bg-gray-800 border border-gray-700 text-violet-400 rounded px-1">/</kbd> command menu inside the editor
            </p>
          </div>
        )}
      </div>

      <EditorRoot>
        <EditorContent
          initialContent={initialContent ?? undefined}
          extensions={[StarterKit]}
          editorProps={{
            attributes: {
              class: 'prose prose-invert prose-sm max-w-none focus:outline-none px-8 py-6 min-h-[384px] text-gray-100',
            },
          }}
          onUpdate={({ editor }) => {
            onChange(editor.getJSON() as JSONContent);
          }}
        />
      </EditorRoot>
    </div>
  );
};

export default NovelEditor;
