import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export interface CommunityComment {
  id: string;
  autorNome: string;
  texto: string;
  createdAt: string;
}

export interface CommunityFeedPost {
  id: string;
  autorId: string;
  autorNome: string;
  autorAvatarImage: string | null;
  texto: string;
  tipo: 'manual' | 'conquista';
  conquistaIcone: string | null;
  conquistaTitulo: string | null;
  midiaUrl: string | null;
  midiaTipo: 'imagem' | 'video' | null;
  curtidas: number;
  curtidoPorMim: boolean;
  comentarios: CommunityComment[];
  createdAt: string;
}

export interface CommunityAchievement {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  conquistado: boolean;
}

export interface CommunityMember {
  id: string;
  name: string;
  avatarImage: string | null;
  membroDesde: string;
  seguidores: number;
  souEu: boolean;
  sigo: boolean;
}

export interface CommunityFollowUser {
  id: string;
  name: string;
  avatarImage: string | null;
}

export interface CommunityProfile {
  id: string;
  name: string;
  avatarImage: string | null;
  membroDesde: string;
  achievements: CommunityAchievement[];
  followerCount: number;
  followingCount: number;
  sigo: boolean;
  souEu: boolean;
  posts: CommunityFeedPost[];
}

const authHeaders = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

export const fetchPosts = async (token: string, scope: 'todos' | 'seguindo' = 'todos'): Promise<CommunityFeedPost[]> => {
  const { data } = await axios.get<CommunityFeedPost[]>(`${API_URL}/community/posts?scope=${scope}`, authHeaders(token));
  return data;
};

export const createPost = async (token: string, texto: string, media?: File | null): Promise<CommunityFeedPost> => {
  const form = new FormData();
  form.append('texto', texto);
  if (media) form.append('media', media);
  const { data } = await axios.post<CommunityFeedPost>(`${API_URL}/community/posts`, form, authHeaders(token));
  return data;
};

export const toggleLike = async (token: string, postId: string): Promise<CommunityFeedPost> => {
  const { data } = await axios.post<CommunityFeedPost>(`${API_URL}/community/posts/${postId}/like`, {}, authHeaders(token));
  return data;
};

export const addComment = async (token: string, postId: string, texto: string): Promise<CommunityFeedPost> => {
  const { data } = await axios.post<CommunityFeedPost>(
    `${API_URL}/community/posts/${postId}/comments`,
    { texto },
    authHeaders(token)
  );
  return data;
};

export const fetchMembers = async (token: string): Promise<CommunityMember[]> => {
  const { data } = await axios.get<CommunityMember[]>(`${API_URL}/community/members`, authHeaders(token));
  return data;
};

export const followUser = async (token: string, userId: string): Promise<{ sigo: boolean }> => {
  const { data } = await axios.post<{ sigo: boolean }>(`${API_URL}/community/follow/${userId}`, {}, authHeaders(token));
  return data;
};

export const unfollowUser = async (token: string, userId: string): Promise<{ sigo: boolean }> => {
  const { data } = await axios.delete<{ sigo: boolean }>(`${API_URL}/community/follow/${userId}`, authHeaders(token));
  return data;
};

export const fetchFollowers = async (token: string, userId: string): Promise<CommunityFollowUser[]> => {
  const { data } = await axios.get<CommunityFollowUser[]>(`${API_URL}/community/followers/${userId}`, authHeaders(token));
  return data;
};

export const fetchFollowing = async (token: string, userId: string): Promise<CommunityFollowUser[]> => {
  const { data } = await axios.get<CommunityFollowUser[]>(`${API_URL}/community/following/${userId}`, authHeaders(token));
  return data;
};

export const fetchCommunityProfile = async (token: string, userId: string): Promise<CommunityProfile> => {
  const { data } = await axios.get<CommunityProfile>(`${API_URL}/community/profile/${userId}`, authHeaders(token));
  return data;
};
