import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Local development mock auth fallback check
      const localAdmin = localStorage.getItem('portfolio_admin_logged_in');
      if (localAdmin === 'true') {
        setUser({ id: 'local-admin', email: 'iamabhaykharat@gmail.com' });
      }
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } else {
      // Local fallback auth
      if (email === 'iamabhaykharat@gmail.com' && password === 'admin123') {
        localStorage.setItem('portfolio_admin_logged_in', 'true');
        setUser({ id: 'local-admin', email });
        return { user: { id: 'local-admin', email } };
      } else {
        throw new Error('Invalid email or password. (Default dev admin: iamabhaykharat@gmail.com / admin123)');
      }
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('portfolio_admin_logged_in');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isSupabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
