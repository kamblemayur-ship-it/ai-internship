import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CompanyDashboard = () => {
  const [activeTab, setActiveTab] = useState('postings'); // 'postings', 'post', or 'inbox'
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Job Form State
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobSkills, setJobSkills] = useState('');

  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'company') {
      navigate('/login');
      return;
    } 
    
    // Always fetch applications to get the applicant counts
    fetchApplications();
    
    if (activeTab === 'postings') {
      fetchJobs();
    }
  }, [currentUser, navigate, activeTab]);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/applications/company/${currentUser.id}`);
      setApplications(response.data);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    }
  };

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/jobs/company/${currentUser.id}`);
      setJobs(response.data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const skillsArray = jobSkills.split(',').map(s => s.trim()).filter(s => s.length > 0);

    try {
      await axios.post('http://localhost:5000/api/jobs', {
        companyId: currentUser.id,
        companyName: currentUser.name,
        title: jobTitle,
        description: jobDesc,
        requiredSkills: skillsArray
      });
      alert('Internship posted successfully!');
      setJobTitle(''); setJobDesc(''); setJobSkills('');
      setActiveTab('postings'); // Redirect back to postings tab after successful creation
    } catch (err) {
      console.error(err);
      alert('Failed to post internship.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus.toUpperCase()} this candidate?`)) return;

    try {
      await axios.put(`http://localhost:5000/api/applications/${appId}/status`, { status: newStatus });
      fetchApplications(); // Refresh the inbox immediately
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    }
  };

  if (!currentUser) return null;

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
      
      {/* Header & Tabs */}
      <div style={{ marginBottom: '30px', borderBottom: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '2rem', color: '#0f172a', margin: '0 0 20px 0' }}>Company Workspace</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setActiveTab('postings')}
            style={{ padding: '10px 20px', background: activeTab === 'postings' ? '#2563eb' : 'transparent', color: activeTab === 'postings' ? 'white' : '#64748b', border: 'none', borderRadius: '8px 8px 0 0', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Active Postings
          </button>
          <button 
            onClick={() => setActiveTab('post')}
            style={{ padding: '10px 20px', background: activeTab === 'post' ? '#2563eb' : 'transparent', color: activeTab === 'post' ? 'white' : '#64748b', border: 'none', borderRadius: '8px 8px 0 0', fontWeight: 'bold', cursor: 'pointer' }}
          >
            + Post Internship
          </button>
          <button 
            onClick={() => setActiveTab('inbox')}
            style={{ padding: '10px 20px', background: activeTab === 'inbox' ? '#2563eb' : 'transparent', color: activeTab === 'inbox' ? 'white' : '#64748b', border: 'none', borderRadius: '8px 8px 0 0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            Application Inbox 
            {applications.filter(app => app.status === 'Pending').length > 0 && (
              <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>
                {applications.filter(app => app.status === 'Pending').length} New
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: ACTIVE POSTINGS (NEW) */}
      {activeTab === 'postings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ margin: 0, color: '#334155' }}>Your Active Roles</h3>
            <button onClick={() => setActiveTab('post')} style={{ background: '#0f172a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Post New Role</button>
          </div>

          {isLoading && jobs.length === 0 && <p style={{ color: '#64748b' }}>Loading postings...</p>}

          {jobs.length > 0 ? jobs.map(job => {
            // Calculate how many applications point to this specific job ID
            const applicantCount = applications.filter(app => app.jobId?._id === job._id).length;
            
            return (
              <div key={job._id} className="dashboard-card" style={{ padding: '25px', background: 'white', borderLeft: '4px solid #3b82f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '1.3rem', color: '#0f172a' }}>{job.title}</h4>
                    <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '0.95rem', maxWidth: '600px', lineHeight: '1.5' }}>{job.description}</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {job.requiredSkills.map((skill, i) => (
                        <span key={i} style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem' }}>{skill}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right', background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', minWidth: '120px' }}>
                    <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '5px' }}>Applicants</span>
                    <strong style={{ fontSize: '2rem', color: applicantCount > 0 ? '#2563eb' : '#94a3b8' }}>{applicantCount}</strong>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '8px', border: '2px dashed #cbd5e1' }}>
              <p style={{ color: '#64748b', marginBottom: '15px' }}>You haven't posted any internships yet.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: POST A JOB */}
      {activeTab === 'post' && (
        <div className="dashboard-card" style={{ padding: '30px', background: 'white' }}>
          <h3 style={{ marginTop: 0 }}>Create New Internship Posting</h3>
          <form onSubmit={handlePostJob} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#334155' }}>Job Title</label>
              <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} placeholder="e.g. Associate Product Manager" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#334155' }}>Description</label>
              <textarea value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', minHeight: '100px' }} placeholder="Briefly describe the responsibilities..." />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#334155' }}>Required Skills (Comma separated)</label>
              <input type="text" value={jobSkills} onChange={(e) => setJobSkills(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} placeholder="e.g. Agile, Jira, Python, Communication" />
            </div>
            <button type="submit" disabled={isLoading} style={{ background: '#0f172a', color: 'white', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', border: 'none', marginTop: '10px' }}>
              {isLoading ? 'Posting...' : 'Publish Internship'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: APPLICATION INBOX */}
      {/* TAB 3: APPLICATION INBOX */}
      {activeTab === 'inbox' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* THE FIX GOES HERE: */}
          {isLoading && applications.length === 0 && <p style={{ color: '#64748b' }}>Loading applications...</p>}

          {applications.length > 0 ? applications.map((app) => (
            // ... rest of your inbox code
            <div key={app._id} className="dashboard-card" style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>{app.studentId?.name || 'Unknown Student'}</h4>
                <p style={{ margin: '0 0 5px 0', color: '#64748b' }}>Applied for: <strong style={{ color: '#0f172a' }}>{app.jobId?.title || 'Unknown Role'}</strong></p>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#64748b' }}>Skills: {app.studentId?.skills?.join(', ')}</p>
                
                <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', 
                  background: app.status === 'Approved' ? '#dcfce7' : app.status === 'Rejected' ? '#fee2e2' : '#fef3c7',
                  color: app.status === 'Approved' ? '#166534' : app.status === 'Rejected' ? '#991b1b' : '#92400e'
                }}>
                  Status: {app.status}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Match Score</span>
                  <strong style={{ fontSize: '1.4rem', color: app.matchScore >= 70 ? '#16a34a' : '#ea580c' }}>{app.matchScore}%</strong>
                </div>
                
                {app.status === 'Pending' && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleUpdateStatus(app._id, 'Approved')} style={{ background: '#16a34a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Approve</button>
                    <button onClick={() => handleUpdateStatus(app._id, 'Rejected')} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Reject</button>
                  </div>
                )}
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '8px', border: '2px dashed #cbd5e1' }}>
              <p style={{ color: '#64748b' }}>No applications yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;