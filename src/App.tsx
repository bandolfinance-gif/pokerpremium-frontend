import React, { useState } from 'react';
import LoadingController from './components/loading/LoadingController';
import CockpitMain from './components/cockpit/CockpitMain';
import Login from './components/login/Login';
import { AuthUser, clearSession, getStoredSession, saveSession } from './services/authApi';

const App: React.FC = () => {
  const [session, setSession] = useState<{ user: AuthUser; token: string } | null>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('debug') === '1') {
      const role = (params.get('role') as AuthUser['role']) || 'player';
      const token = params.get('token') || 'debug-token';
      return { user: { id: 'debug', name: 'Debug Viewer', email: 'debug@pokerpremium.com', role }, token };
    }
    return getStoredSession();
  });

  const handleAuthenticated = (authUser: AuthUser, token: string) => {
    saveSession(token, authUser);
    setSession({ user: authUser, token });
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
  };

  const handleProfileUpdate = (updates: Partial<AuthUser>) => {
    setSession((prev) => {
      if (!prev) return prev;
      const updatedUser = { ...prev.user, ...updates };
      saveSession(prev.token, updatedUser);
      return { user: updatedUser, token: prev.token };
    });
  };

  return (
    <LoadingController>
      {session ? (
        <CockpitMain
          userId={session.user.id}
          userName={session.user.name}
          userRole={session.user.role}
          userAvatarImage={session.user.avatarImage ?? null}
          token={session.token}
          onLogout={handleLogout}
          onProfileUpdate={handleProfileUpdate}
        />
      ) : (
        <Login onAuthenticated={handleAuthenticated} />
      )}
    </LoadingController>
  );
};

export default App;
