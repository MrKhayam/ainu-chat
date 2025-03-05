'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

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

  // Updated function to parse DeepSeek response with <think> tags
  const formatDeepSeekResponse = (content) => {
    const thinkingRegex = /<think>(.*?)<\/think>/s;
    const match = content.match(thinkingRegex);
    
    if (match) {
      const thinkingPart = match[1].trim();
      const answerPart = content.replace(thinkingRegex, '').trim();
      
      return (
        <div className="space-y-4">
          {thinkingPart && (
            <div className="bg-gray-100 p-3 rounded-xl">
              <span className="font-semibold text-gray-600 block mb-1">Thinking:</span>
              <ReactMarkdown components={markdownComponents}>
                {thinkingPart}
              </ReactMarkdown>
            </div>
          )}
          {answerPart && (
            <div className="bg-indigo-50 p-3 rounded-xl border-l-4 border-indigo-500">
              <span className="font-semibold text-indigo-700 block mb-1">Answer:</span>
              <ReactMarkdown components={markdownComponents}>
                {answerPart}
              </ReactMarkdown>
            </div>
          )}
        </div>
      );
    }
    return <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>;
  };

  // Custom components for ReactMarkdown to handle formatted text
  const markdownComponents = {
    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-indigo-800 mt-4 mb-2" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-indigo-700 mt-3 mb-2" {...props} />,
    p: ({ node, ...props }) => <p className="text-gray-800 mb-3 leading-relaxed" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 text-gray-800" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 text-gray-800" {...props} />,
    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
    strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
    em: ({ node, ...props }) => <em className="italic" {...props} />,
    a: ({ node, ...props }) => (
      <a className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
    ),
    blockquote: ({ node, ...props }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-3" {...props} />
    ),
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          className="rounded-lg shadow-md overflow-x-auto text-sm"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-gray-100 px-1 rounded text-sm" {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-gradient-to-br from-indigo-50  via-white to-purple-50">
      {/* Header */}
      <header className=" p-2 bg-transparent w-max">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Image src="/2.png" alt="Ainu" width={40} height={40} className="rounded-full" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-black">Ainu</h1>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              <h1 className='text-7xl text-black font-bold'>AINU</h1>
              <p className="text-3xl">Start a conversation with Ainu!</p>
              <p className="text-sm mt-2">Founded by Khayam Ijaz <br /> CFO - Anam Naheed</p>
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
                className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-[#dadada] text-gray-800 shadow-md max-w-[85%] md:max-w-[70%]'
                    : 'bg-white text-gray-800 shadow-md max-w-full'
                }`}
              >
                {message.role === 'assistant' ? (
                  formatDeepSeekResponse(message.content)
                ) : (
                  <ReactMarkdown components={markdownComponents}>
                    {message.content}
                  </ReactMarkdown>
                )}
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
      <footer className="sticky bottom-0 bg-white border-t p-4 shadow-lg">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 md:gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Ainu anything..."
              className="flex-1 p-3 md:p-4 rounded-full border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#414141] bg-white/50"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-black text-white p-3 md:p-4 rounded-full hover:bg-[#0e0e0e] cursor-pointer transition-colors disabled:bg-indigo-400 shadow-md"
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