import { useState, useEffect, useRef } from 'react';
import Layout from "./Layout";
import TiptapEditor from "./components/TipTapEditor";

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const eventSourceRef = useRef(null);
  const editorRef = useRef(null);
  const bufferRef = useRef('');
  const emptyDataCountRef = useRef(0);  // Add this line

  const handleSubmit = (e) => {
    e.preventDefault();
    setResponse('');
    bufferRef.current = '';
    emptyDataCountRef.current = 0;  // Reset the counter

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    eventSourceRef.current = new EventSource(`http://localhost:5000/api/aigen?prompt=${encodeURIComponent(prompt)}`);

    eventSourceRef.current.onmessage = (event) => {
      console.log('Received data:', event.data);
      if (event.data === '[DONE]') {
        eventSourceRef.current.close();
        // Insert any remaining content in the buffer
        if (bufferRef.current.trim()) {
          insertContent(bufferRef.current);
          bufferRef.current = '';
        }
        emptyDataCountRef.current = 0;  // Reset the counter
      } else if (event.data.trim() === '') {
        emptyDataCountRef.current++;  // Increment the counter
        if (emptyDataCountRef.current >= 2) {
          // Two consecutive empty data received, insert a line break
          insertContent('<br /><br />');
          emptyDataCountRef.current = 0;  // Reset the counter
        }
      } else {
        setResponse(prev => prev + event.data);
        bufferRef.current += event.data;
        if (bufferRef.current.trim()) {
          insertContent(bufferRef.current);
          bufferRef.current = '';
        }
        emptyDataCountRef.current = 0;  // Reset the counter on non-empty data
      }
    };

    eventSourceRef.current.onerror = (error) => {
      console.error('EventSource error:', error);
      if (eventSourceRef.current.readyState === EventSource.CLOSED) {
        console.log('EventSource connection closed.');
      } else {
        eventSourceRef.current.close();
      }
    };
  };

  const insertContent = (content) => {
    if (editorRef.current && content) {
      editorRef.current.commands.insertContent(content);
    }
  };

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">AI Chat</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt"
            className="w-full p-2 border rounded text-black"
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
        <TiptapEditor ref={editorRef} initialContent="" />
      </div>
    </Layout>
  )
}