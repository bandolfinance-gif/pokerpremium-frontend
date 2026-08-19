import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export type UserRole = 'admin' | 'player' | 'house' | 'agent';
export type TipoCadastro = 'fisica' | 'juridica';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tipoCadastro?: TipoCadastro;
  documento?: string;
  avatarImage?: string | null;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await axios.post<AuthResponse>(`${API_URL}/auth/login`, { email, password });
  return data;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role?: UserRole,
  tipoCadastro?: TipoCadastro,
  documento?: string
): Promise<AuthResponse> => {
  const { data } = await axios.post<AuthResponse>(`${API_URL}/auth/register`, {
    name,
    email,
    password,
    role,
    tipoCadastro,
    documento,
  });
  return data;
};

export const uploadAvatar = async (token: string, file: File): Promise<{ avatarImage: string }> => {
  const form = new FormData();
  form.append('avatar', file);
  const { data } = await axios.post<{ avatarImage: string }>(`${API_URL}/profile/avatar`, form, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

const TOKEN_KEY = 'pokerpremium_token';
const USER_KEY = 'pokerpremium_user';

export const saveSession = (token: string, user: AuthUser) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredSession = (): { token: string; user: AuthUser } | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  const rawUser = localStorage.getItem(USER_KEY);
  if (!token || !rawUser) return null;
  try {
    return { token, user: JSON.parse(rawUser) as AuthUser };
  } catch {
    return null;
  }
};

// Sessão inválida/expirada (ex.: token assinado com um JWT_SECRET antigo,
// depois de uma rotação de segredo) não deve deixar o usuário travado vendo
// erros confusos em cada ação. Qualquer 401 do backend desloga e manda de
// volta pro login automaticamente, pra fazer uma nova entrada limpa.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401 && getStoredSession()) {
      clearSession();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
