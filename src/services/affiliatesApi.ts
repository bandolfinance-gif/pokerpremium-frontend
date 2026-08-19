import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export interface AffiliatePlayer {
  id: string;
  name: string;
  email: string;
  chips: number;
  lastActiveAt: string | null;
  criadoEm: string;
}

const authHeaders = (token: string) => ({ Authorization: `Bearer ${token}` });

export const fetchMyAffiliates = async (token: string): Promise<AffiliatePlayer[]> => {
  const { data } = await axios.get<AffiliatePlayer[]>(`${API_URL}/affiliates`, { headers: authHeaders(token) });
  return data;
};

export const registerAffiliatePlayer = async (
  token: string,
  input: { name: string; email: string; password: string; documento?: string; dataNascimento?: string }
): Promise<AffiliatePlayer> => {
  const { data } = await axios.post<AffiliatePlayer>(`${API_URL}/affiliates`, input, { headers: authHeaders(token) });
  return data;
};
