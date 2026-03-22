import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

export default function Chatbot() {
  // Start with an empty array so Allo doesn't speak until it knows the user's name
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isAlloTyping, setIsAlloTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // FETCH REAL NAME ON LOAD AND INITIALIZE CHAT
  useEffect(() => {
    const initializeChat = async () => {
      let firstName = 'Student'; // Fallback
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.userId) {
            const response = await fetch(`http://localhost:5000/api/users/${payload.userId}`);
            if (response.ok) {
              const data = await response.json();
              if (data.name) {
                // Grab just the first name
                firstName = data.name.split(' ')[0];
              }
            }
          }
        } catch (error) {
          console.error("Failed to fetch user data for chat:", error);
        }
      }

      // Now that we have the real name (or fallback), inject the welcome messages
      setMessages([
        {
          id: 1,
          sender: 'allo',
          text: `Hi ${firstName}, I'm Allo! 👋 Your personal career assistant.`,
          time: 'Just now'
        },
        {
          id: 2,
          sender: 'allo',
          text: 'To get started, please upload your resume using the 📎 icon below, or ask me to find internships based on your profile.',
          time: 'Just now'
        }
      ]);
    };

    initializeChat();
  }, []); // Empty dependency array means this runs once when the component mounts

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAlloTyping]);

  const aiGeneratedMatches = [
    { id: 101, role: "Frontend Developer Intern", company: "InnovateTech", matchScore: 98, stipend: "₹35,000/month" },
    { id: 102, role: "UI/UX Prototyper", company: "DesignHub", matchScore: 76, stipend: "₹20,000/month" }
  ];

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
      } 
      else if (lowerQuery.includes('stipend')) {
        alloResponseText = 'Internships currently offer stipends ranging from ₹15,000 to ₹55,000 per month. You are completely free to accept or decline any offer.';
      } 
      else if (lowerQuery.includes('deadline')) {
        alloResponseText = 'Most roles for the Summer cycle close by April 30th. Please apply soon.';
      }
      else {
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

    if (file.type !== 'application/pdf') {
      setMessages(prev => [...prev, { id: Date.now(), sender: 'allo', text: '⚠️ I can only accept resumes in PDF format.', time: 'Just now' }]);
      return;
    }

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
      <div className="p-8 max-w-5xl mx-auto space-y-8 flex flex-col h-[calc(100vh-80px)]">
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Allo Assistant</h1>
          <p className="text-slate-500 mt-1">Chat to find, analyze, and apply to high-probability matches.</p>
        </div>

        <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-slate-50 shadow-inner">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                {message.sender === 'allo' && (
                  <div className="w-9 h-9 flex-shrink-0 bg-[#6b9b8e] text-white rounded-full flex items-center justify-center font-bold text-sm">A</div>
                )}
                <div className="max-w-[80%]">
                  <div className={`p-4 rounded-xl text-sm leading-relaxed ${message.sender === 'allo' ? 'bg-white text-slate-800 rounded-bl-none border border-slate-100 shadow-sm' : 'bg-[#6b9b8e] text-white rounded-br-none'}`}>
                    <p>{message.text}</p>
                    {message.type === 'matches' && message.data && (
                      <div className="space-y-3 mt-4 text-slate-800">
                        {message.data.map((job) => (
                          <div key={job.id} className="bg-slate-50 p-4 rounded-lg border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h5 className="font-bold text-slate-900">{job.role}</h5>
                                <p className="text-xs text-slate-500 font-medium">{job.company} • {job.stipend}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-xl font-black text-[#6b9b8e]">{job.matchScore}%</span>
                                <div className="text-[9px] font-bold text-slate-400 uppercase">Match</div>
                              </div>
                            </div>
                            <button className="w-full bg-[#6b9b8e] hover:bg-[#5a8679] text-white text-xs font-semibold py-2 rounded mt-2 transition-colors">Apply Now</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {message.sender === 'user' && (
                  <div className="w-9 h-9 flex-shrink-0 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-sm">You</div>
                )}
              </div>
            ))}
            {isAlloTyping && (
              <div className="flex gap-3">
                <div className="w-9 h-9 flex-shrink-0 bg-[#6b9b8e] text-white rounded-full flex items-center justify-center font-bold text-sm">A</div>
                <div className="p-4 bg-white rounded-xl rounded-bl-none border border-slate-100 shadow-sm flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-200"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-3">
            <label className="p-3 bg-slate-100 text-slate-500 rounded-full hover:bg-[#6b9b8e] hover:text-white cursor-pointer transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.414a6 6 0 108.486 8.486L20.5 13"></path></svg>
              <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
            </label>
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask Allo to find internships..." className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-full focus:bg-white focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none transition-all" />
            <button onClick={handleSend} className="p-3 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}