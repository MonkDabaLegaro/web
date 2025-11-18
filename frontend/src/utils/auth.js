import { authService } from '../services/authService.js';

export const AUTH_STORAGE_KEY = 'isLoggedIn';
export const USER_TYPE_KEY = 'userType';

export function isAuthenticated() {
  return authService.isAuthenticated();
}

export function getUserType() {
  return authService.getUserType();
}

export async function login(username, password) {
  return await authService.login(username, password);
}

export function logout() {
  authService.logout();
}

// Funciones de compatibilidad para mantener la funcionalidad existente
export function getStoredAuth() {
  return {
    isLoggedIn: isAuthenticated(),
    userType: getUserType()
  };
}
