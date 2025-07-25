
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AdminSession {
  isAuthenticated: boolean;
  user?: {
    id: string;
    email: string;
    username: string;
  };
  expiresAt?: number;
}

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const SESSION_KEY = 'fdr_admin_session';

export const adminAuth = {
  async login(password: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Rate limiting check
      const lastAttempt = localStorage.getItem('fdr_admin_last_attempt');
      const attempts = parseInt(localStorage.getItem('fdr_admin_attempts') || '0');
      
      if (attempts >= 5 && lastAttempt) {
        const timeSinceLastAttempt = Date.now() - parseInt(lastAttempt);
        if (timeSinceLastAttempt < 15 * 60 * 1000) { // 15 minutes
          return { success: false, error: 'Too many failed attempts. Please try again in 15 minutes.' };
        }
      }

      const { data, error } = await supabase.functions.invoke('validate-admin-password', {
        body: { password }
      });

      if (error) {
        this.recordFailedAttempt();
        return { success: false, error: 'Authentication failed' };
      }

      if (data?.isValid) {
        // Clear failed attempts
        localStorage.removeItem('fdr_admin_attempts');
        localStorage.removeItem('fdr_admin_last_attempt');
        
        // Create secure session
        const session: AdminSession = {
          isAuthenticated: true,
          user: {
            id: 'admin',
            email: 'admin@fastdrrecovery.com',
            username: 'admin'
          },
          expiresAt: Date.now() + SESSION_DURATION
        };
        
        this.setSession(session);
        return { success: true };
      } else {
        this.recordFailedAttempt();
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      this.recordFailedAttempt();
      return { success: false, error: 'Authentication failed' };
    }
  },

  recordFailedAttempt() {
    const attempts = parseInt(localStorage.getItem('fdr_admin_attempts') || '0') + 1;
    localStorage.setItem('fdr_admin_attempts', attempts.toString());
    localStorage.setItem('fdr_admin_last_attempt', Date.now().toString());
  },

  setSession(session: AdminSession) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  getSession(): AdminSession | null {
    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (!sessionData) return null;
      
      const session: AdminSession = JSON.parse(sessionData);
      
      // Check if session is expired
      if (session.expiresAt && Date.now() > session.expiresAt) {
        this.clearSession();
        return null;
      }
      
      return session;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    const session = this.getSession();
    return session?.isAuthenticated || false;
  },

  clearSession() {
    localStorage.removeItem(SESSION_KEY);
  },

  logout() {
    this.clearSession();
  }
};
