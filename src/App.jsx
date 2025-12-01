import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import VideoFeed from './VideoFeed';
import Auth from './Auth';
import LandingPage from './LandingPage'; // Import the new page

function App() {
  const [session, setSession] = useState(null);
  const [hasLaunched, setHasLaunched] = useState(false); // Track if user clicked "Launch"

  useEffect(() => {
    // Check Supabase Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // 1. If user hasn't clicked "Launch App" yet, show Landing Page
  if (!hasLaunched) {
    return <LandingPage onLaunch={() => setHasLaunched(true)} />;
  }

  // 2. Once Launched: If no session, show Login. If session, show Feed.
  return (
    <div>
      {!session ? <Auth /> : <VideoFeed key={session.user.id} session={session} />}
    </div>
  );
}

export default App;