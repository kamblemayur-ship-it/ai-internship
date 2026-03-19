import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      
      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '60px 0', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ fontSize: '3rem', color: '#0f172a', marginBottom: '20px', letterSpacing: '-0.02em' }}>
          Smart PM Internship Allocation
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
          Stop relying on manual resume screening. Our AI-driven engine analyzes skill overlaps to perfectly match top engineering talent with the right product management roles.
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Link to="/register" style={{ padding: '15px 30px', background: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', transition: 'background 0.2s' }}>
            Join as a Candidate
          </Link>
          <Link to="/register" style={{ padding: '15px 30px', background: '#ffffff', color: '#0f172a', border: '2px solid #e2e8f0', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', transition: 'border-color 0.2s' }}>
            Hire Top Talent
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '60px' }}>
        <div className="dashboard-card" style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🧠</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#0f172a' }}>AI Skill Matching</h3>
          <p style={{ color: '#64748b', margin: 0, lineHeight: '1.5' }}>Our Gemini-powered engine evaluates real technical proficiencies, not just buzzwords, ensuring a high-fidelity match.</p>
        </div>

        <div className="dashboard-card" style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>⚡</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#0f172a' }}>Instant Allocation</h3>
          <p style={{ color: '#64748b', margin: 0, lineHeight: '1.5' }}>Companies can review AI-ranked lists and trigger allocations with a single click, instantly updating student dashboards.</p>
        </div>

        <div className="dashboard-card" style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🔒</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#0f172a' }}>Role-Based Access</h3>
          <p style={{ color: '#64748b', margin: 0, lineHeight: '1.5' }}>Secure, segregated portals ensure candidates and companies only see the data and actions relevant to their tier.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;