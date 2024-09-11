import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { debounce } from 'lodash';

const TiptapEditor = forwardRef(({ initialContent = '' }, ref) => {
  const [editorContent, setEditorContent] = useState('');
  const [highlightWord, setHighlightWord] = useState('');

  const highlightWords = useCallback(
    debounce((editor, word) => {
      if (!word.trim()) return;

      const { from, to } = editor.state.selection;
      const regex = new RegExp(`\\b${word}\\b`, 'gi');

      editor.state.doc.nodesBetween(0, editor.state.doc.content.size, (node, pos) => {
        if (node.isText) {
          const text = node.text;
          let match;
          while ((match = regex.exec(text)) !== null) {
            const start = pos + match.index;
            const end = start + match[0].length;
            editor
              .chain()
              .setTextSelection({ from: start, to: end })
              .setColor('#0000FF')
              .toggleUnderline()
              .run();
          }
        }
      });

      // Restore the original selection
      editor.commands.setTextSelection({ from, to });
    }, 100),
    []
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color.configure({ types: [TextStyle.name] }),
      Underline,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none p-4',
      },
    },
  });

  useImperativeHandle(ref, () => ({
    commands: editor?.commands,
  }));

  const handleHighlight = (e) => {
    e.preventDefault();
    if (editor) {
      highlightWords(editor, highlightWord);
    }
  };

  const getContent = () => {
    console.log(editorContent);
    alert(editorContent);
  };

  const changeTextColor = () => {
    editor.chain().focus().setColor('#ff0000').run();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="w-[800px] mx-auto">
      <div className="border border-black bg-white p-4" style={{ minHeight: '60vh' }}>
        <EditorContent 
          editor={editor} 
          className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none"
        />
      </div>
      <div className="mt-4">
        <form onSubmit={handleHighlight} className="flex gap-2">
          <input
            type="text"
            value={highlightWord}
            onChange={(e) => setHighlightWord(e.target.value)}
            placeholder="Enter word(s) to highlight"
            className="flex-grow p-2 border rounded"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Highlight
          </button>
        </form>
      </div>
      <div className="mt-4">
        <button onClick={getContent} className="mr-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Get Content
        </button>
        <button onClick={changeTextColor} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Change Text Color to Red
        </button>
      </div>
    </div>
  );
});

export default TiptapEditor;
