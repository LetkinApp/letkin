import React, { useEffect, useState, useRef } from 'react';
import { supabase } from './supabaseClient';

// --- ANIMATION STYLES ---
const animationStyles = `
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
    40% {transform: translateY(-10px);}
    60% {transform: translateY(-5px);}
  }
  .bounce-arrow { animation: bounce 2s infinite; }
`;

export default function VideoFeed({ session }) {
  const [view, setView] = useState('feed'); 
  const [credits, setCredits] = useState(0);
  const [myRate, setMyRate] = useState(10);
  const [loadingRate, setLoadingRate] = useState(false);
  const [feedActiveIndex, setFeedActiveIndex] = useState(0);
  
  // LIFTED STATE: We fetch videos ONCE here, so they don't reload when switching tabs
  const [kins, setKins] = useState([]);

  useEffect(() => {
    fetchProfileData();
    fetchKins(); // Fetch videos immediately on app load
  }, []);

  async function fetchKins() {
    const { data } = await supabase.from('kins').select('*').order('rank', { ascending: true });
    if (data && data.length > 0) setKins(data);
  }

  async function fetchProfileData() {
    const { data } = await supabase.from('profiles').select('credits, rate_per_minute').eq('id', session.user.id).single();
    if (data) { setCredits(data.credits); setMyRate(data.rate_per_minute || 10); }
  }

  async function addFunds(amount) {
    const newBal = credits + amount;
    await supabase.from('profiles').update({ credits: newBal }).eq('id', session.user.id);
    setCredits(newBal);
    alert(`Successfully added ${amount} credits!`);
  }

  async function updateMyRate(newRate) {
    setLoadingRate(true);
    await supabase.from('profiles').update({ rate_per_minute: newRate }).eq('id', session.user.id);
    setMyRate(newRate);
    setLoadingRate(false);
    return true; 
  }

  async function handleLogout() { await supabase.auth.signOut(); }

  // FIX: Reset index when clicking Home so video 1 plays
  const goToHome = () => {
      setView('feed');
      setFeedActiveIndex(0); // Forces logic to match the scroll-to-top
  };

  return (
    <div style={styles.desktopContainer}>
      <style>{animationStyles}</style>
      
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h1 style={styles.logo}>Letkin.</h1>
        <div style={styles.navMenu}>
          <div style={view === 'feed' ? styles.navItemActive : styles.navItem} onClick={goToHome}>
            <span style={styles.navIcon}>🏠</span> Home
          </div>
          <div style={view === 'search' ? styles.navItemActive : styles.navItem} onClick={() => setView('search')}>
            <span style={styles.navIcon}>🔍</span> Search
          </div>
          <div style={view === 'wallet' ? styles.navItemActive : styles.navItem} onClick={() => setView('wallet')}>
            <span style={styles.navIcon}>💳</span> Wallet
          </div>
          <div style={view === 'profile' ? styles.navItemActive : styles.navItem} onClick={() => setView('profile')}>
            <span style={styles.navIcon}>👤</span> Profile
          </div>
        </div>
        <div style={styles.sidebarFooter}>
          <div style={styles.avatarSmall}>{session.user.email ? session.user.email.charAt(0).toUpperCase() : 'U'}</div>
          <div style={{marginLeft: '10px'}}>
            <div style={styles.username}>{session.user.email ? '@' + session.user.email.split('@')[0] : 'User'}</div>
            <div style={styles.balance}>🪙 {credits} Credits</div>
          </div>
        </div>
      </div>

      {/* STAGE */}
      <div style={styles.stage}>
        
        {/* Scroll Hint */}
        {view === 'feed' && feedActiveIndex === 0 && (
            <div style={styles.scrollHint} className="bounce-arrow">
                <div style={styles.mouseIcon}><div style={styles.wheel}></div></div>
                <p style={styles.scrollText}>SCROLL DOWN</p>
                <div style={styles.arrowDown}>↓</div>
            </div>
        )}

        <div style={styles.mobileWrapper}>
          <div style={styles.contentArea}>
            {view === 'feed' && (
                // We pass 'kins' down instead of fetching it inside
                <FeedView 
                    kins={kins}
                    session={session} 
                    credits={credits} 
                    setCredits={setCredits} 
                    activeIndex={feedActiveIndex} 
                    setActiveIndex={setFeedActiveIndex} 
                />
            )}
            {view === 'search' && <SearchView />}
            {view === 'wallet' && <WalletView credits={credits} addFunds={addFunds} session={session} />}
            {view === 'profile' && <ProfileView session={session} myRate={myRate} updateMyRate={updateMyRate} loading={loadingRate} handleLogout={handleLogout} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- FEED VIEW (Optimized: No Fetching) ---
function FeedView({ kins, session, credits, setCredits, activeIndex, setActiveIndex }) {
  const [isGlobalMuted, setIsGlobalMuted] = useState(true);

  // No useEffect fetch here anymore! Data is instant.

  const handleScroll = (e) => {
    const index = Math.round(e.target.scrollTop / e.target.clientHeight);
    if (index !== activeIndex) setActiveIndex(index);
  };

  return (
    <div style={styles.scrollContainer} onScroll={handleScroll}>
      {kins.length === 0 ? <div style={styles.loadingText}>Loading...</div> : null}
      
      {kins.map((kin, index) => (
        <KinCard 
            key={kin.id} 
            kin={kin} 
            index={index} 
            activeIndex={activeIndex} 
            session={session} 
            credits={credits} 
            setCredits={setCredits} 
            isActive={index === activeIndex} 
            isGlobalMuted={isGlobalMuted} 
            toggleGlobalMute={() => setIsGlobalMuted(!isGlobalMuted)} 
        />
      ))}
    </div>
  );
}

function KinCard({ kin, index, activeIndex, session, credits, setCredits, isActive, isGlobalMuted, toggleGlobalMute }) {
  const videoRef = useRef(null);
  const isNear = index === activeIndex || index === activeIndex + 1;

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        // Force reload if needed
        if (videoRef.current.readyState === 0) videoRef.current.load();
        
        videoRef.current.currentTime = 0; 
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) playPromise.catch((e) => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive]);

  async function handleCall(creatorId) {
    let rate = 10; 
    if (creatorId) {
       const { data } = await supabase.from('profiles').select('rate_per_minute').eq('id', creatorId).single();
       if (data) rate = data.rate_per_minute;
    }
    if (credits < rate) return alert("Not enough credits!");
    if (!window.confirm(`Call creator for ${rate} credits/min?`)) return;
    const newBal = credits - rate;
    const { error } = await supabase.from('profiles').update({credits: newBal}).eq('id', session.user.id);
    if (!error) {
        setCredits(newBal);
        window.open('https://YOUR-DAILY-URL-HERE', '_blank'); 
    }
  }

  return (
    <div style={styles.videoCard}>
      <video ref={videoRef} src={kin.video_url} style={styles.videoPlayer} loop muted={isGlobalMuted} playsInline preload={isNear ? "auto" : "none"} onClick={toggleGlobalMute} />
      <div style={styles.soundIcon} onClick={toggleGlobalMute}>{isGlobalMuted ? '🔇' : '🔊'}</div>
      <div style={styles.overlay}>
        <div style={styles.tagBadge}>{(kin.tag || 'General').toUpperCase()}</div>
        <div style={styles.creatorInfo}>
          <h3 style={styles.creatorName}>{kin.creator_name || '@Creator'}</h3>
          <p style={styles.caption}>{kin.caption}</p>
        </div>
        <button style={styles.callButton} onClick={() => handleCall(kin.creator_id)}>📞 Call for Advice</button>
      </div>
    </div>
  );
}

// --- SEARCH VIEW ---
function SearchView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTab, setSearchTab] = useState('videos'); 
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const doSearch = async () => {
        setLoading(true);
        let data = [];
        if (searchTerm === '') {
            if (searchTab === 'videos') {
               const { data: vids } = await supabase.from('kins').select('*').limit(9);
               data = vids;
            } else {
               const { data: usrs } = await supabase.from('profiles').select('*').limit(10);
               data = usrs;
            }
        } else {
            if (searchTab === 'videos') {
                const { data: res } = await supabase.from('kins').select('*').or(`caption.ilike.%${searchTerm}%,tag.ilike.%${searchTerm}%`);
                data = res;
            } else {
                const { data: res } = await supabase.from('profiles').select('*').ilike('username', `%${searchTerm}%`);
                data = res;
            }
        }
        setResults(data || []);
        setLoading(false);
    };
    const delayDebounceFn = setTimeout(() => { doSearch(); }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchTab]);

  return (
    <div style={styles.searchContainer}>
      <h2 style={{color: 'white', marginBottom: '15px'}}>Explore</h2>
      
      <input type="text" placeholder="Search topics, tags, or people..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.searchBar} />
      
      <div style={styles.searchTabs}>
          <div style={searchTab === 'videos' ? styles.searchTabActive : styles.searchTab} onClick={() => setSearchTab('videos')}>VIDEOS</div>
          <div style={searchTab === 'people' ? styles.searchTabActive : styles.searchTab} onClick={() => setSearchTab('people')}>CREATORS</div>
      </div>
      {searchTerm === '' && searchTab === 'videos' && (
          <div style={styles.tags}>{['Startup', 'Finance', 'Coding', 'Health'].map(tag => (<span key={tag} style={styles.tag} onClick={() => setSearchTerm(tag)}>{tag}</span>))}</div>
      )}
      <div style={styles.resultsArea}>
          {loading ? <p style={{color: '#666', textAlign: 'center'}}>Searching...</p> : (
              <>
                {searchTab === 'videos' ? (
                    <div style={styles.searchVideoGrid}>
                        {results.map(kin => (<div key={kin.id} style={styles.gridItem}><video src={kin.video_url} style={styles.gridVideo} muted /></div>))}
                    </div>
                ) : (
                    <div style={styles.peopleList}>
                        {results.map(user => (
                            <div key={user.id} style={styles.personRow}>
                                <div style={styles.avatarSmall}>{user.username ? user.username.charAt(0).toUpperCase() : 'U'}</div>
                                <div style={{flex: 1}}><p style={{color: 'white', margin: 0, fontWeight: 'bold'}}>{user.username || 'User'}</p><p style={{color: '#00D09C', margin: 0, fontSize: '10px'}}>{user.rate_per_minute} credits/min</p></div>
                                <button style={styles.miniCallBtn}>Call</button>
                            </div>
                        ))}
                    </div>
                )}
              </>
          )}
      </div>
    </div>
  );
}

// --- WALLET & PROFILE ---
function WalletView({ credits, addFunds, session }) {
  const history = [
    { id: 1, type: 'in', title: 'Top Up', date: 'Today', amount: '+500' },
    { id: 2, type: 'out', title: 'Call with @Elon', date: 'Yesterday', amount: '-50' },
  ];
  return (
    <div style={styles.walletContainer}>
      <h2 style={styles.pageTitle}>My Wallet</h2>
      <div style={styles.creditCard}>
        <div style={styles.cardTop}><span style={styles.cardChip}></span><span style={styles.cardContactless}>)))</span></div>
        <div style={styles.cardBalance}><p style={styles.cardLabel}>Current Balance</p><h1>{credits} <span style={{fontSize: '16px'}}>Credits</span></h1></div>
        <div style={styles.cardBottom}><p style={styles.cardNumber}>**** **** **** 4242</p><p style={styles.cardName}>{session.user.email ? session.user.email.split('@')[0].toUpperCase() : 'USER'}</p></div>
      </div>
      <div style={styles.actionRow}>
        <div style={styles.actionBtnContainer} onClick={() => addFunds(100)}><div style={styles.actionBtn}>↓</div><span>Top Up</span></div>
        <div style={styles.actionBtnContainer} onClick={() => alert("Withdrawal initiated")}><div style={styles.actionBtnOut}>↑</div><span>Withdraw</span></div>
      </div>
      <div style={styles.historySection}>
        <h3 style={styles.historyTitle}>Recent Activity</h3>
        <div style={styles.historyList}>{history.map((item) => (<div key={item.id} style={styles.historyItem}><div style={styles.historyIcon}>{item.type === 'in' ? '↓' : '↑'}</div><div style={styles.historyInfo}><p style={styles.historyName}>{item.title}</p><p style={styles.historyDate}>{item.date}</p></div><div style={item.type === 'in' ? styles.amountGreen : styles.amountRed}>{item.amount}</div></div>))}</div>
      </div>
    </div>
  );
}

function ProfileView({ session, myRate, updateMyRate, loading, handleLogout }) {
  const [myKins, setMyKins] = useState([]);
  const [isEditing, setIsEditing] = useState(false); 
  const [rateInput, setRateInput] = useState(myRate);

  useEffect(() => {
    async function fetchMyKins() {
      const { data } = await supabase.from('kins').select('*').eq('creator_id', session.user.id); 
      setMyKins(data || []);
    }
    fetchMyKins();
  }, [session.user.id]);

  const saveProfile = async () => { await updateMyRate(rateInput); setIsEditing(false); };

  if (isEditing) {
      return (
          <div style={styles.editProfileContainer}>
              <h2 style={{color: 'white', marginBottom: '30px'}}>Edit Profile</h2>
              <div style={styles.editField}><label style={styles.label}>Call Rate</label><input type="number" value={rateInput} onChange={(e) => setRateInput(e.target.value)} style={styles.editInput} /><p style={{color: '#666', fontSize: '12px', marginTop: '5px'}}>Credits per minute</p></div>
              <div style={{width: '100%', marginTop: 'auto', display: 'flex', gap: '10px'}}><button onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Cancel</button><button onClick={saveProfile} style={styles.saveBtn}>{loading ? 'Saving...' : 'Save Changes'}</button></div>
          </div>
      )
  }

  return (
    <div style={styles.socialProfileContainer}>
      <div style={styles.profileHeaderCenter}>
        <div style={styles.avatarCenter}>{session.user.email ? session.user.email.charAt(0).toUpperCase() : 'U'}</div>
        <h2 style={styles.usernameCenter}>{session.user.email ? '@' + session.user.email.split('@')[0] : 'User'}</h2>
        <div style={styles.cleanRateBadge}>⚡ {myRate} credits/min</div>
      </div>
      <div style={styles.bioSectionCenter}>
        <p style={{color: '#ccc', fontSize: '14px', margin: '0 0 15px 0', textAlign: 'center'}}>Expert in Finance & Startups.<br/>Click call to book me immediately.</p>
        <div style={styles.actionButtons}><button style={styles.editProfileBtn} onClick={() => setIsEditing(true)}>Edit Profile</button><button style={styles.shareProfileBtn} onClick={handleLogout}>Log Out</button></div>
      </div>
      <div style={styles.statsRowCenter}><div style={styles.socialStat}><span style={styles.statNum}>{myKins.length}</span><span style={styles.statLabel}>Posts</span></div><div style={styles.socialStat}><span style={styles.statNum}>0</span><span style={styles.statLabel}>Followers</span></div><div style={styles.socialStat}><span style={styles.statNum}>0</span><span style={styles.statLabel}>Following</span></div></div>
      <div style={styles.gridTabs}><div style={styles.tabActive}>📹 VIDEOS</div></div>
      <div style={styles.videoGrid}>{myKins.length === 0 ? <div style={styles.emptyState}>No videos uploaded yet.</div> : myKins.map((kin) => (<div key={kin.id} style={styles.gridItem}><video src={kin.video_url} style={styles.gridVideo} muted /><div style={styles.gridOverlay}>▶ {Math.floor(Math.random() * 1000)}</div></div>))}</div>
    </div>
  );
}

// --- STYLES ---
const styles = {
  desktopContainer: { width: '100vw', height: '100vh', backgroundColor: '#000', display: 'flex', flexDirection: 'row', overflow: 'hidden' },
  sidebar: { width: '280px', height: '100%', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', padding: '40px', boxSizing: 'border-box', backgroundColor: '#0a0a0a', flexShrink: 0, zIndex: 10 },
  logo: { color: 'white', fontSize: '32px', fontWeight: '900', marginBottom: '60px' },
  navMenu: { display: 'flex', flexDirection: 'column', gap: '30px' },
  navItem: { color: '#888', fontSize: '18px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px', transition: '0.2s' },
  navItemActive: { color: '#00D09C', fontSize: '18px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' },
  navIcon: { fontSize: '24px' },
  sidebarFooter: { marginTop: 'auto', display: 'flex', alignItems: 'center', borderTop: '1px solid #222', paddingTop: '20px' },
  avatarSmall: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#333', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  username: { color: 'white', fontWeight: 'bold', fontSize: '14px' },
  balance: { color: '#00D09C', fontSize: '12px' },
  stage: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(circle at center, #1a2a26 0%, #000000 70%)', position: 'relative' },
  scrollHint: { position: 'absolute', right: '20%', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.5)' },
  mouseIcon: { width: '30px', height: '50px', border: '2px solid rgba(255,255,255,0.5)', borderRadius: '15px', position: 'relative', display: 'flex', justifyContent: 'center' },
  wheel: { width: '4px', height: '8px', backgroundColor: 'white', borderRadius: '2px', marginTop: '10px' },
  scrollText: { fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', margin: 0 },
  arrowDown: { fontSize: '20px' },
  mobileWrapper: { width: '375px', height: '85%', borderRadius: '40px', border: '4px solid #333', overflow: 'hidden', position: 'relative', backgroundColor: 'black', boxShadow: '0 0 60px rgba(0, 0, 0, 0.8)' },
  contentArea: { width: '100%', height: '100%' },
  scrollContainer: { height: '100%', width: '100%', overflowY: 'scroll', scrollSnapType: 'y mandatory', scrollbarWidth: 'none' },
  videoCard: { height: '100%', width: '100%', scrollSnapAlign: 'start', position: 'relative' },
  videoPlayer: { height: '100%', width: '100%', objectFit: 'cover' },
  overlay: { position: 'absolute', bottom: '0', left: '0', width: '100%', padding: '20px', boxSizing: 'border-box', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)', display: 'flex', flexDirection: 'column', gap: '15px' },
  tagBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', padding: '5px 12px', borderRadius: '20px', color: 'white', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', letterSpacing: '1px' },
  creatorInfo: { color: 'white' },
  creatorName: { margin: '0 0 5px 0', fontSize: '18px', fontWeight: 'bold' },
  caption: { margin: 0, fontSize: '14px', color: '#ddd' },
  callButton: { width: '100%', padding: '16px', backgroundColor: '#00D09C', color: '#000', border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  walletContainer: { height: '100%', width: '100%', backgroundColor: '#111', padding: '20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  pageTitle: { color: 'white', alignSelf: 'flex-start', margin: '10px 0 20px 0' },
  creditCard: { width: '100%', height: '200px', borderRadius: '20px', background: 'linear-gradient(135deg, #222 0%, #000 100%)', border: '1px solid #333', padding: '25px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 30px rgba(0, 208, 156, 0.1)', position: 'relative', overflow: 'hidden' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardChip: { width: '40px', height: '30px', backgroundColor: '#d4af37', borderRadius: '6px', opacity: 0.8 },
  cardContactless: { color: '#666', fontSize: '20px', fontWeight: 'bold', transform: 'rotate(90deg)' },
  cardBalance: { color: 'white' },
  cardLabel: { fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' },
  cardBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardNumber: { color: '#666', fontFamily: 'monospace', fontSize: '16px', letterSpacing: '2px' },
  cardName: { color: 'white', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' },
  actionRow: { display: 'flex', gap: '30px', marginTop: '30px', marginBottom: '30px' },
  actionBtnContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#aaa', fontSize: '12px', cursor: 'pointer' },
  actionBtn: { width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#00D09C', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'black', fontSize: '24px', fontWeight: 'bold', boxShadow: '0 5px 15px rgba(0,208,156,0.3)' },
  actionBtnOut: { width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#333', border: '1px solid #444', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '24px', fontWeight: 'bold' },
  historySection: { width: '100%', flex: 1, display: 'flex', flexDirection: 'column' },
  historyTitle: { color: '#666', fontSize: '14px', textTransform: 'uppercase', marginBottom: '15px' },
  historyList: { display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto' },
  historyItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #222' },
  historyIcon: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#222', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px' },
  historyInfo: { flex: 1, marginLeft: '15px' },
  historyName: { color: 'white', margin: 0, fontWeight: 'bold', fontSize: '14px' },
  historyDate: { color: '#666', margin: '4px 0 0 0', fontSize: '12px' },
  amountGreen: { color: '#00D09C', fontWeight: 'bold' },
  amountRed: { color: 'white', fontWeight: 'bold' },
  socialProfileContainer: { height: '100%', width: '100%', backgroundColor: '#111', padding: '20px', boxSizing: 'border-box', overflowY: 'auto' },
  profileHeaderCenter: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '15px' },
  avatarCenter: { width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#222', color: 'white', fontSize: '36px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '3px solid #00D09C', marginBottom: '10px' },
  usernameCenter: { color: 'white', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0' },
  cleanRateBadge: { color: '#00D09C', fontSize: '14px', fontWeight: 'bold', backgroundColor: 'rgba(0, 208, 156, 0.1)', padding: '5px 12px', borderRadius: '20px', letterSpacing: '0.5px' },
  statsRowCenter: { display: 'flex', justifyContent: 'space-around', width: '100%', marginBottom: '0', padding: '15px 0', borderTop: '1px solid #222' },
  socialStat: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statNum: { color: 'white', fontWeight: 'bold', fontSize: '18px' },
  statLabel: { color: '#888', fontSize: '12px' },
  bioSectionCenter: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' },
  actionButtons: { display: 'flex', gap: '10px', width: '100%', justifyContent: 'center' },
  editProfileBtn: { flex: 1, maxWidth: '120px', backgroundColor: '#222', border: '1px solid #333', color: 'white', padding: '8px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  shareProfileBtn: { flex: 1, maxWidth: '120px', backgroundColor: '#222', border: '1px solid #333', color: '#ff4d4d', padding: '8px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  gridTabs: { display: 'flex', justifyContent: 'center', borderTop: '1px solid #222', paddingTop: '10px', marginBottom: '2px' },
  tabActive: { color: 'white', borderBottom: '2px solid white', paddingBottom: '10px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' },
  videoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2px' },
  gridItem: { aspectRatio: '3/4', backgroundColor: '#222', position: 'relative' },
  gridVideo: { width: '100%', height: '100%', objectFit: 'cover' },
  gridOverlay: { position: 'absolute', bottom: '5px', left: '5px', color: 'white', fontSize: '10px', fontWeight: 'bold', textShadow: '0 1px 2px black' },
  emptyState: { gridColumn: '1 / span 3', textAlign: 'center', color: '#666', marginTop: '40px', fontSize: '14px' },
  editProfileContainer: { height: '100%', width: '100%', backgroundColor: '#111', padding: '20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' },
  editField: { marginBottom: '20px' },
  label: { color: '#888', fontSize: '12px', marginBottom: '8px', display: 'block', textTransform: 'uppercase' },
  editInput: { width: '100%', padding: '15px', backgroundColor: '#222', border: '1px solid #333', borderRadius: '12px', color: 'white', fontSize: '16px', boxSizing: 'border-box' },
  saveBtn: { flex: 2, padding: '15px', backgroundColor: '#00D09C', border: 'none', borderRadius: '12px', color: 'black', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' },
  cancelBtn: { flex: 1, padding: '15px', backgroundColor: '#222', border: '1px solid #333', borderRadius: '12px', color: 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' },
  genericContainer: { height: '100%', width: '100%', backgroundColor: '#111', padding: '20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  searchContainer: { height: '100%', width: '100%', backgroundColor: '#111', padding: '20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', overflowX: 'hidden' },
  searchBar: { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #333', backgroundColor: '#222', color: 'white', fontSize: '16px', marginBottom: '20px', boxSizing: 'border-box', outline: 'none' },
  searchTabs: { display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid #333' },
  searchTab: { color: '#666', paddingBottom: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', letterSpacing: '1px' },
  searchTabActive: { color: 'white', paddingBottom: '10px', borderBottom: '2px solid #00D09C', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', letterSpacing: '1px' },
  tags: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  tag: { padding: '8px 16px', backgroundColor: '#222', borderRadius: '20px', color: '#888', fontSize: '14px', border: '1px solid #333', cursor: 'pointer' },
  resultsArea: { flex: 1, overflowY: 'auto', marginTop: '20px', width: '100%' },
  searchVideoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2px' },
  peopleList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  personRow: { display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', backgroundColor: '#1a1a1a', borderRadius: '12px' },
  miniCallBtn: { backgroundColor: '#333', color: 'white', border: '1px solid #444', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
  soundIcon: { position: 'absolute', top: '20px', right: '20px', backgroundColor: 'rgba(0,0,0,0.5)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '20px', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0.2)' },
  loadingText: { color: '#666', textAlign: 'center', marginTop: '50px' }
};