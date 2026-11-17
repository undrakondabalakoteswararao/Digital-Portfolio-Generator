import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { getErrorMessage } from '../utils/errors';

const ProfileContext = createContext(null);

// Holds the logged-in student's profile + portfolio so every dashboard page (and the live preview) shares one source of truth.
export function ProfileProvider({ children }) {
  const { setUser } = useAuth();
  const [state, setState] = useState({ loading: true, error: null, profile: null, portfolio: null, name: '' });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const { data } = await api.get('/portfolio/me');
      setState({ loading: false, error: null, profile: data.profile, portfolio: data.portfolio, name: data.user.name });
    } catch (e) {
      setState((s) => ({ ...s, loading: false, error: getErrorMessage(e) }));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveProfile = async (changes) => {
    const { data } = await api.put('/profile', changes);
    setState((s) => ({ ...s, profile: data.profile, name: data.user.name }));
    setUser((u) => (u ? { ...u, name: data.user.name } : u));
    return data.profile;
  };
  const setProfile = (profile) => setState((s) => ({ ...s, profile }));
  const setPortfolio = (portfolio) => setState((s) => ({ ...s, portfolio }));

  const selectTemplate = async (templateId) => {
    const { data } = await api.put('/templates/select', { templateId });
    setPortfolio(data.portfolio);
  };
  const publish = async () => { const { data } = await api.post('/portfolio/publish'); setPortfolio(data.portfolio); };
  const unpublish = async () => { const { data } = await api.post('/portfolio/unpublish'); setPortfolio(data.portfolio); };
  const updateSlug = async (slug) => { const { data } = await api.put('/portfolio/me', { slug }); setPortfolio(data.portfolio); };

  return (
    <ProfileContext.Provider value={{ ...state, reload: load, saveProfile, setProfile, selectTemplate, publish, unpublish, updateSlug }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
