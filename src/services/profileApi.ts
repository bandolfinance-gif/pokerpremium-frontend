import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  chips: number;
  tipoCadastro: 'fisica' | 'juridica';
  documento?: string;
  dataNascimento: string | null;
  avatarImage: string | null;
  criadoEm: string;
}

const authHeaders = (token: string) => ({ Authorization: `Bearer ${token}` });

export const fetchProfile = async (token: string): Promise<Profile> => {
  const { data } = await axios.get<Profile>(`${API_URL}/profile/me`, { headers: authHeaders(token) });
  return data;
};

export const updateProfile = async (
  token: string,
  updates: { name?: string; email?: string; tipoCadastro?: 'fisica' | 'juridica'; documento?: string; dataNascimento?: string | null }
): Promise<Profile> => {
  const { data } = await axios.patch<Profile>(`${API_URL}/profile`, updates, { headers: authHeaders(token) });
  return data;
};

export const changePassword = async (token: string, senhaAtual: string, novaSenha: string): Promise<{ message: string }> => {
  const { data } = await axios.post<{ message: string }>(
    `${API_URL}/profile/change-password`,
    { senhaAtual, novaSenha },
    { headers: authHeaders(token) }
  );
  return data;
};
