import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Chatbot() {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState('new');
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello. I am Allo, your allocation engine. Upload your resume or type a query to begin." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => scrollToBottom(), [messages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf' || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
        setSelectedFile(file);
      } else {
        alert("Engine Warning: Only PDF or Word documents are supported for resume analysis.");
        e.target.value = null; 
      }
    }
  };

  // --- Handle the Application Process ---
  const handleApply = async (jobId, jobTitle, companyName) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Engine Error: You must be logged in to request allocation.");
        return;
      }

      const response = await fetch('http://localhost:5000/api/applications/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ internshipId: jobId })
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ SUCCESS: Your profile has been transmitted to ${companyName} for the ${jobTitle} pipeline.`);
      } else {
        alert(`❌ FAILED: ${data.message}`);
      }
    } catch (error) {
      console.error("Application transmission failure:", error);
      alert("Fatal Error: Could not connect to the allocation server.");
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return;

    const userMsg = input.trim();
    const fileInfo = selectedFile ? `[Attached File: ${selectedFile.name}]` : "";
    const displayMsg = [userMsg, fileInfo].filter(Boolean).join(" ");

    setMessages(prev => [...prev, { role: 'user', content: displayMsg }]);
    setInput('');
    setIsTyping(true);

    const fileToSend = selectedFile;
    
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = null;

    if (currentSessionId === 'new') {
      const newSessionId = Date.now().toString();
      const newTitle = userMsg.length > 22 ? userMsg.substring(0, 22) + '...' : (fileToSend ? 'Resume Analysis' : 'New Session');
      
      setChatHistory(prev => [
        { id: newSessionId, title: newTitle, date: 'Just now', pinned: false },
        ...prev
      ]);
      setCurrentSessionId(newSessionId);
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Authentication missing.");

      const formData = new FormData();
      formData.append('prompt', userMsg || "Please analyze my attached resume.");
      if (fileToSend) {
        formData.append('resume', fileToSend);
      }

      const response = await fetch('http://localhost:5000/api/engine/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        const aiData = JSON.parse(data.reply); 
        setMessages(prev => [...prev, { 
          role: 'ai', 
          content: aiData.analysis, 
          matches: aiData.matches   
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: `Error: ${data.message}` }]);
      }
    } catch (error) {
      console.error("Chat failure:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "Connection to the engine severed. Check network logs." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const loadChat = (id) => {
    setCurrentSessionId(id);
    setMessages([{ role: 'ai', content: `Loading historical data for session ${id}...` }]);
  };

  const startNewChat = () => {
    if (currentSessionId === 'new' && messages.length <= 1) return;
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

  const sortedHistory = [...chatHistory].sort((a, b) => (b.pinned === a.pinned) ? 0 : b.pinned ? 1 : -1);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto h-[80vh] flex flex-col md:flex-row gap-6 animate-fade-in relative z-10">
      
      {/* LEFT PANE */}
      <div className="w-full md:w-72 shrink-0 bg-white/60 backdrop-blur-xl border border-white shadow-sm rounded-3xl flex flex-col overflow-hidden h-48 md:h-full">
        <div className="p-4 border-b border-white/50">
          <button onClick={startNewChat} className="w-full bg-[#6b9b8e] hover:bg-[#5a867a] text-white px-4 py-3 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-between">
            <span>New Chat</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {sortedHistory.length === 0 ? (
            <div className="text-center p-6 text-xs font-bold text-slate-400 mt-4">
              No active sessions.
            </div>
          ) : (
            sortedHistory.map((chat) => (
              <div key={chat.id} onClick={() => loadChat(chat.id)} className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${currentSessionId === chat.id ? 'bg-white shadow-sm border border-slate-200/50' : 'hover:bg-white/40'}`}>
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className={`text-sm font-bold truncate ${currentSessionId === chat.id ? 'text-[#6b9b8e]' : 'text-slate-600'}`}>{chat.title}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={(e) => togglePin(chat.id, e)} className="p-1.5 text-slate-400 hover:text-amber-500">P</button>
                  <button onClick={(e) => deleteChat(chat.id, e)} className="p-1.5 text-slate-400 hover:text-red-500">X</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT PANE */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="border-b border-white/30 pb-4 shrink-0 hidden md:block">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Allo Terminal</h1>
          <p className="text-slate-600 text-sm font-medium">Session ID: {currentSessionId}</p>
        </div>

        <div className="flex-1 overflow-y-auto py-6 space-y-6 scrollbar-hide pb-32">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center font-black text-xs border shadow-sm ${msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-[#6b9b8e] text-white'}`}>
                  {msg.role === 'user' ? 'U' : 'A'}
                </div>
                <div className={`p-4 rounded-2xl shadow-sm text-sm font-medium leading-relaxed ${msg.role === 'user' ? 'bg-white text-slate-800 border' : 'bg-white/60 backdrop-blur-md text-slate-800 border border-white/60'}`}>
                  {msg.role === 'ai' ? (
                    <div className="flex flex-col gap-4">
                      <div className="prose prose-sm max-w-none prose-headings:text-[#6b9b8e] prose-headings:font-bold prose-headings:mt-4 prose-headings:mb-2 prose-strong:text-slate-900">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>

                      {msg.matches && msg.matches.length > 0 && (
                        <div className="flex flex-col gap-3 mt-2 border-t border-slate-200/50 pt-4">
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Available Pipelines</h4>
                          {msg.matches.map((job, jIdx) => (
                            <div key={jIdx} className="bg-white border border-[#6b9b8e]/40 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-3">
                              
                              {/* Header: Title, Company, and Score */}
                              <div className="flex justify-between items-start gap-4 border-b border-slate-100 pb-3">
                                <div className="flex-1">
                                  <h3 className="font-bold text-slate-900 text-base leading-tight">
                                    {job.title || "Undisclosed Role"}
                                  </h3>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <svg className="w-3.5 h-3.5 text-[#6b9b8e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                    <p className="text-xs font-bold text-[#6b9b8e] uppercase tracking-wide">
                                      {job.company || "Unknown Enterprise"}
                                    </p>
                                  </div>
                                </div>
                                <span className="bg-[#e2f1ec] text-[#5a867a] text-xs font-black px-2.5 py-1 rounded-md shrink-0 border border-[#6b9b8e]/20 shadow-sm">
                                  {job.matchScore}% Match
                                </span>
                              </div>
                              
                              {/* Body: Reason Text Area */}
                              <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                                <p className="text-sm text-slate-600 leading-relaxed">
                                  <span className="font-bold text-slate-800 mr-1">Engine Note:</span> 
                                  {job.reason}
                                </p>
                              </div>
                              
                              {/* Footer: Action Button */}
                              <button 
                                onClick={() => handleApply(job.id, job.title, job.company)}
                                className="mt-1 w-full bg-slate-800 hover:bg-[#6b9b8e] text-white font-bold py-2.5 rounded-lg text-sm transition-colors shadow-sm flex justify-center items-center gap-2 active:scale-[0.98]"
                              >
                                <span>Request Allocation</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span>{msg.content}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* THE RESTORED TYPING INDICATOR */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-4 max-w-[80%] flex-row">
                <div className="w-8 h-8 shrink-0 rounded-xl flex items-center justify-center font-black text-xs border shadow-sm bg-[#6b9b8e] text-white">A</div>
                <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/60 shadow-sm flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-[#6b9b8e] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#6b9b8e] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-[#6b9b8e] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="absolute bottom-0 left-0 right-0 pt-4 pb-2 bg-gradient-to-t from-[#e2f1ec] via-[#e2f1ec] to-transparent">

          {selectedFile && (
            <div className="mb-2 ml-2 flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-[#6b9b8e]/30 px-3 py-1.5 rounded-lg w-fit shadow-sm animate-fade-in">
              <svg className="w-4 h-4 text-[#6b9b8e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <span className="text-xs font-bold text-slate-700 truncate max-w-[200px]">{selectedFile.name}</span>
              <button onClick={() => { setSelectedFile(null); if(fileInputRef.current) fileInputRef.current.value = null; }} className="text-slate-400 hover:text-red-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          )}
          <form onSubmit={handleSend} className="relative flex items-center bg-white/80 backdrop-blur-xl border border-white shadow-sm rounded-2xl pr-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".pdf,.doc,.docx" 
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="p-4 text-slate-400 hover:text-[#6b9b8e] transition-colors"
            >
              📎
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Transmit prompt or attach resume..."
              className="flex-1 bg-transparent text-slate-800 py-4 focus:outline-none font-medium placeholder-slate-400"
            />
            <button 
              type="submit"
              disabled={(!input.trim() && !selectedFile) || isTyping}
              className="p-2.5 bg-[#6b9b8e] hover:bg-[#5a867a] text-white rounded-xl disabled:opacity-50 my-1 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}