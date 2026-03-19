import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  
  // 1. Get user from memory
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // 2. FIX: Initialize the state directly here. Do NOT use useEffect to set this.
  const initialSkills = currentUser && currentUser.skills ? currentUser.skills.join(', ') : '';
  const [skills, setSkills] = useState(initialSkills);
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  // 3. Security check only
  useEffect(() => {
    if (!storedUser) {
      navigate('/login');
    }
  }, [navigate, storedUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
      
      const response = await axios.put(`http://localhost:5000/api/users/${currentUser.id}`, {
        skills: skillsArray
      });

      // Update the browser's local storage with the fresh data
      const updatedUser = { ...currentUser, skills: response.data.skills };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setStatus({ type: 'success', message: 'Profile updated successfully! The AI will now use your new skills.' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to update profile. Check the backend connection.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Edit Profile: {currentUser.name}</h2>
      <p>Update your skills below to discover new AI internship matches.</p>

      {status.message && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '15px', 
          borderRadius: '4px', 
          background: status.type === 'success' ? '#d4edda' : '#f8d7da',
          color: status.type === 'success' ? '#155724' : '#721c24'
        }}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Your Skills (Comma separated)</label>
          <textarea 
            value={skills} 
            onChange={(e) => setSkills(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', minHeight: '100px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' }}
            placeholder="React, Node.js, Agile, Product Management..."
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {isLoading ? 'Saving...' : 'Update Skills'}
        </button>
      </form>
    </div>
  );
};

export default Profile;