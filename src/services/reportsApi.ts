import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export type Periodo = 'diario' | 'semanal' | 'quinzenal' | 'mensal' | 'personalizado';

export interface ReportQuery {
  periodo: Periodo;
  data?: string;
  dataInicio?: string;
  dataFim?: string;
  ownerId?: string;
  jogadorId?: string;
}

export interface ReportOwner {
  id: string;
  name: string;
  role: string;
}

export interface ReportMesa {
  id: string;
  nome: string;
  dono: ReportOwner | null;
  status: string;
  rakePercent: number;
  maos: number;
  potTotal: number;
  rakeTotal: number;
  ultimaMao: string | null;
  platformCut: number;
  ownerCut: number;
}

export interface ReportTorneio {
  id: string;
  nome: string;
  dono: ReportOwner | null;
  status: string;
  buyIn: number;
  prizePool: number;
  jogadores: number;
  finishedAt: string | null;
  startedAt: string | null;
}

export interface Report {
  periodo: { inicio: string; fim: string };
  resumo: {
    totalMesas: number;
    mesasAtivas: number;
    totalMaos: number;
    totalTorneios: number;
    potTotal: number;
    rakeTotal: number;
    platformCutTotal: number;
    ownerCutTotal: number;
  };
  mesas: ReportMesa[];
  torneios: ReportTorneio[];
}

export interface ReportFiltros {
  donos: { id: string; name: string; role: string }[];
  jogadores: { id: string; name: string }[];
}

const authHeaders = (token: string) => ({ Authorization: `Bearer ${token}` });

export const fetchReport = async (token: string, query: ReportQuery): Promise<Report> => {
  const params: Record<string, string> = { periodo: query.periodo };
  if (query.data) params.data = query.data;
  if (query.dataInicio) params.dataInicio = query.dataInicio;
  if (query.dataFim) params.dataFim = query.dataFim;
  if (query.ownerId) params.ownerId = query.ownerId;
  if (query.jogadorId) params.jogadorId = query.jogadorId;

  const { data } = await axios.get<Report>(`${API_URL}/reports`, { params, headers: authHeaders(token) });
  return data;
};

export const fetchReportFiltros = async (token: string): Promise<ReportFiltros> => {
  const { data } = await axios.get<ReportFiltros>(`${API_URL}/reports/filtros`, { headers: authHeaders(token) });
  return data;
};
