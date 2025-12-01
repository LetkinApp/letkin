import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Auth() {
  const [view, setView] = useState('signup');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  // 1. SIGN UP (Gives 500 Free Credits)
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Create Auth User
    const { data, error: authError } = await supabase.auth.signUp({ email, password });
    
    if (authError) { 
        alert(authError.message); 
        setLoading(false); 
        return; 
    }

    // Create Profile with Money
    if (data.user) {
      await supabase.from('profiles').insert([
          { 
              id: data.user.id, 
              username: username, 
              credits: 500, // <--- THE SIGNUP BONUS
              rate_per_minute: 10 
          }
      ]);
      alert('Account created! Welcome to the economy.');
    }
    setLoading(false);
  };

  // 2. LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.glowOrb}></div>

      <div style={styles.card}>
        <h1 style={styles.title}>{view === 'signup' ? 'Claim your handle.' : 'Welcome back.'}</h1>
        <p style={styles.subtitle}>{view === 'signup' ? 'Join the economy of access.' : 'Login to your wallet.'}</p>

        <form onSubmit={view === 'signup' ? handleSignUp : handleLogin} style={styles.form}>
          
          {/* Show Username only for Sign Up */}
          {view === 'signup' && (
            <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                style={styles.input} 
                required 
            />
          )}

          <input 
            type="email" 
            placeholder="Email address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={styles.input} 
            required 
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={styles.input} 
            required 
          />

          <button type="submit" disabled={loading} style={styles.mainButton}>
            {loading ? 'Processing...' : (view === 'signup' ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <p style={styles.switchText}>
          {view === 'signup' ? 'Already have an account? ' : 'New here? '}
          <span style={styles.link} onClick={() => setView(view === 'signup' ? 'login' : 'signup')}>
            {view === 'signup' ? 'Log in' : 'Sign up'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { height: '100vh', width: '100vw', backgroundColor: '#0a0a0a', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  glowOrb: { position: 'absolute', top: '-20%', left: '-20%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0,208,156,0.15) 0%, rgba(0,0,0,0) 70%)', zIndex: 0 },
  card: { width: '90%', maxWidth: '400px', backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', padding: '40px 30px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', zIndex: 1, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' },
  title: { color: 'white', fontSize: '28px', fontWeight: '700', margin: '0 0 10px 0', textAlign: 'center' },
  subtitle: { color: '#888', textAlign: 'center', margin: '0 0 30px 0', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { width: '100%', padding: '16px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '16px', outline: 'none', boxSizing: 'border-box' },
  mainButton: { width: '100%', padding: '16px', backgroundColor: '#00D09C', color: '#000', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '10px' },
  switchText: { color: '#666', textAlign: 'center', marginTop: '25px', fontSize: '14px' },
  link: { color: '#00D09C', cursor: 'pointer', fontWeight: 'bold' }
};
