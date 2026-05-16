import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Bot, User, Sparkles, Wand2, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "model";
  parts: [{ text: string }];
}

export default function AICoach() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", parts: [{ text: input }] };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: messages
        })
      });
      const data = await response.json();
      const aiMsg: Message = { role: "model", parts: [{ text: data.text }] };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] p-8 max-w-5xl mx-auto">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-900 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <Bot className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Nourish AI</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Coach is Online</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setMessages([])}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Clear History
        </button>
      </header>

      <div className="flex-1 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/60 shadow-2xl overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 relative z-10">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-12">
              <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                <Sparkles className="text-emerald-600 w-10 h-10" />
              </div>
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-3 tracking-tight">Ask your Coach anything</h2>
              <p className="text-slate-500 max-w-md leading-relaxed font-medium">
                Need a quick healthy recipe? Want to know if your lunch is macro-balanced? Your premium AI coach is here to help.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-10 w-full max-w-lg">
                {[
                  "Suggest a high-protein dinner",
                  "Is Greek yogurt good for muscle gain?",
                  "Quick healthy snack ideas",
                  "Why do I feel tired after lunch?"
                ].map(q => (
                  <button 
                    key={q}
                    onClick={() => setInput(q)}
                    className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl text-slate-600 text-sm font-bold hover:bg-emerald-50 hover:text-emerald-700 transition-all border border-white hover:border-emerald-100 text-left flex items-start justify-between group shadow-sm uppercase tracking-tight"
                  >
                    <span>{q}</span>
                    <Wand2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <div className={`flex items-start gap-4 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center shadow-lg ${msg.role === "user" ? "bg-slate-900 text-white" : "bg-emerald-100 text-emerald-800"}`}>
                  {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`p-6 rounded-[2rem] text-sm leading-relaxed shadow-xl ${msg.role === "user" ? "bg-slate-900 text-white rounded-tr-none" : "bg-white/80 backdrop-blur-sm text-slate-800 rounded-tl-none border border-white/60"}`}>
                  <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed font-medium">
                    <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-sm animate-pulse">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-6 rounded-[2rem] bg-white/40 backdrop-blur-sm text-slate-400 text-sm rounded-tl-none border border-white/60 italic font-medium">
                Nourish is thinking...
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        <div className="p-6 bg-white/20 backdrop-blur-xl border-t border-white/40 relative z-20">
          <div className="relative max-w-4xl mx-auto">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask Nourish about your wellness..."
              className="w-full bg-white/80 border border-white rounded-[2rem] pl-6 pr-16 py-5 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all shadow-xl shadow-emerald-900/5 min-h-[60px] max-h-32 resize-none text-sm placeholder:text-slate-400 font-medium"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-emerald-900 text-white rounded-full flex items-center justify-center hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 transition-all active:scale-95 z-10 shadow-lg shadow-emerald-900/10"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-[0.2em]">
            Powered by Gemini AI • Always consult a professional for medical advice
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-[80px] -mr-32 -mt-32 opacity-50" />
      </div>

    </div>
  );
}
