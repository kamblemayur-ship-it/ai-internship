import { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hey there! If you have any queries about the internship scheme, I can help.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/ai/chat', { message: input });
      setMessages((prev) => [...prev, { sender: 'ai', text: response.data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: 'error', text: 'Connection failed.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        style={{ position: 'fixed', bottom: '20px', right: '20px', padding: '15px', borderRadius: '50%', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
      >
        💬 Chat
      </button>
    );
  }

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '350px', background: 'white', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#007bff', color: 'white', padding: '10px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
        <strong>AI Assistant</strong>
        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>✖</button>
      </div>
      
      <div style={{ height: '300px', overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', background: msg.sender === 'user' ? '#007bff' : '#f1f1f1', color: msg.sender === 'user' ? 'white' : 'black', padding: '8px 12px', borderRadius: '15px', maxWidth: '85%' }}>
            {msg.text}
          </div>
        ))}
        {isLoading && <div style={{ color: '#888', fontSize: '0.9em' }}>AI is typing...</div>}
      </div>

      <div style={{ display: 'flex', borderTop: '1px solid #eee', padding: '10px' }}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask a question..."
          style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button onClick={sendMessage} disabled={isLoading} style={{ marginLeft: '5px', padding: '8px 12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;