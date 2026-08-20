const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Fotos/mídia novas vêm como URL completa do Supabase Storage
// (https://...supabase.co/...) — usa direto. Registros antigos (de antes
// da migração pro Supabase) ainda guardam um caminho relativo tipo
// "/uploads/avatars/x.jpg", que precisa do prefixo da API pra funcionar.
// Sem essa distinção, uma URL completa viraria algo tipo
// "http://api...https://supabase...", quebrada.
export const resolveMediaUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_URL}${path}`;
};
