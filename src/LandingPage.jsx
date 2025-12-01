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

      {/* SECTION 1: HERO */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.badge}>FINANCIALIZING SOCIAL MEDIA</div>
          <h1 style={styles.headline}>
            The Economy of <br />
            <span style={styles.gradientText}>Instant Access.</span>
          </h1>
          <p style={styles.subheadline}>
            The world's first liquidity layer for human time.
            <br />
            Don't just follow the 1%. <strong>Call them.</strong>
          </p>
          
          <button style={styles.launchButton} onClick={onLaunch}>
            Enter the Market <span style={{marginLeft: '10px'}}>→</span>
          </button>

          <p style={styles.trustText}>Spot Market: <span style={{color: '#00D09C'}}>LIQUID</span></p>
        </div>

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
               <div style={styles.incomingCall}>INCOMING BID...</div>
            </div>
            <div style={styles.cardButton}>ACCEPT ($1,000)</div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE PROBLEM (Dark Grey) */}
      <section style={styles.problemSection}>
        <h2 style={styles.sectionHeader}>THE ALGORITHM TRAP</h2>
        <div style={styles.splitContent}>
            <div style={styles.problemText}>
                <h3 style={styles.problemTitle}>Why your DMs are ignored.</h3>
                <p style={styles.textBlock}>
                    Platforms like Twitter and Instagram monetize <strong>Attention</strong> (Ads), not <strong>Value</strong>. 
                    This creates a "Noise Trap." High-value individuals are drowned out by spam.
                    <br/><br/>
                    Access to tacit knowledge is the world's most valuable asset, yet it has zero market price. 
                    Letkin fixes this by financializing the inbox.
                </p>
                
                {/* --- MIDDLE CTA 1 --- */}
                <button style={styles.middleButton} onClick={onLaunch}>
                    Bypass the Noise <span style={{marginLeft: '8px'}}>→</span>
                </button>

            </div>
            <div style={styles.problemVisual}>
                <div style={styles.statBox}>
                    <span style={styles.statLabel}>Avg. DM Response Rate</span>
                    <span style={styles.statValueRed}>0.1%</span>
                </div>
                <div style={styles.statBox}>
                    <span style={styles.statLabel}>Letkin Response Rate</span>
                    <span style={styles.statValueGreen}>94%</span>
                </div>
            </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS (Grid) */}
      <section style={styles.worksSection}>
        <h2 style={styles.sectionHeader}>THE MECHANISM</h2>
        <div style={styles.stepsGrid}>
            <div style={styles.stepCard}>
                <div style={styles.stepNumber}>01</div>
                <h3>Signal</h3>
                <p>Creators post high-signal video insights. No dancing. No trends. Just pure alpha.</p>
            </div>
            <div style={styles.stepCard}>
                <div style={styles.stepNumber}>02</div>
                <h3>Price</h3>
                <p>Every creator sets a real-time "Spot Price" for their attention (e.g., 50 Credits/min).</p>
            </div>
            <div style={styles.stepCard}>
                <div style={styles.stepNumber}>03</div>
                <h3>Execute</h3>
                <p>You click Call. The transaction clears instantly via wallet. The video session begins.</p>
            </div>
        </div>
      </section>

      {/* SECTION 4: THE ASSET (Big Typography) */}
      <section style={styles.assetSection}>
        <div style={styles.assetContent}>
            <h2 style={styles.assetTitle}>Time is the new <span style={{color: '#d4af37'}}>Gold.</span></h2>
            <p style={styles.assetSub}>
                We are building the Nasdaq for Social Capital.
                <br/>Trade time. Hedge access. Long intelligence.
            </p>
            
            {/* --- BOTTOM CTA --- */}
            <button style={styles.launchButton} onClick={onLaunch}>
                Enter the Market <span style={{marginLeft: '10px'}}>→</span>
            </button>

        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerCol}>
          <h3>Letkin.</h3>
          <p style={{fontSize: '12px', color: '#666'}}>© 2025 Letkin Inc.</p>
        </div>
        <div style={styles.footerCol}>
          <p>Twitter</p>
          <p>Manifesto</p>
          <p>Contact</p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    width: '100vw',
    backgroundColor: '#050505',
    color: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    overflowX: 'hidden',
  },
  // Reused Backgrounds
  glowOrbTop: { position: 'absolute', top: '-300px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(0, 208, 156, 0.15) 0%, rgba(0,0,0,0) 70%)', zIndex: 0, pointerEvents: 'none' },
  gridOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '50px 50px', zIndex: 0, pointerEvents: 'none' },
  
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '30px 50px', zIndex: 10, position: 'relative' },
  logo: { fontSize: '24px', fontWeight: '900', margin: 0, letterSpacing: '-1px' },
  loginBtn: { background: 'transparent', border: '1px solid #333', color: 'white', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' },

  // HERO
  hero: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '100px 100px', zIndex: 10, position: 'relative', maxWidth: '1400px', margin: '0 auto', flexWrap: 'wrap', gap: '50px' },
  heroContent: { flex: 1, minWidth: '300px' },
  badge: { display: 'inline-block', backgroundColor: 'rgba(0, 208, 156, 0.1)', color: '#00D09C', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', marginBottom: '20px', border: '1px solid rgba(0, 208, 156, 0.2)' },
  headline: { fontSize: '64px', fontWeight: '800', lineHeight: '1.1', margin: '0 0 20px 0', letterSpacing: '-2px' },
  gradientText: { background: 'linear-gradient(to right, #fff, #888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subheadline: { fontSize: '18px', color: '#888', lineHeight: '1.6', maxWidth: '500px', marginBottom: '40px' },
  
  // PRIMARY BUTTON STYLE
  launchButton: { padding: '18px 40px', fontSize: '18px', fontWeight: 'bold', backgroundColor: '#00D09C', color: 'black', border: 'none', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 0 30px rgba(0, 208, 156, 0.4)', display: 'flex', alignItems: 'center', transition: 'transform 0.1s' },
  
  // MIDDLE BUTTON STYLE
  middleButton: { marginTop: '30px', padding: '15px 30px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'background 0.2s' },

  trustText: { marginTop: '30px', fontSize: '12px', color: '#555', textTransform: 'uppercase', letterSpacing: '1px' },

  // HERO VISUAL
  heroVisual: { flex: 1, display: 'flex', justifyContent: 'center', perspective: '1000px', minWidth: '300px' },
  floatingCard: { width: '320px', height: '200px', backgroundColor: '#111', border: '1px solid #333', borderRadius: '20px', padding: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', transform: 'rotateY(-20deg) rotateX(10deg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  cardHeader: { display: 'flex', gap: '15px', alignItems: 'center' },
  cardAvatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#333', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  cardName: { fontWeight: 'bold', fontSize: '14px' },
  cardRate: { fontSize: '12px', color: '#00D09C' },
  cardBody: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  incomingCall: { color: '#666', letterSpacing: '2px', fontSize: '12px', animation: 'pulse 1s infinite' },
  cardButton: { width: '100%', padding: '10px', backgroundColor: '#00D09C', color: 'black', fontWeight: 'bold', textAlign: 'center', borderRadius: '10px', fontSize: '14px' },

  // SECTION 2: PROBLEM
  problemSection: { padding: '100px', backgroundColor: '#0a0a0a', borderTop: '1px solid #222', borderBottom: '1px solid #222', position: 'relative', zIndex: 10 },
  sectionHeader: { fontSize: '14px', color: '#00D09C', letterSpacing: '2px', marginBottom: '60px', textTransform: 'uppercase' },
  splitContent: { display: 'flex', gap: '80px', flexWrap: 'wrap' },
  problemText: { flex: 1, minWidth: '300px' },
  problemTitle: { fontSize: '42px', fontWeight: 'bold', marginBottom: '20px', color: 'white' },
  textBlock: { fontSize: '18px', color: '#888', lineHeight: '1.6' },
  problemVisual: { flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center' },
  statBox: { backgroundColor: '#111', border: '1px solid #333', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statLabel: { color: '#888', fontSize: '14px' },
  statValueRed: { color: '#ff4d4d', fontSize: '24px', fontWeight: 'bold' },
  statValueGreen: { color: '#00D09C', fontSize: '24px', fontWeight: 'bold' },

  // SECTION 3: MECHANISM
  worksSection: { padding: '100px', position: 'relative', zIndex: 10 },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' },
  stepCard: { backgroundColor: '#111', padding: '40px', borderRadius: '20px', border: '1px solid #222' },
  stepNumber: { fontSize: '60px', fontWeight: '900', color: '#222', marginBottom: '20px' },

  // SECTION 4: ASSET
  assetSection: { padding: '150px 100px', textAlign: 'center', position: 'relative', zIndex: 10, background: 'linear-gradient(180deg, #050505 0%, #111 100%)' },
  assetContent: { display: 'flex', flexDirection: 'column', alignItems: 'center' }, // Centers the button
  assetTitle: { fontSize: '56px', fontWeight: '800', marginBottom: '20px' },
  assetSub: { fontSize: '20px', color: '#888', marginBottom: '40px', lineHeight: '1.6' },

  // FOOTER
  footer: { padding: '80px 100px', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-between', backgroundColor: '#050505', position: 'relative', zIndex: 10 },
  footerCol: { display: 'flex', flexDirection: 'column', gap: '15px', color: '#666', fontSize: '14px' },
};
