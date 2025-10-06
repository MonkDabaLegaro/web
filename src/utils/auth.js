export const AUTH_STORAGE_KEY = 'isLoggedIn';
export const USER_TYPE_KEY = 'userType';

export function isAuthenticated() {
  return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
}

export function getUserType() {
  return localStorage.getItem(USER_TYPE_KEY);
}

export function login(username, password) {
  const adminUser = "admin";
  const adminPass = "1234";
  const clientUser = "cliente";
  const clientPass = "5678";

  if (username === adminUser && password === adminPass) {
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    localStorage.setItem(USER_TYPE_KEY, 'admin');
    return { success: true, userType: 'admin' };
  } else if (username === clientUser && password === clientPass) {
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    localStorage.setItem(USER_TYPE_KEY, 'cliente');
    return { success: true, userType: 'cliente' };
  }

  return { success: false, error: 'Usuario o contraseña incorrectos' };
}

export function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(USER_TYPE_KEY);
}
