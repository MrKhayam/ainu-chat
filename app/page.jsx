"use client";

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [...prev, { role: 'bot', content: data.error }]);
      } else {
        setMessages((prev) => [...prev, { role: 'bot', content: data.reply }]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: 'Error connecting to Ainu' },
      ]);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      {/* Header */}
      <header className="p-6 bg-gray-900/80 backdrop-blur-md border-b border-gray-700">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-cyan-400">Ainu</span> <span className="text-gray-400">— Your Cosmic Companion</span>
        </h1>
      </header>

      {/* Chat Area */}
      <main className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto w-full">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 italic animate-pulse">
              Start a conversation with Ainu... <br /> Powered by Khayam Ijaz <br /> CFO - Anam Naheed
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div
                  className={`max-w-xl p-4 rounded-lg shadow-lg ${
                    msg.role === 'user'
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  {msg.role === 'bot' ? (
                    <ReactMarkdown
                      components={{
                        h1: ({ node, ...props }) => (
                          <h1 className="text-xl font-bold mt-2 mb-1" {...props} />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2 className="text-lg font-bold mt-2 mb-1" {...props} />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong className="font-bold" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul className="list-disc pl-5 my-1" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol className="list-decimal pl-5 my-1" {...props} />
                        ),
                        p: ({ node, ...props }) => (
                          <p className="my-1" {...props} />
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    <span>{msg.content}</span>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="md:p-6 bg-gray-900/80 p-2 overflow-hidden backdrop-blur-md border-t border-gray-700">
        <form onSubmit={sendMessage} className="md:max-w-4xl overflow-hidden w-full mx-auto flex items-center justify-center gap-1 md:gap-3 sm:gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 md:p-3 p-2 sm:p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none"
            placeholder="Ask Ainu anything..."
          />
          <button
            type="submit"
            className="md:px-6 md:py-3 px-3 sm:py-3 py-2 sm:px-5 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Send
          </button>
        </form>
      </footer>

      {/* Custom Animation Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}