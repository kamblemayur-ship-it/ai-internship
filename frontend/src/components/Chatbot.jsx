import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom'; // <--- MUST HAVE THIS
import DashboardLayout from './DashboardLayout';

export default function Chatbot() {
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('alloSessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [messages, setMessages] = useState(() => {
    const savedChat = localStorage.getItem('alloChatHistory');
    return savedChat ? JSON.parse(savedChat) : [];
  });
  
  const [appliedJobs, setAppliedJobs] = useState(() => {
    const savedJobs = localStorage.getItem('appliedJobsCache');
    return savedJobs ? JSON.parse(savedJobs) : [];
  });

  const [inputValue, setInputValue] = useState('');
  const [isAlloTyping, setIsAlloTyping] = useState(false);
  
  // NEW STATE: Tracks which job card is currently clicked to open the modal
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('alloChatHistory', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('appliedJobsCache', JSON.stringify(appliedJobs));
  }, [appliedJobs]);

  useEffect(() => {
    localStorage.setItem('alloSessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (messages.length > 0) return;

    const initializeChat = async () => {
      let firstName = 'Student'; 
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.userId) {
            const response = await fetch(`http://localhost:5000/api/users/${payload.userId}`);
            if (response.ok) {
              const data = await response.json();
              if (data.name) firstName = data.name.split(' ')[0];
            }
          }
        } catch (error) {}
      }
      setMessages([
        { id: 1, sender: 'allo', text: `Hi ${firstName}, I'm Allo! 👋 Your personal career assistant.`, time: 'Just now' },
        { id: 2, sender: 'allo', text: 'To get started, please upload your resume using the 📎 icon below, or ask me to find internships based on your profile.', time: 'Just now' }
      ]);
    };
    initializeChat();
  }, [messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAlloTyping]);

  // EXPANDED MOCK DATA: Added descriptions and requirements for the modal
  const aiGeneratedMatches = [
    { 
      id: 101, 
      role: "Frontend Developer Intern", 
      company: "InnovateTech", 
      matchScore: 98, 
      stipend: "₹35,000/month", 
      duration: "6 Months",
      location: "Remote",
      description: "Join our core engineering team to build scalable user interfaces using React, Redux, and Tailwind CSS. You will be working directly with senior engineers on our flagship SaaS product.",
      requirements: ["React.js", "Node.js", "REST APIs", "Git"]
    },
    { 
      id: 102, 
      role: "UI/UX Prototyper", 
      company: "DesignHub", 
      matchScore: 76, 
      stipend: "₹20,000/month", 
      duration: "3 Months",
      location: "Mumbai, Maharashtra",
      description: "Help us design the next generation of fintech applications. You will create wireframes, interactive prototypes, and conduct user research sessions to validate designs.",
      requirements: ["Figma", "User Research", "Wireframing", "CSS"]
    }
  ];

  const handleApply = (job) => {
    if (appliedJobs.includes(job.id)) return; // Prevent double applying

    setAppliedJobs(prev => [...prev, job.id]);

    const newApplication = {
      id: Date.now(),
      role: job.role,
      company: job.company,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      stipend: job.stipend,
      duration: job.duration,
      matchScore: job.matchScore,
      nextSteps: 'Your application was routed via Allo Assistant and is awaiting initial HR screening.'
    };

    const existingApps = JSON.parse(localStorage.getItem('alloCrossPageApps') || '[]');
    localStorage.setItem('alloCrossPageApps', JSON.stringify([newApplication, ...existingApps]));

    setIsAlloTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, sender: 'allo', text: `✅ Done. I have successfully fast-tracked your profile to **${job.company}**. You can track its status in your Applications tab.`, time: 'Just now'
      }]);
      setIsAlloTyping(false);
    }, 1200);
  };

  const handleEndChat = () => {
    if(messages.length <= 2) {
      alert("This chat is empty. Nothing to save.");
      return;
    }

    if(window.confirm("End this session and save to history?")) {
      const userMessages = messages.filter(m => m.sender === 'user');
      const title = userMessages.length > 0 ? userMessages[0].text.substring(0, 30) + '...' : 'Career Session';
      
      const newSession = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        title: title,
        messages: [...messages],
        appliedJobs: [...appliedJobs]
      };

      setSessions([newSession, ...sessions]); 
      setMessages([]);
      setAppliedJobs([]);
    }
  };

  const loadSession = (session) => {
    if(window.confirm("Switch to this past session? Your current active chat will be lost if not ended first.")) {
      setMessages(session.messages);
      setAppliedJobs(session.appliedJobs);
    }
  };

  const deleteSession = (e, id) => {
    e.stopPropagation(); 
    if(window.confirm("Permanently delete this saved chat?")) {
      setSessions(sessions.filter(s => s.id !== id));
    }
  };

  const handleSend = () => {
    if (inputValue.trim() === '') return;

    const userMessage = { id: Date.now(), sender: 'user', text: inputValue, time: 'Just now' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue(''); 
    setIsAlloTyping(true);
    
    setTimeout(() => {
      let alloResponseText = '';
      let alloResponseData = null;
      let responseType = 'text';
      const lowerQuery = inputValue.toLowerCase();

      if (lowerQuery.includes('find') || lowerQuery.includes('match') || lowerQuery.includes('allocate')) {
        alloResponseText = `Processing your profile... I found ${aiGeneratedMatches.length} high-probability matches tailored to your React & Node.js skills!`;
        alloResponseData = aiGeneratedMatches; 
        responseType = 'matches';
      } else {
        alloResponseText = 'Understood. Please upload your resume or ask me to "find internships" to generate your allocation queue.';
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1, sender: 'allo', text: alloResponseText, data: alloResponseData, type: responseType, time: 'Just now'
      }]);
      setIsAlloTyping(false);
    }, 1500); 
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: `📤 Uploading resume: ${file.name}...`, time: 'Just now' }]);
    setIsAlloTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, sender: 'allo', text: `✅ Resume parsed: **${file.name}**. I have extracted your technical skills. Ask me to "find internships" when you are ready.`, time: 'Just now'
      }]);
      setIsAlloTyping(false);
    }, 2000);
  };

  return (
    <DashboardLayout role="Student">
      <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col md:flex-row gap-6">
        
        {/* LEFT SIDEBAR: CHAT HISTORY */}
        <div className="w-full md:w-80 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden flex-shrink-0 animate-fade-in">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#6b9b8e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Chat History
            </h3>
            <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">{sessions.length}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {sessions.length === 0 ? (
              <div className="text-center text-sm text-slate-400 p-6 mt-4">
                No saved sessions yet. End a chat to save it here.
              </div>
            ) : (
              sessions.map(session => (
                <div 
                  key={session.id} 
                  onClick={() => loadSession(session)}
                  className="p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 rounded-xl cursor-pointer transition-colors group relative"
                >
                  <p className="text-sm font-bold text-slate-700 truncate pr-6">{session.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{session.date}</p>
                  <button 
                    onClick={(e) => deleteSession(e, session.id)}
                    className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT AREA: ACTIVE CHAT WINDOW */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden animate-scale-up relative">
          
          <div className="border-b border-slate-100 p-5 bg-white flex justify-between items-center z-10 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#6b9b8e]/10 text-[#6b9b8e] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Active Session</h1>
                <p className="text-xs font-medium text-emerald-600 mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Allo is Online
                </p>
              </div>
            </div>
            <button 
              onClick={handleEndChat}
              className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              Save & End Chat
            </button>
          </div>

          <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-slate-50 shadow-inner">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                {message.sender === 'allo' && (
                  <div className="w-9 h-9 flex-shrink-0 bg-[#6b9b8e] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">A</div>
                )}
                <div className="max-w-[80%]">
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${message.sender === 'allo' ? 'bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-sm' : 'bg-[#6b9b8e] text-white rounded-tr-none shadow-md'}`}>
                    <p>{message.text}</p>
                    {message.type === 'matches' && message.data && (
                      <div className="space-y-3 mt-4 text-slate-800">
                        {message.data.map((job) => {
                          const isApplied = appliedJobs.includes(job.id);
                          return (
                            // THE MODAL TRIGGER: The whole card is now clickable
                            <div 
                              key={job.id} 
                              onClick={() => setSelectedJobDetails(job)}
                              className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-[#6b9b8e]/30 hover:shadow-md transition-all cursor-pointer group"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h5 className="font-bold text-slate-900 group-hover:text-[#6b9b8e] transition-colors">{job.role}</h5>
                                  <p className="text-xs text-slate-500 font-medium">{job.company} • {job.stipend}</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-xl font-black text-[#6b9b8e]">{job.matchScore}%</span>
                                  <div className="text-[9px] font-bold text-slate-400 uppercase">Match</div>
                                </div>
                              </div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation(); // Stops the modal from opening if they click the button directly
                                  handleApply(job);
                                }}
                                disabled={isApplied}
                                className={`w-full text-xs font-bold py-2.5 rounded-lg mt-2 transition-all ${
                                  isApplied ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed' : 'bg-[#6b9b8e] hover:bg-[#5a8679] text-white shadow-sm'
                                }`}
                              >
                                {isApplied ? 'Application Sent ✓' : 'Apply Now'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                {message.sender === 'user' && (
                  <div className="w-9 h-9 flex-shrink-0 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">You</div>
                )}
              </div>
            ))}
            {isAlloTyping && (
              <div className="flex gap-3">
                <div className="w-9 h-9 flex-shrink-0 bg-[#6b9b8e] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">A</div>
                <div className="p-4 bg-white rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-200"></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-3 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)] z-10">
            <label className="p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-[#6b9b8e] hover:text-white cursor-pointer transition-colors shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.414a6 6 0 108.486 8.486L20.5 13"></path></svg>
              <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
            </label>
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask Allo to find internships..." className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#6b9b8e] focus:border-transparent focus:outline-none transition-all font-medium text-slate-800" />
            <button onClick={handleSend} className="p-3.5 bg-[#6b9b8e] text-white rounded-xl hover:bg-[#5a8679] transition-colors shadow-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </div>
        </div>

      </div>

      {/* JOB DETAILS MODAL */}
      {selectedJobDetails && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-scale-up border border-slate-100/50">
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-start bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{selectedJobDetails.role}</h2>
                <p className="text-slate-500 font-medium mt-1">{selectedJobDetails.company} • {selectedJobDetails.location}</p>
              </div>
              <button 
                onClick={() => setSelectedJobDetails(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
              
              <div className="flex gap-4">
                <div className="flex-1 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Stipend</div>
                  <div className="font-bold text-slate-800">{selectedJobDetails.stipend}</div>
                </div>
                <div className="flex-1 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</div>
                  <div className="font-bold text-slate-800">{selectedJobDetails.duration}</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">Opportunity Overview</h4>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {selectedJobDetails.description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJobDetails.requirements.map(req => (
                    <span key={req} className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold">
                      {req}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer with Apply Action */}
            <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-[#6b9b8e]">{selectedJobDetails.matchScore}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight border-l border-slate-300 pl-3">
                  AI Match<br/>Confidence
                </span>
              </div>
              <button 
                onClick={() => {
                  handleApply(selectedJobDetails);
                  setSelectedJobDetails(null); // Close modal automatically
                }}
                disabled={appliedJobs.includes(selectedJobDetails.id)}
                className={`px-8 py-3 font-bold rounded-xl transition-all shadow-sm ${
                  appliedJobs.includes(selectedJobDetails.id) 
                    ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed' 
                    : 'bg-[#6b9b8e] hover:bg-[#5a8679] text-white'
                }`}
              >
                {appliedJobs.includes(selectedJobDetails.id) ? 'Application Sent ✓' : 'Apply Now'}
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </DashboardLayout>
  );
}