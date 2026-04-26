import { storage } from './storage';
import { STORAGE_KEYS, AUTH_ERRORS } from './constants';
import { User, Session } from './types/auth';

export const auth = {
  getCurrentSession: (): Session | null => {
    return storage.get<Session>(STORAGE_KEYS.SESSION);
  },

  signup: async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = storage.get<User[]>(STORAGE_KEYS.USERS) || [];
    
    if (users.find(u => u.email === email)) {
      return { success: false, error: AUTH_ERRORS.USER_EXISTS };
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password, // Plaintext as per Stage 3 TRD requirements
      createdAt: new Date().toISOString(),
    };

    storage.set(STORAGE_KEYS.USERS, [...users, newUser]);
    
    const session: Session = { userId: newUser.id, email: newUser.email };
    storage.set(STORAGE_KEYS.SESSION, session);

    return { success: true };
  },

  login: async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = storage.get<User[]>(STORAGE_KEYS.USERS) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return { success: false, error: AUTH_ERRORS.INVALID_CREDENTIALS };
    }

    const session: Session = { userId: user.id, email: user.email };
    storage.set(STORAGE_KEYS.SESSION, session);

    return { success: true };
  },

  logout: (): void => {
    storage.remove(STORAGE_KEYS.SESSION);
  }
};
