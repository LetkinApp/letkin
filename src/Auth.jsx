import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Auth() {
  const [view, setView] = useState('signup'); // Default to Sign Up
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // We ask for this now!

  // 1. SIGN UP LOGIC (Create Auth + Create Wallet Profile)
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    // A. Create the User in Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      alert(authError.message);
      setLoading(false);
      return;
    }

    // B. Create their Wallet/Profile immediately
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            username: username, // Save the name they typed!
            credits: 500,       // Free signup bonus
            rate_per_minute: 10
          }
        ]);
        
      if (profileError) {
        console.error('Error creating profile:', profileError);
      } else {
        alert('Welcome to Letkin!');
        // The App.jsx listener will automatically switch screens now
      }
    }
    setLoading(false);
  };

  // 2. LOGIN LOGIC
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      {/* Background decoration */}
      <div style={styles.glowOrb}></div>

      <div style={styles.card}>
        <h1 style={styles.title}>
          {view === 'signup' ? 'Claim your handle.' : 'Welcome back.'}
        </h1>
        <p style={styles.subtitle}>
          {view === 'signup' ? 'Join the economy of advice.' : 'Login to your wallet.'}
        </p>

        <form onSubmit={view === 'signup' ? handleSignUp : handleLogin} style={styles.form}>
          
          {/* Only show Username field if Signing Up */}
          {view === 'signup' && (
            <div style={styles.inputGroup}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" disabled={loading} style={styles.mainButton}>
            {loading ? 'Processing...' : (view === 'signup' ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        {/* Toggle between modes */}
        <p style={styles.switchText}>
          {view === 'signup' ? 'Already have an account? ' : 'New here? '}
          <span 
            style={styles.link} 
            onClick={() => setView(view === 'signup' ? 'login' : 'signup')}
          >
            {view === 'signup' ? 'Log in' : 'Sign up'}
          </span>
        </p>
      </div>
    </div>
  );
}

// THE "BEAUTIFUL" STYLES
const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#0a0a0a', // Deep black
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  glowOrb: {
    position: 'absolute',
    top: '-20%',
    left: '-20%',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(0,208,156,0.15) 0%, rgba(0,0,0,0) 70%)',
    zIndex: 0,
  },
  card: {
    width: '90%',
    maxWidth: '400px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Glass effect
    backdropFilter: 'blur(10px)',
    padding: '40px 30px',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    zIndex: 1,
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
  },
  title: {
    color: 'white',
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 10px 0',
    textAlign: 'center',
  },
  subtitle: {
    color: '#888',
    textAlign: 'center',
    margin: '0 0 30px 0',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    width: '100%',
    padding: '16px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box', // Fixes width issues
    transition: 'border 0.3s',
  },
  mainButton: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#00D09C', // Letkin Teal
    color: '#000',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'transform 0.1s',
  },
  switchText: {
    color: '#666',
    textAlign: 'center',
    marginTop: '25px',
    fontSize: '14px',
  },
  link: {
    color: '#00D09C',
    cursor: 'pointer',
    fontWeight: 'bold',
  }
};