import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  // The state now correctly tracks the selected role
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student', skills: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
      
      const payload = {
        ...formData,
        skills: skillsArray
      };

      await axios.post('http://localhost:5000/api/users/register', payload);
      
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try a different email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center' }}>Portal Registration</h2>
      
      {error && <div style={{ color: 'red', background: '#fdd', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* New Account Type Dropdown */}
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Account Type</label>
          <select 
            name="role" 
            value={formData.role} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: 'white' }}
          >
            <option value="student">Student / Candidate</option>
            <option value="company">Company / Internship Provider</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Full Name / Company Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder="e.g., John Doe or Tech Corp" />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Email Address</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder="contact@email.com" />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder="Create a strong password" />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
            {formData.role === 'student' ? 'Your Skills (Comma separated)' : 'Required Skills (Comma separated)'}
          </label>
          <input type="text" name="skills" value={formData.skills} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder="e.g., Python, React, Product Management" />
        </div>

        <button type="submit" disabled={isLoading} style={{ padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }}>
          {isLoading ? 'Processing...' : 'Register'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Already have an account? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Login here</Link>
      </p>
    </div>
  );
};

export default Register;