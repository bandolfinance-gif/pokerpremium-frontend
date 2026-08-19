// Dados de exemplo ainda usados pelo Painel do Jogador (ranking global e
// coleção de itens) — não têm backend real ainda (diferente das
// conquistas, que já são reais, ver services/achievements.js no backend e
// CommunityProfile.tsx no front). Extraído de CommunityView.tsx quando
// essa tela foi redesenhada, pra não quebrar esse import.
export interface CommunityPlayer {
  id: string;
  nome: string;
  vitorias: number;
  saldo: number;
  desempenho: number;
}

export interface Achievement {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  conquistado: boolean;
}

export interface CollectibleItem {
  id: string;
  nome: string;
  raridade: string;
  icone: string;
  obtido: boolean;
}

export const rarityColor: Record<string, string> = {
  comum: '#8fa3ad',
  raro: '#00eaff',
  epico: '#c084fc',
  lendario: '#ffd76a',
  mitico: '#ff6fae',
};

export const ranking: CommunityPlayer[] = [
  { id: '1', nome: 'PokerPro', vitorias: 142, saldo: 82500, desempenho: 68 },
  { id: '2', nome: 'AceMaster', vitorias: 118, saldo: 61200, desempenho: 61 },
  { id: '3', nome: 'LuckyStar', vitorias: 97, saldo: 45300, desempenho: 55 },
  { id: '4', nome: 'MarcioRei', vitorias: 74, saldo: 15250, desempenho: 49 },
];

export const achievements: Achievement[] = [
  { id: 'a1', titulo: 'Primeira vitória', descricao: 'Ganhou sua primeira partida.', icone: '🏆', conquistado: true },
  { id: 'a2', titulo: 'Maratona', descricao: 'Participou de 50 partidas.', icone: '🎮', conquistado: false },
  { id: 'a3', titulo: 'Campeão de torneio', descricao: 'Venceu um torneio oficial.', icone: '🥇', conquistado: true },
  { id: 'a4', titulo: 'All-in lendário', descricao: 'Venceu um all-in com menos de 10% de chance.', icone: '🔥', conquistado: false },
];

export const items: CollectibleItem[] = [
  { id: 'i1', nome: 'Coroa Lendária', raridade: 'lendario', icone: '👑', obtido: true },
  { id: 'i2', nome: 'Espada Épica', raridade: 'epico', icone: '⚔️', obtido: false },
  { id: 'i3', nome: 'Escudo Raro', raridade: 'raro', icone: '🛡️', obtido: true },
  { id: 'i4', nome: 'Ficha Mítica', raridade: 'mitico', icone: '💠', obtido: false },
  { id: 'i5', nome: 'Emblema Comum', raridade: 'comum', icone: '🎖️', obtido: true },
];
