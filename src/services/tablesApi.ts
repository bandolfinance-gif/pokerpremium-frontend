import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export type TableVisibility = 'publica' | 'privada';

export interface InvitedUser {
  id: string;
  name?: string;
  email?: string;
}

export interface PokerTableInfo {
  id: string;
  nome: string;
  ownerId?: string;
  ownerRole?: 'house' | 'agent';
  status: 'ativa' | 'aguardando' | 'encerrada';
  visibilidade: TableVisibility;
  rakePercent?: number;
  platformFeePercent?: number;
  platformCutPercent?: number;
  ownerCutPercent?: number;
  convidados?: InvitedUser[];
  // Só preenchido na mesa-principal (o lobby livre) — as outras mesas
  // reais (house/agent) não têm essa contagem "ao vivo" na listagem.
  jogadoresSentados?: number;
  maxJogadores?: number;
  vocEstaNela?: boolean;
}

export const fetchTables = async (token: string): Promise<PokerTableInfo[]> => {
  const { data } = await axios.get<PokerTableInfo[]>(`${API_URL}/tables`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const createTable = async (
  token: string,
  nome: string,
  rakePercent: number,
  visibilidade: TableVisibility
): Promise<PokerTableInfo> => {
  const { data } = await axios.post<PokerTableInfo>(
    `${API_URL}/tables`,
    { nome, rakePercent, visibilidade },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const inviteToTable = async (token: string, tableId: string, email: string): Promise<PokerTableInfo> => {
  const { data } = await axios.post<PokerTableInfo>(
    `${API_URL}/tables/${tableId}/convidar`,
    { email },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};
