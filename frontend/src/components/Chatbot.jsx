import React, { useState, useRef, useEffect } from 'react';

export default function Chatbot() {
  // History starts empty now. No more fake data.
  const [chatHistory, setChatHistory] = useState([]);
  
  const [currentSessionId, setCurrentSessionId] = useState('new');
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello. I am Allo, your allocation engine. How can I assist you with your career placement today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll mechanism
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => scrollToBottom(), [messages]);

  // Handle sending a message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    // DYNAMIC HISTORY CREATION: If this is a new session, create the sidebar entry
    if (currentSessionId === 'new') {
      const newSessionId = Date.now().toString(); // Generate unique ID
      const newTitle = userMsg.length > 22 ? userMsg.substring(0, 22) + '...' : userMsg;
      
      setChatHistory(prev => [
        { id: newSessionId, title: newTitle, date: 'Just now', pinned: false },
        ...prev
      ]);
      setCurrentSessionId(newSessionId); // Lock the session so subsequent messages don't spawn new chats
    }

    try {
      // TODO: Connect to your actual AI engine route
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          content: "I am analyzing your query. Please connect my neural link to a real LLM endpoint to receive dynamic responses." 
        }]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error("Chat failure:", error);
      setIsTyping(false);
    }
  };

  // History Actions
  const loadChat = (id) => {
    setCurrentSessionId(id);
    // In reality, fetch messages for this ID from your backend.
    setMessages([{ role: 'ai', content: `Loading historical data for session ${id}...` }]);
  };

  const startNewChat = () => {
    if (currentSessionId === 'new' && messages.length <= 1) return; // Prevent spamming "New Chat" if already empty
    setCurrentSessionId('new');
    setMessages([{ role: 'ai', content: "New session initialized. How can I assist you?" }]);
  };

  const togglePin = (id, e) => {
    e.stopPropagation(); 
    setChatHistory(prev => prev.map(chat => 
      chat.id === id ? { ...chat, pinned: !chat.pinned } : chat
    ));
  };

  const deleteChat = (id, e) => {
    e.stopPropagation();
    setChatHistory(prev => prev.filter(chat => chat.id !== id));
    if (currentSessionId === id) startNewChat();
  };

  // Sorting history: Pinned first
  const sortedHistory = [...chatHistory].sort((a, b) => (b.pinned === a.pinned) ? 0 : b.pinned ? 1 : -1);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto h-[80vh] flex flex-col md:flex-row gap-6 animate-fade-in relative z-10">
      
      {/* LEFT PANE: Chat History Sidebar */}
      <div className="w-full md:w-72 shrink-0 bg-white/60 backdrop-blur-xl border border-white shadow-sm rounded-3xl flex flex-col overflow-hidden h-48 md:h-full">
        
        <div className="p-4 border-b border-white/50">
          <button 
            onClick={startNewChat}
            className="w-full bg-[#6b9b8e] hover:bg-[#5a867a] text-white px-4 py-3 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-between"
          >
            <span>New Chat</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {sortedHistory.length === 0 ? (
            <div className="text-center p-6 text-xs font-bold text-slate-400 mt-4">
              <svg className="w-8 h-8 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              No active sessions.
            </div>
          ) : (
            sortedHistory.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => loadChat(chat.id)}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                  currentSessionId === chat.id 
                    ? 'bg-white shadow-sm border border-slate-200/50' 
                    : 'hover:bg-white/40'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <svg className={`w-4 h-4 shrink-0 ${chat.pinned ? 'text-amber-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                  <span className={`text-sm font-bold truncate ${currentSessionId === chat.id ? 'text-[#6b9b8e]' : 'text-slate-600'}`}>
                    {chat.title}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 bg-gradient-to-l from-white via-white to-transparent pl-2">
                  <button onClick={(e) => togglePin(chat.id, e)} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-amber-500 transition-colors">
                    <svg className="w-3.5 h-3.5" fill={chat.pinned ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                  </button>
                  <button onClick={(e) => deleteChat(chat.id, e)} className="p-1.5 hover:bg-red-50 rounded-md text-slate-400 hover:text-red-500 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT PANE: Active Chat Window */}
      <div className="flex-1 flex flex-col min-w-0">
        
        <div className="border-b border-white/30 pb-4 shrink-0 hidden md:block">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Allo Terminal</h1>
          <p className="text-slate-600 text-sm font-medium">Session ID: {currentSessionId}</p>
        </div>

        <div className="flex-1 overflow-y-auto py-6 space-y-6 scrollbar-hide">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                <div className={`w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-xl flex items-center justify-center font-black text-xs md:text-sm border shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-slate-800 text-white border-slate-700' 
                    : 'bg-[#6b9b8e] text-white border-[#5a867a]'
                }`}>
                  {msg.role === 'user' ? 'U' : 'A'}
                </div>

                <div className={`p-4 rounded-2xl shadow-sm text-sm font-medium leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-white text-slate-800 border border-slate-200 rounded-tr-sm'
                    : 'bg-white/60 backdrop-blur-md text-slate-800 border border-white/60 rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>

              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-4 max-w-[80%] flex-row">
                <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-black text-sm bg-[#6b9b8e] text-white border border-[#5a867a] shadow-sm">
                  A
                </div>
                <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/60 rounded-tl-sm flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-[#6b9b8e] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#6b9b8e] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-[#6b9b8e] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="shrink-0 pt-4">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Transmit prompt to engine..."
              className="w-full bg-white/80 backdrop-blur-xl border border-white shadow-sm text-slate-800 px-6 py-4 rounded-2xl pr-16 focus:outline-none focus:ring-2 focus:ring-[#6b9b8e]/50 transition-all font-medium"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2.5 bg-[#6b9b8e] hover:bg-[#5a867a] text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}