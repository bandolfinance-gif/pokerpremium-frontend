import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export type NivelCurso = 'iniciante' | 'intermediario' | 'avancado';

export interface CursoResumo {
  id: string;
  titulo: string;
  categoria: string;
  nivel: NivelCurso;
  descricao: string;
  totalLicoes: number;
  progresso: number;
}

export interface LicaoDetalhe {
  indice: number;
  titulo: string;
  paginas: string[];
  temExercicio: boolean;
  pergunta: string | null;
  opcoes: string[] | null;
  concluida: boolean;
}

export interface CursoDetalhe {
  id: string;
  titulo: string;
  categoria: string;
  nivel: NivelCurso;
  descricao: string;
  progresso: number;
  concluido: boolean;
  licoes: LicaoDetalhe[];
}

export interface RespostaResultado {
  correta: boolean;
  explicacao: string;
  progresso: number;
  cursoConcluido: boolean;
}

export interface ConcluirResultado {
  concluida: boolean;
  progresso: number;
  cursoConcluido: boolean;
}

export interface Certificado {
  aluno: string;
  curso: string;
  dataConclusao: string;
  mensagem: string;
}

const authHeaders = (token?: string) => (token ? { Authorization: `Bearer ${token}` } : {});

// Catálogo e detalhe funcionam sem login (mostram o conteúdo), mas com
// token o backend enriquece a resposta com o progresso real do usuário.
export const fetchCursos = async (token?: string): Promise<CursoResumo[]> => {
  const { data } = await axios.get<CursoResumo[]>(`${API_URL}/cursos`, { headers: authHeaders(token) });
  return data;
};

export const fetchCurso = async (slug: string, token?: string): Promise<CursoDetalhe> => {
  const { data } = await axios.get<CursoDetalhe>(`${API_URL}/cursos/${slug}`, { headers: authHeaders(token) });
  return data;
};

export const responderExercicio = async (
  slug: string,
  indice: number,
  opcaoEscolhida: number,
  token: string
): Promise<RespostaResultado> => {
  const { data } = await axios.post<RespostaResultado>(
    `${API_URL}/cursos/${slug}/licoes/${indice}/responder`,
    { opcaoEscolhida },
    { headers: authHeaders(token) }
  );
  return data;
};

export const concluirLicao = async (slug: string, indice: number, token: string): Promise<ConcluirResultado> => {
  const { data } = await axios.post<ConcluirResultado>(
    `${API_URL}/cursos/${slug}/licoes/${indice}/concluir`,
    {},
    { headers: authHeaders(token) }
  );
  return data;
};

export const gerarCertificado = async (slug: string, token: string): Promise<Certificado> => {
  const { data } = await axios.post<Certificado>(`${API_URL}/cursos/${slug}/certificado`, {}, { headers: authHeaders(token) });
  return data;
};
