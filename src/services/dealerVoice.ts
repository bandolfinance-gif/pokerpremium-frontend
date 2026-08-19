export interface DealerVoiceConfig {
  enabled: boolean;
  language: 'pt-BR' | 'en-US';
  mode: 'informative' | 'training';
}

export interface DealerEvent {
  type: 'action' | 'state' | 'training';
  message: string;
}

// Várias variações por evento (em vez de 1 frase fixa) — repetir a
// frase idêntica toda vez é uma das coisas que mais entrega "robô".
const MESSAGES_PT: Record<string, string[]> = {
  'poker-bet': ['Aposta na mesa.', 'Aposta realizada.'],
  'poker-call': ['Pagou a aposta.', 'Fechou a aposta.'],
  'poker-raise': ['Aumentou a aposta!', 'Subiu a parada.'],
  'poker-fold': ['Desistiu da mão.', 'Fora dessa mão.'],
  'poker-flop': ['Flop na mesa.', 'Aí vem o flop.'],
  'poker-turn': ['Turn revelado.', 'Quarta carta na mesa.'],
  'poker-river': ['River. Última carta.', 'E o river fecha o board.'],
  'poker-showdown': ['Showdown! Vamos ver as mãos.', 'Hora de revelar as cartas.'],
  'poker-reset': ['Nova mão começando.', 'Embaralhando pra próxima mão.'],
};

const MESSAGES_EN: Record<string, string[]> = {
  'poker-bet': ['Bet placed.', 'Money in the pot.'],
  'poker-call': ['Player calls.', 'Call is in.'],
  'poker-raise': ['Raise!', 'Player raises the stakes.'],
  'poker-fold': ['Player folds.', 'Out of this hand.'],
  'poker-flop': ['Flop is open.', 'Here comes the flop.'],
  'poker-turn': ['Turn card is in.', 'Fourth card on the board.'],
  'poker-river': ['River. Final card.', 'The river completes the board.'],
  'poker-showdown': ['Showdown! Let’s see those hands.', 'Time to reveal the cards.'],
  'poker-reset': ['New hand starting.', 'Shuffling for the next hand.'],
};

const pick = (options: string[]) => options[Math.floor(Math.random() * options.length)];

export const eventToDealerMessage = (type: string, config: DealerVoiceConfig): DealerEvent | null => {
  const table = config.language === 'en-US' ? MESSAGES_EN : MESSAGES_PT;
  const options = table[type];
  if (!options) return null;
  const category: DealerEvent['type'] = type.startsWith('poker-') && ['poker-flop', 'poker-turn', 'poker-river', 'poker-showdown', 'poker-reset'].includes(type)
    ? 'state'
    : 'action';
  return { type: category, message: pick(options) };
};

const MUTE_KEY = 'pokerpremium_dealer_muted';

export const isDealerMuted = (): boolean => localStorage.getItem(MUTE_KEY) === '1';

export const setDealerMuted = (muted: boolean) => {
  localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
};

export type DealerGender = 'female' | 'male';
const GENDER_KEY = 'pokerpremium_dealer_gender';
const DEALER_GENDER_EVENT = 'dealer-gender-changed';

export const getDealerGender = (): DealerGender =>
  localStorage.getItem(GENDER_KEY) === 'male' ? 'male' : 'female';

// Preferência é por navegador (mesmo padrão do mudo de voz), não por conta —
// cada jogador escolhe como quer ver/ouvir a dealer na própria mesa. O
// evento custom avisa os componentes já montados (DealerSeat) pra trocar
// avatar/voz na hora, sem precisar recarregar a página.
export const setDealerGender = (gender: DealerGender) => {
  localStorage.setItem(GENDER_KEY, gender);
  window.dispatchEvent(new CustomEvent(DEALER_GENDER_EVENT, { detail: { gender } }));
};

export const onDealerGenderChange = (cb: (gender: DealerGender) => void) => {
  const handler = (e: Event) => cb((e as CustomEvent<{ gender: DealerGender }>).detail.gender);
  window.addEventListener(DEALER_GENDER_EVENT, handler);
  return () => window.removeEventListener(DEALER_GENDER_EVENT, handler);
};

// Nomes comuns de vozes femininas/masculinas nas engines mais usadas
// (Windows/Edge, Chrome, macOS). A Web Speech API não expõe "gênero"
// diretamente — isso é a forma prática de preferir uma voz do gênero
// escolhido quando existir.
const FEMALE_VOICE_HINTS = [
  'female', 'mulher', 'maria', 'luciana', 'francisca', 'helena', 'catarina',
  'joana', 'zira', 'ana', 'valentina', 'raquel', 'fernanda',
];

const MALE_VOICE_HINTS = [
  'male', 'homem', 'daniel', 'antonio', 'antônio', 'ricardo', 'thiago',
  'felipe', 'diego', 'jorge', 'guy', 'david', 'miguel', 'pedro',
];

// Vozes "Natural"/"Online"/"Neural"/"Premium" (Edge/Windows 11 têm um
// pacote de vozes neurais bem menos robóticas que as vozes SAPI clássicas
// tipo "Zira Desktop") — priorizar essas quando existirem é o que mais
// muda a percepção de "robô" vs. "voz de verdade".
const NATURAL_VOICE_HINTS = ['natural', 'online', 'neural', 'premium', 'enhanced', 'plus'];

const pickVoiceByGender = (lang: string, gender: DealerGender): SpeechSynthesisVoice | null => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  const langVoices = voices.filter((v) => v.lang?.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()));
  const pool = langVoices.length > 0 ? langVoices : voices;

  const hints = gender === 'male' ? MALE_VOICE_HINTS : FEMALE_VOICE_HINTS;
  const matched = pool.filter((v) => hints.some((hint) => v.name.toLowerCase().includes(hint)));
  const naturalMatched = matched.find((v) => NATURAL_VOICE_HINTS.some((hint) => v.name.toLowerCase().includes(hint)));
  if (naturalMatched) return naturalMatched;
  if (matched[0]) return matched[0];

  const naturalAny = pool.find((v) => NATURAL_VOICE_HINTS.some((hint) => v.name.toLowerCase().includes(hint)));
  return naturalAny ?? pool[0] ?? null;
};

// Pequena variação aleatória de tom/velocidade a cada fala — fala sempre no
// MESMO pitch/rate é outro sinal forte de "robô". Faixa estreita o
// suficiente pra não soar bêbada, só tira a monotonia perfeita.
const jitter = (base: number, spread: number) => base + (Math.random() * 2 - 1) * spread;

export const speakText = (text: string, config: DealerVoiceConfig) => {
  if (!config.enabled || isDealerMuted()) return;
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // Cancela qualquer fala pendente/em andamento antes de começar a nova.
  // Sem isso, uma sequência rápida de eventos (várias mãos seguidas, por
  // exemplo) empilha utterances na fila do navegador e elas tocam uma
  // atrás da outra sem parar — o que soa exatamente como um eco, mesmo
  // sendo mensagens diferentes. A dealer deve sempre falar o evento MAIS
  // recente, não acumular um backlog de narração atrasada.
  window.speechSynthesis.cancel();

  const gender = getDealerGender();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = config.language;
  // Pitch base diferente por gênero — reusar o mesmo tom ajustado pra voz
  // feminina numa voz masculina soa artificial (fica agudo demais).
  utterance.pitch = gender === 'male' ? jitter(0.94, 0.05) : jitter(1.04, 0.05);
  utterance.rate = jitter(0.98, 0.04);
  const voice = pickVoiceByGender(config.language, gender);
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
};

export const speakDealerEvent = (event: DealerEvent, config: DealerVoiceConfig) => {
  speakText(event.message, config);
};

export const defaultDealerVoiceConfig: DealerVoiceConfig = {
  enabled: true,
  language: 'pt-BR',
  mode: 'informative',
};
