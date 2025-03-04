'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Image src="/2.png" alt="Ainu" width={40} height={40} className="rounded-full" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Ainu</h1>
            <p className="text-indigo-100 text-sm">Your Intelligent Companion</p>
          </div>
        </div>
      </header>

      {/* Messages Area - Takes full available height */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              <p className="text-lg">Start a conversation with Ainu!</p>
              <p className="text-sm mt-2">Powered by Khaya Ijaz <br /> CFO - Anam Naheed</p>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-full md:max-w-full p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-800 shadow-md'
                }`}
              >
                <ReactMarkdown
                  
                  components={{
                    code({node, inline, className, children, ...props}) {
                      return (
                        <code
                          className={`${className} ${
                            inline
                              ? 'bg-gray-100 px-1 rounded'
                              : 'block bg-gray-100 p-2 overflow-x-auto rounded-md mt-2'
                          }`}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl shadow-md">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-100" />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Sticky Input Area */}
      <footer className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t p-4 shadow-lg">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 md:gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Ainu anything..."
              className="flex-1 p-3 md:p-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 text-white p-3 md:p-4 rounded-full hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 shadow-md"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
}