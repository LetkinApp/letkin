import React from 'react';

export default function LandingPage({ onLaunch }) {
  return (
    <div style={styles.container}>
      {/* Background Effects */}
      <div style={styles.glowOrbTop}></div>
      <div style={styles.gridOverlay}></div>

      {/* Navigation */}
      <nav style={styles.nav}>
        <h1 style={styles.logo}>Letkin.</h1>
        <button style={styles.loginBtn} onClick={onLaunch}>Log In</button>
      </nav>

      {/* Hero Section */}
      <main style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.badge}>FINANCIALIZING SOCIAL MEDIA</div>
          <h1 style={styles.headline}>
            The Economy of <br />
            <span style={styles.gradientText}>Instant Access.</span>
          </h1>
          <p style={styles.subheadline}>
            The world's first marketplace for liquid human time.
            <br />
            Don't just follow the 1%. <strong>Call them.</strong>
          </p>
          
          <button style={styles.launchButton} onClick={onLaunch}>
            Enter the Market <span style={{marginLeft: '10px'}}>→</span>
          </button>

          <p style={styles.trustText}>Arbitraging Human Intelligence</p>
        </div>

        {/* Visual Decoration (Abstract Phone) */}
        <div style={styles.heroVisual}>
          <div style={styles.floatingCard}>
            <div style={styles.cardHeader}>
              <div style={styles.cardAvatar}>U</div>
              <div>
                <div style={styles.cardName}>@FounderDev</div>
                <div style={styles.cardRate}>⚡ 1,000 Credits/min</div>
              </div>
            </div>
            <div style={styles.cardBody}>
               <div style={styles.incomingCall}>
                  INCOMING BID...
               </div>
            </div>
            <div style={styles.cardButton}>ACCEPT ($1,000)</div>
          </div>
        </div>
      </main>

      {/* Footer Features */}
      <footer style={styles.footer}>
        <div style={styles.feature}>
          <h3>Video Feed</h3>
          <p>Discover advice.</p>
        </div>
        <div style={styles.divider}></div>
        <div style={styles.feature}>
          <h3>Instant Access</h3>
          <p>Skip the DMs.</p>
        </div>
        <div style={styles.divider}></div>
        <div style={styles.feature}>
          <h3>Real Income</h3>
          <p>Settled instantly.</p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#050505',
    color: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  // Backgrounds
  glowOrbTop: {
    position: 'absolute',
    top: '-300px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '800px',
    height: '800px',
    background: 'radial-gradient(circle, rgba(0, 208, 156, 0.15) 0%, rgba(0,0,0,0) 70%)',
    zIndex: 0,
    pointerEvents: 'none',
  },
  gridOverlay: {
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
    backgroundSize: '50px 50px',
    zIndex: 0,
    pointerEvents: 'none',
  },
  
  // Nav
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '30px 50px',
    zIndex: 10,
  },
  logo: {
    fontSize: '24px',
    fontWeight: '900',
    margin: 0,
    letterSpacing: '-1px',
  },
  loginBtn: {
    background: 'transparent',
    border: '1px solid #333',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },

  // Hero
  hero: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 100px',
    zIndex: 10,
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
    flexWrap: 'wrap', // For mobile responsiveness
  },
  heroContent: {
    flex: 1,
    minWidth: '300px',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: 'rgba(0, 208, 156, 0.1)',
    color: '#00D09C',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '20px',
    border: '1px solid rgba(0, 208, 156, 0.2)',
  },
  headline: {
    fontSize: '64px',
    fontWeight: '800',
    lineHeight: '1.1',
    margin: '0 0 20px 0',
    letterSpacing: '-2px',
  },
  gradientText: {
    background: 'linear-gradient(to right, #fff, #888)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subheadline: {
    fontSize: '18px',
    color: '#888',
    lineHeight: '1.6',
    maxWidth: '500px',
    marginBottom: '40px',
  },
  launchButton: {
    padding: '18px 40px',
    fontSize: '18px',
    fontWeight: 'bold',
    backgroundColor: '#00D09C',
    color: 'black',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 0 30px rgba(0, 208, 156, 0.4)',
    transition: 'transform 0.2s',
    display: 'flex',
    alignItems: 'center',
  },
  trustText: {
    marginTop: '30px',
    fontSize: '12px',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },

  // Hero Visual (The Floating Card)
  heroVisual: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    perspective: '1000px', // For 3D effect
    minWidth: '300px',
  },
  floatingCard: {
    width: '320px',
    height: '200px',
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    transform: 'rotateY(-20deg) rotateX(10deg)', // Tilted 3D look
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardHeader: { display: 'flex', gap: '15px', alignItems: 'center' },
  cardAvatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#333', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  cardName: { fontWeight: 'bold', fontSize: '14px' },
  cardRate: { fontSize: '12px', color: '#00D09C' },
  cardBody: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  incomingCall: { color: '#666', letterSpacing: '2px', fontSize: '12px', animation: 'pulse 1s infinite' },
  cardButton: { width: '100%', padding: '10px', backgroundColor: '#00D09C', color: 'black', fontWeight: 'bold', textAlign: 'center', borderRadius: '10px', fontSize: '14px' },

  // Footer
  footer: {
    borderTop: '1px solid #222',
    padding: '40px 100px',
    display: 'flex',
    gap: '40px',
    zIndex: 10,
    backgroundColor: '#050505',
  },
  feature: { flex: 1 },
  divider: { width: '1px', backgroundColor: '#222', height: '50px' },
};
