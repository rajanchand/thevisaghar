"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat, type UIMessage as Message } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import { X, Send, MessageCircle, Sparkles } from "lucide-react";

const quickReplies = [
  "Student Visa",
  "Japanese Language",
  "IELTS / PTE Class",
  "Book Consultation",
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error } = useChat({
    transport: new TextStreamChatTransport({
      api: "/api/chat",
    }),
    messages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "👋 Namaste! I'm Visa Ghar AI. How can I help you with your visa questions today?",
          },
        ],
      },
    ],
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && status === "ready") {
      sendMessage({ text: input });
      setInput("");
    }
  };

  const handleQuickReply = (text: string) => {
    if (status === "ready") {
      sendMessage({ text });
    }
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[300] w-16 h-16 rounded-full bg-navy shadow-xl flex items-center justify-center group"
            aria-label="Open chat with Visa Ghar AI"
          >
            <MessageCircle className="w-7 h-7 text-gold" />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-gold/20 animate-pulse-ring" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-[300] w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-navy px-5 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Visa Ghar AI</h3>
                  <p className="text-gray-300 text-xs">Ask visa questions instantly</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message: Message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-navy text-white rounded-br-md"
                        : "bg-gray-100 text-gray-700 rounded-bl-md"
                    }`}
                  >
                    {message.parts && message.parts.length > 0
                      ? message.parts.map((part, index: number) => {
                          const p = part as { type: string; text?: string };
                          return p.type === "text" ? <span key={index}>{p.text}</span> : null;
                        })
                      : (message as { content?: string }).content}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="text-center py-2">
                  <p className="text-red-500 text-xs">Unable to connect. Please try again.</p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies (show only when few messages) */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleQuickReply(reply)}
                    className="px-3 py-1.5 bg-gold/10 text-gold-dark text-xs font-medium rounded-full hover:bg-gold/20 transition-colors border border-gold/20"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about visas..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 rounded-xl bg-navy hover:bg-navy-light text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-gray-400 text-[10px] mt-2 text-center">
                AI responses are for general guidance only. Book a consultation for specific advice.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
