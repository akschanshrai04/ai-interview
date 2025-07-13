
export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)' }}>
      <h1 style={{ fontSize: 36, fontWeight: 700, color: '#1976d2', marginBottom: 16 }}>Welcome to AI Interview Platform</h1>
      <p style={{ fontSize: 18, color: '#555', marginBottom: 40, textAlign: 'center', maxWidth: 500 }}>
        Practice your interview skills with AI-powered mock interviews. Get real-time feedback and improve your confidence!
      </p>
      <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
        <a href="/home" style={{
          padding: '12px 32px',
          background: '#1976d2',
          color: 'white',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 18,
          textDecoration: 'none',
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
          transition: 'background 0.2s',
        }}>Go to Dashboard</a>
        <a href="/login" style={{
          padding: '12px 32px',
          background: '#43a047',
          color: 'white',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 18,
          textDecoration: 'none',
          boxShadow: '0 2px 8px rgba(67, 160, 71, 0.08)',
          transition: 'background 0.2s',
        }}>Login</a>
        <a href="/signup" style={{
          padding: '12px 32px',
          background: '#fbc02d',
          color: '#333',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 18,
          textDecoration: 'none',
          boxShadow: '0 2px 8px rgba(251, 192, 45, 0.08)',
          transition: 'background 0.2s',
        }}>Sign Up</a>
      </div>
    </div>
  );
}
