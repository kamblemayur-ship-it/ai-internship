import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('discover'); // 'discover' or 'applications'
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [applyingTo, setApplyingTo] = useState(null);

  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'student') {
      navigate('/login');
      return;
    }
    
    if (activeTab === 'discover') {
      fetchOpenJobs();
    } else {
      fetchMyApplications();
    }
  }, [currentUser, navigate, activeTab]);

  const fetchOpenJobs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/jobs/open');
      const allJobs = response.data;

      // Smart Feature: Calculate match score on the frontend for sorting
      const studentSkills = currentUser.skills.map(s => s.toLowerCase());
      
      const rankedJobs = allJobs.map(job => {
        const matches = job.requiredSkills.filter(s => studentSkills.includes(s.toLowerCase()));
        const score = job.requiredSkills.length > 0 
          ? Math.round((matches.length / job.requiredSkills.length) * 100) 
          : 0;
        return { ...job, matchScore: score };
      }).sort((a, b) => b.matchScore - a.matchScore); // Highest score at the top

      setJobs(rankedJobs);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/applications/student/${currentUser.id}`);
      setMyApplications(response.data);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    setApplyingTo(jobId);
    try {
      await axios.post('http://localhost:5000/api/applications/apply', {
        jobId,
        studentId: currentUser.id
      });
      alert('Application submitted successfully!');
      setActiveTab('applications'); // Auto-switch to tracking tab
    } catch (err) {
      // Catch the 400 Duplicate Error specifically
      if (err.response && err.response.status === 400) {
        alert(err.response.data.message); 
      } else {
        alert('Failed to submit application. Please try again.');
      }
    } finally {
      setApplyingTo(null);
    }
  };

  if (!currentUser) return null;

  // Helper to extract an array of job IDs the user has already applied to
  const appliedJobIds = myApplications.map(app => app.jobId?._id);

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
      
      {/* Header & Tabs */}
      <div style={{ marginBottom: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
        <h2 style={{ fontSize: '2rem', color: '#0f172a', margin: '0 0 10px 0' }}>Candidate Portal</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <span style={{ color: '#64748b', fontSize: '1.1rem' }}>Welcome, <strong>{currentUser.name}</strong></span>
          <span style={{ color: '#e2e8f0' }}>|</span>
          <span style={{ color: '#64748b', fontSize: '1.1rem' }}>Your Skills:</span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {currentUser.skills?.map((skill, i) => (
              <span key={i} style={{ background: '#f5f3ff', color: '#7c3aed', padding: '4px 12px', borderRadius: '16px', fontSize: '0.9rem', fontWeight: '600', border: '1px solid #ddd6fe' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setActiveTab('discover')}
            style={{ padding: '10px 20px', background: activeTab === 'discover' ? '#2563eb' : 'transparent', color: activeTab === 'discover' ? 'white' : '#64748b', border: 'none', borderRadius: '8px 8px 0 0', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Discover Internships
          </button>
          <button 
            onClick={() => setActiveTab('applications')}
            style={{ padding: '10px 20px', background: activeTab === 'applications' ? '#2563eb' : 'transparent', color: activeTab === 'applications' ? 'white' : '#64748b', border: 'none', borderRadius: '8px 8px 0 0', fontWeight: 'bold', cursor: 'pointer' }}
          >
            My Applications
          </button>
        </div>
      </div>

      {/* TAB 1: DISCOVER INTERNSHIPS */}
      {activeTab === 'discover' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {isLoading && jobs.length === 0 && <p style={{ color: '#64748b' }}>Scanning database for matches...</p>}

          {jobs.length > 0 ? jobs.map(job => (
            <div key={job._id} className="dashboard-card" style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderLeft: job.matchScore >= 70 ? '4px solid #16a34a' : '4px solid #e2e8f0' }}>
              <div style={{ flex: 1 }}>
                <span style={{ display: 'inline-block', background: '#1e293b', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px' }}>
                  {job.companyName}
                </span>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '1.4rem', color: '#0f172a' }}>{job.title}</h4>
                <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '0.95rem', maxWidth: '600px', lineHeight: '1.5' }}>{job.description}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {job.requiredSkills.map((skill, i) => (
                    <span key={i} style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem' }}>{skill}</span>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px', minWidth: '150px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>Match Score</span>
                  <div style={{ background: job.matchScore >= 70 ? '#dcfce7' : job.matchScore >= 40 ? '#fef08a' : '#f1f5f9', padding: '8px 16px', borderRadius: '20px' }}>
                    <strong style={{ fontSize: '1.2rem', color: job.matchScore >= 70 ? '#166534' : job.matchScore >= 40 ? '#854d0e' : '#475569' }}>{job.matchScore}%</strong>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleApply(job._id)}
                  disabled={applyingTo === job._id || appliedJobIds.includes(job._id)}
                  style={{ 
                    background: appliedJobIds.includes(job._id) ? '#cbd5e1' : '#2563eb', 
                    color: appliedJobIds.includes(job._id) ? '#475569' : 'white', 
                    border: 'none', padding: '10px 20px', borderRadius: '6px', 
                    cursor: appliedJobIds.includes(job._id) ? 'not-allowed' : 'pointer', 
                    fontWeight: 'bold', width: '100%', transition: 'background 0.2s' 
                  }}
                >
                  {applyingTo === job._id ? 'Applying...' : appliedJobIds.includes(job._id) ? 'Applied' : 'Apply Now'}
                </button>
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '8px', border: '2px dashed #cbd5e1' }}>
              <p style={{ color: '#64748b' }}>No internships currently available. Check back later.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY APPLICATIONS */}
      {activeTab === 'applications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {isLoading && myApplications.length === 0 && <p style={{ color: '#64748b' }}>Loading your applications...</p>}

          {myApplications.length > 0 ? myApplications.map(app => (
            <div key={app._id} className="dashboard-card" style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: '#0f172a' }}>{app.jobId?.title || 'Job Removed'}</h4>
                <p style={{ margin: '0 0 10px 0', color: '#64748b' }}>Company: <strong style={{ color: '#0f172a' }}>{app.jobId?.companyName || 'Unknown'}</strong></p>
                <p style={{ margin: '0', fontSize: '0.85rem', color: '#94a3b8' }}>Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ 
                  display: 'inline-block', padding: '6px 16px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold',
                  background: app.status === 'Approved' ? '#dcfce7' : app.status === 'Rejected' ? '#fee2e2' : '#fef3c7',
                  color: app.status === 'Approved' ? '#166534' : app.status === 'Rejected' ? '#991b1b' : '#92400e'
                }}>
                  {app.status}
                </span>
                {app.status === 'Approved' && (
                  <p style={{ margin: '10px 0 0 0', fontSize: '0.85rem', color: '#16a34a', fontWeight: '600' }}>Check your email for next steps!</p>
                )}
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '8px', border: '2px dashed #cbd5e1' }}>
              <p style={{ color: '#64748b' }}>You haven't applied to any internships yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;