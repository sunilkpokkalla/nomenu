"use client";

import { useChat } from 'ai/react';
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Maximize2, Paperclip, QrCode } from 'lucide-react';

// Helper functions to parse and clean suggestions from the LLM stream
const cleanSuggestions = (content: string) => {
  return content.replace(/<suggestions>[\s\S]*?<\/suggestions>/, '').trim();
};

const extractSuggestions = (content: string) => {
  const match = content.match(/<suggestions>([\s\S]*?)<\/suggestions>/);
  if (!match) return [];
  return match[1]
    .split('\n')
    .map(line => line.replace(/^-\s*/, '').trim())
    .filter(line => line.length > 0);
};

export function DemoChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lead capture states
  const [emailInput, setEmailInput] = useState("");
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);

  // Check if lead email is already saved on this device
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('nomi_lead_email');
      if (savedEmail) {
        setIsEmailSubmitted(true);
      }
    }
  }, []);

  // Handle lead submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;

    setIsSubmittingEmail(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('nomi_lead_email', emailInput);
        setIsEmailSubmitted(true);
      }
    } catch (err) {
      console.error("Failed to submit lead email", err);
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickReplies = [
    "How does NoMenu save me money?",
    "How does the 0% platform fee work?",
    "Is there a completely free plan?",
  ];

  return (
    <>
      {/* Inline Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-indigo-600 border border-indigo-500 rounded-xl p-8 flex flex-col items-center justify-center text-white min-h-[200px] shadow-xl relative overflow-hidden hover:bg-indigo-700 transition-colors group"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none" />
        <Bot className="w-12 h-12 text-indigo-200 mb-4 group-hover:scale-110 transition-transform duration-300" />
        <h4 className="text-xl font-black mb-1 z-10">NoMenu Platform Assistance</h4>
        <p className="text-sm font-medium text-indigo-200 z-10">Chat with NoMi, our AI Assistant</p>
        <div className="mt-4 px-4 py-1.5 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-white/10">
          Available 24/7
        </div>
      </button>

      {/* Floating Wrapper in Corner */}
      <div 
        className={`fixed inset-0 pointer-events-none z-50 flex items-end justify-end p-6 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Chat Window */}
        <div 
          className={`pointer-events-auto w-[400px] max-w-[calc(100vw-2rem)] h-[640px] max-h-[calc(100vh-2rem)] bg-white rounded-[24px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0 pointer-events-none'}`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white px-5 py-4 flex items-center justify-between shrink-0 border-b border-indigo-950/20 relative overflow-hidden">
            {/* Subtle glow line at top */}
            <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-40" />
            
            <div className="flex items-center gap-3 z-10">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/20 relative">
                <QrCode className="w-5 h-5 text-indigo-400" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-wide text-indigo-50">NoMenu AI Assistant</span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-indigo-300 font-medium">Product Expert</span>
                  <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                  <span className="text-[10px] text-emerald-400 font-medium">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 z-10">
              <button 
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors"
                title="Expand"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area / Lead Capture Form */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col bg-white">
            {!isEmailSubmitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8 my-auto">
                <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 border border-indigo-500/20 relative">
                  <Sparkles className="w-6 h-6 text-indigo-500" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Chat with NoMenu AI</h3>
                <p className="text-sm text-slate-500 font-medium mb-6 max-w-[280px]">
                  Enter your email address to unlock real-time pricing and consultation with our AI Assistant.
                </p>
                <form onSubmit={handleEmailSubmit} className="w-full max-w-[280px] space-y-3">
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-150 rounded-xl text-sm transition-all outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingEmail || !emailInput.trim() || !emailInput.includes('@')}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-indigo-100 hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmittingEmail ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <span>Start Chatting</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-5">
                {messages.length === 0 ? (
                  <div className="flex flex-col gap-4">
                    {/* Default Greeting aligned exactly like the screenshot */}
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 bg-[#e0f2fe] rounded-full flex items-center justify-center shrink-0 border border-sky-100">
                        <Bot className="w-5 h-5 text-[#0c2340]" />
                      </div>
                      <div className="bg-[#f3f4f6] text-slate-800 p-4 rounded-[18px] rounded-tl-none text-sm leading-relaxed max-w-[85%] font-medium">
                        Hi, I'm NoMi! 👋 I'm here to help you find the perfect NoMenu plan for your restaurant.
                      </div>
                    </div>

                    {/* Quick replies in beautiful pill list */}
                    <div className="pl-11 flex flex-col gap-2 w-full max-w-[85%]">
                      {quickReplies.map((reply) => (
                        <button
                          key={reply}
                          onClick={() => append({ role: 'user', content: reply })}
                          className="text-xs text-indigo-600 bg-white border border-indigo-200 py-2 px-3 rounded-lg hover:bg-indigo-50 transition-colors text-left font-medium shadow-sm"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map(m => (
                    <div key={m.id} className={`flex gap-3 items-start ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-[#e0f2fe] border border-sky-100 text-[#0c2340]'}`}>
                        {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`p-4 rounded-[18px] max-w-[85%] text-sm leading-relaxed ${m.role === 'user' ? 'bg-[#0c2340] text-white rounded-tr-none' : 'bg-[#f3f4f6] text-slate-800 rounded-tl-none font-medium'}`}>
                        {m.role === 'assistant' ? cleanSuggestions(m.content) : m.content}
                      </div>
                    </div>
                  ))
                )}
                
                {/* Dynamic Follow-up Suggestions */}
                {!isLoading && messages.length > 0 && (
                  (() => {
                    const lastMsg = messages[messages.length - 1];
                    if (lastMsg.role === 'assistant') {
                      const suggestions = extractSuggestions(lastMsg.content);
                      if (suggestions.length > 0) {
                        return (
                          <div className="pl-11 flex flex-col gap-2 w-full max-w-[85%] animate-fade-in">
                            {suggestions.map((reply) => (
                              <button
                                key={reply}
                                onClick={() => append({ role: 'user', content: reply })}
                                className="text-xs text-indigo-600 bg-white border border-indigo-200 py-2 px-3 rounded-lg hover:bg-indigo-50 transition-colors text-left font-medium shadow-sm"
                              >
                                {reply}
                              </button>
                            ))}
                          </div>
                        );
                      }
                    }
                    return null;
                  })()
                )}

                {isLoading && (
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-[#e0f2fe] border border-sky-100 text-[#0c2340] flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="p-3 rounded-[18px] bg-[#f3f4f6] text-slate-400 rounded-tl-none text-sm flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area & Footer */}
          {isEmailSubmitted && (
            <div className="px-5 pb-4 pt-2 bg-white shrink-0">
              <form onSubmit={handleSubmit} className="relative flex items-center mb-3">
                <div className="w-full relative flex items-center border border-slate-300 rounded-full bg-white hover:border-slate-400 focus-within:border-slate-500 focus-within:ring-1 focus-within:ring-slate-500 transition-all px-4 py-2.5">
                  <input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask me anything..."
                    className="w-full pr-16 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm placeholder-slate-400 text-slate-800"
                  />
                  <div className="absolute right-3 flex items-center gap-2">
                    <button
                      type="button"
                      className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                      title="Attach file"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="p-1.5 text-slate-400 hover:text-[#0c2340] disabled:opacity-30 transition-colors"
                      title="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </form>
              <div className="text-[10px] text-slate-500 text-center font-medium">
                Spam protection enabled; AI-generated content may be inaccurate.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
