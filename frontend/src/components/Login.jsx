import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Added Link here

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      if (response.data.user.role === 'company') {
        navigate('/company');
      } else {
        navigate('/candidate');
      }
      window.location.reload(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center' }}>Login to Portal</h2>
      {error && <div style={{ color: 'red', background: '#fdd', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Email Address</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder="rohit@test.com" />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder="••••••••" />
        </div>
        <button type="submit" disabled={isLoading} style={{ padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }}>
          {isLoading ? 'Authenticating...' : 'Login'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Don't have an account? <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Register here</Link>
      </p>
    </div>
  );
};

export default Login;