
import { User } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          resolve({
            id: 'u1',
            name: 'Mert Yılmaz',
            email: email,
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            stats: {
              reviews: 12,
              favorites: 5,
              visited: 8
            }
          });
        } else {
          reject(new Error('Giriş başarısız'));
        }
      }, 1500);
    });
  },
  signup: async (name: string, email: string, password: string): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'u2',
          name: name,
          email: email,
          avatar: undefined, // No avatar initially
          stats: { reviews: 0, favorites: 0, visited: 0 }
        });
      }, 1500);
    });
  }
};
