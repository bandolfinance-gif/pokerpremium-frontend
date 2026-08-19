import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export interface TournamentPlayer {
  userId: string;
  name: string;
}

export interface TournamentResult {
  userId: string;
  name: string;
  position: number;
  prize: number;
}

export interface TournamentInfo {
  id: string;
  nome: string;
  ownerId: string;
  ownerRole: string;
  buyIn: number;
  maxPlayers: number;
  startingStack: number;
  prizeDistribution: number[];
  status: 'aguardando' | 'rodando' | 'encerrado';
  registeredCount: number;
  registeredPlayers: TournamentPlayer[];
  prizePool: number;
  results: TournamentResult[];
  startedAt?: string;
  finishedAt?: string;
}

export const fetchTournaments = async (token: string): Promise<TournamentInfo[]> => {
  const { data } = await axios.get<TournamentInfo[]>(`${API_URL}/tournaments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const createTournament = async (
  token: string,
  nome: string,
  buyIn: number,
  maxPlayers: number
): Promise<TournamentInfo> => {
  const { data } = await axios.post<TournamentInfo>(
    `${API_URL}/tournaments`,
    { nome, buyIn, maxPlayers },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const registerForTournament = async (token: string, id: string): Promise<TournamentInfo> => {
  const { data } = await axios.post<TournamentInfo>(
    `${API_URL}/tournaments/${id}/inscrever`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const startTournament = async (token: string, id: string): Promise<TournamentInfo> => {
  const { data } = await axios.post<TournamentInfo>(
    `${API_URL}/tournaments/${id}/iniciar`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};
