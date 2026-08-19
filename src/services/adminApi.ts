import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export interface AdminTableSummary {
  id: string;
  nome: string;
  ownerRole: 'house' | 'agent';
  status: 'ativa' | 'aguardando' | 'encerrada';
  rakePercent: number;
  platformFeePercent: number;
  platformCutPercent: number;
  ownerCutPercent: number;
  createdAt: string;
}

export interface AdminPersonSummary {
  name: string;
  role: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface AdminOverview {
  totalUsers: number;
  usersByRole: Record<string, number>;
  totalMesas: number;
  mesasAtivas: number;
  mediaPlatformCutPercent: number;
  tables: AdminTableSummary[];
  recentSignups: AdminPersonSummary[];
  recentLogins: AdminPersonSummary[];
  platformFeePercent: number;
}

export const fetchAdminOverview = async (token: string): Promise<AdminOverview> => {
  const { data } = await axios.get<AdminOverview>(`${API_URL}/admin/overview`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updatePlatformFee = async (token: string, percent: number): Promise<{ platformFeePercent: number }> => {
  const { data } = await axios.patch<{ platformFeePercent: number }>(
    `${API_URL}/admin/platform-fee`,
    { percent },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};
