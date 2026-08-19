import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export interface TableInvite {
  id: string;
  tableId: string;
  tableName: string;
  fromName: string;
  createdAt: string;
}

const authHeaders = (token: string) => ({ Authorization: `Bearer ${token}` });

export const pingPresence = async (token: string): Promise<void> => {
  await axios.post(`${API_URL}/presence/ping`, {}, { headers: authHeaders(token) });
};

export const fetchPendingInvites = async (token: string): Promise<TableInvite[]> => {
  const { data } = await axios.get<TableInvite[]>(`${API_URL}/invites/pending`, { headers: authHeaders(token) });
  return data;
};

export const acceptInvite = async (token: string, inviteId: string): Promise<{ tableId: string }> => {
  const { data } = await axios.post<{ tableId: string }>(
    `${API_URL}/invites/${inviteId}/accept`,
    {},
    { headers: authHeaders(token) }
  );
  return data;
};

export const declineInvite = async (token: string, inviteId: string): Promise<void> => {
  await axios.post(`${API_URL}/invites/${inviteId}/decline`, {}, { headers: authHeaders(token) });
};
