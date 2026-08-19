import React, { useEffect, useRef, useState } from 'react';
import TableSeat, { TableSeatData } from './TableSeat';
import DealerSeat from './DealerSeat';
import CommunityCards from './CommunityCards';
import ActionBar from './ActionBar';
import PhaseControl from './PhaseControl';
import { GameState } from '../../services/gameSocket';
import { dispatchPokerEvent, PokerEventType } from '../../services/PokerEventBus';
import FairnessVerify from './FairnessVerify';
import HandHistoryView from './HandHistoryView';
import { isPlayersAudioMuted, setPlayersAudioMuted, useTableVideo } from '../../services/tableVideo';

const OVAL_WIDTH = 780;
const OVAL_HEIGHT = 380;
const ACTION_ZONE_HEIGHT = 130;

// Distribui os assentos numa elipse, reservando um arco no topo (onde a
// dealer fica) pra nenhum assento nunca cair em cima dela. Espaçamento é
// por COMPRIMENTO DE ARCO EM PIXELS, não por ângulo — ângulos iguais NÃO
// viram espaçamento igual num oval bem mais largo que alto: os assentos
// perto dos lados (90°/270°) ficavam bem mais próximos entre si em
// pixels do que os de cima/baixo, colando um em cima do outro assim que
// a mesa passava de ~6 jogadores. Escala sozinho pra qualquer número.
const DEALER_RESERVED_DEG = 50; // graus de folga de cada lado do topo, reservados pra dealer
const SEAT_RX_PCT = 54; // raio horizontal, em % a partir do centro do oval
// Vertical bem mais raso que o horizontal de propósito: o oval é bem
// mais largo que alto, e um raio vertical grande jogava o assento de
// baixo (180°) pra fora do oval, direto em cima da barra FOLD/CALL/
// RAISE, que fica logo abaixo.
const SEAT_RY_PCT = 34;

const buildArcTable = (rxPx: number, ryPx: number, startDeg: number, endDeg: number, steps = 720) => {
  const table: { deg: number; cum: number }[] = [{ deg: startDeg, cum: 0 }];
  let prevX = rxPx * Math.sin((startDeg * Math.PI) / 180);
  let prevY = -ryPx * Math.cos((startDeg * Math.PI) / 180);
  let cum = 0;
  for (let i = 1; i <= steps; i++) {
    const deg = startDeg + ((endDeg - startDeg) * i) / steps;
    const rad = (deg * Math.PI) / 180;
    const x = rxPx * Math.sin(rad);
    const y = -ryPx * Math.cos(rad);
    cum += Math.hypot(x - prevX, y - prevY);
    table.push({ deg, cum });
    prevX = x;
    prevY = y;
  }
  return table;
};

const angleAtArcFraction = (table: { deg: number; cum: number }[], fraction: number) => {
  const target = fraction * table[table.length - 1].cum;
  for (let i = 1; i < table.length; i++) {
    if (table[i].cum >= target) {
      const prev = table[i - 1];
      const curr = table[i];
      const t = (target - prev.cum) / (curr.cum - prev.cum || 1);
      return prev.deg + (curr.deg - prev.deg) * t;
    }
  }
  return table[table.length - 1].deg;
};

// Tabela calculada uma única vez (os raios e o tamanho do oval são
// constantes) — reaproveitada pra qualquer quantidade de jogadores.
const SEAT_ARC_TABLE = buildArcTable(
  (SEAT_RX_PCT / 100) * OVAL_WIDTH,
  (SEAT_RY_PCT / 100) * OVAL_HEIGHT,
  DEALER_RESERVED_DEG,
  360 - DEALER_RESERVED_DEG
);

const getSeatPosition = (index: number, total: number): React.CSSProperties => {
  if (total <= 1) {
    return { left: '50%', top: `${50 + SEAT_RY_PCT}%` };
  }
  const angleDeg = angleAtArcFraction(SEAT_ARC_TABLE, index / (total - 1));
  const angleRad = (angleDeg * Math.PI) / 180;
  const left = 50 + SEAT_RX_PCT * Math.sin(angleRad);
  const top = 50 - SEAT_RY_PCT * Math.cos(angleRad);
  return { left: `${left}%`, top: `${top}%` };
};

interface PokerTableProps {
  userId: string;
  token: string;
  tableId: string;
  state: GameState | null;
  error: string;
  startHand: () => void;
  sendAction: (action: 'fold' | 'check' | 'call' | 'raise', amount?: number) => void;
  leaveTable: () => void;
}

// Mesa de poker real: baralho embaralhado de verdade, blinds, apostas
// validadas, side pots e showdown — tudo vindo do motor no backend via
// WebSocket autenticado. A conexão em si (useGameSocket) vive em
// CockpitMain, não aqui — assim ela continua ativa mesmo quando o jogador
// troca de aba (ex.: pra ver o Cockpit IA), em vez de cair toda vez que
// este componente desmonta.
const PokerTable: React.FC<PokerTableProps> = ({ userId, token, tableId, state, error, startHand, sendAction, leaveTable }) => {
  const prevStageRef = useRef<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // A mesa inteira (oval + zona de ação) foi desenhada num tamanho fixo
  // (OVAL_WIDTH=780px) — do jeito que estava, em qualquer tela de celular
  // (~375-428px) ela simplesmente estourava a largura da tela, cortando
  // botões e deixando tudo "deslinhado". Em vez de reescrever toda a
  // matemática de posicionamento (arco dos assentos etc.) em unidades
  // relativas, escala a mesa inteira pra caber na largura disponível,
  // mantendo os mesmos cálculos internos em pixels intactos.
  const tableWrapRef = useRef<HTMLDivElement>(null);
  const [tableScale, setTableScale] = useState(1);
  useEffect(() => {
    const recomputeScale = () => {
      const available = tableWrapRef.current?.parentElement?.clientWidth ?? window.innerWidth;
      setTableScale(Math.min(1, (available - 24) / OVAL_WIDTH));
    };
    recomputeScale();
    window.addEventListener('resize', recomputeScale);
    return () => window.removeEventListener('resize', recomputeScale);
  }, []);
  // Mudo do som DOS JOGADORES na câmera, separado do mudo da voz da
  // dealer (ChatBox) — dá pra combinar dos dois jeitos: só dealer, só
  // jogadores, os dois juntos, ou nenhum.
  const [playersAudioMuted, setPlayersAudioMutedState] = useState(isPlayersAudioMuted());
  const togglePlayersAudio = () => {
    const next = !playersAudioMuted;
    setPlayersAudioMutedState(next);
    setPlayersAudioMuted(next);
  };

  const hand = state?.hand ?? null;
  // Se eu já pedi pra sair mas ainda tô na mão atual (não era minha vez),
  // o servidor guarda isso em leavingPlayerIds até a mão fechar — mostra
  // um aviso FIXO em vez de um toast que sumia em menos de 1s toda vez
  // que qualquer jogador agia (o "SAIR DA MESA" parecia não fazer nada).
  const isLeaving = !!(userId && state?.leavingPlayerIds?.includes(userId));
  const seats: TableSeatData[] = (state?.tableSeats ?? []).map((s) => ({
    userId: s.userId,
    name: s.name,
    chips: s.chips,
    connected: s.connected,
    avatarImage: s.avatarImage,
  }));
  const myIndex = seats.findIndex((s) => s.userId === userId);

  const { cameraOn, localStream, remoteStreams, toggleCamera, error: videoError } = useTableVideo(
    tableId,
    token,
    userId,
    seats.map((s) => s.userId)
  );

  // Mantém o resto do cockpit (HUDs da aba "Cockpit IA", voz da dealer)
  // sincronizado com o estado real do jogo — antes esses eventos vinham
  // de botões decorativos, agora vêm do motor de verdade.
  useEffect(() => {
    if (!hand) return;
    if (prevStageRef.current !== hand.stage) {
      if (hand.stage !== 'preflop') {
        dispatchPokerEvent(`poker-${hand.stage}` as PokerEventType);
      }
      prevStageRef.current = hand.stage;
    }
  }, [hand]);

  useEffect(() => {
    if (!hand) prevStageRef.current = null;
  }, [hand]);

  const handleAction = (action: 'fold' | 'check' | 'call' | 'raise', amount?: number) => {
    sendAction(action, amount);
    if (action === 'fold') dispatchPokerEvent('poker-fold');
    if (action === 'call' || action === 'check') dispatchPokerEvent('poker-call');
    if (action === 'raise') dispatchPokerEvent('poker-raise', { amount });
  };

  const toolbarBtn: React.CSSProperties = {
    padding: '5px 14px',
    borderRadius: 20,
    fontFamily: 'monospace',
    fontSize: '10px',
    letterSpacing: '0.5px',
    cursor: 'pointer',
  };

  return (
    <>
      {/* Barra de controles da mesa — ancorada no topo da área de conteúdo,
          logo abaixo do cabeçalho da plataforma. Puxada pra direita, saindo
          debaixo de "Comunidade"/"Cursos" no menu — não fica dead-center
          porque aí cairia bem em cima do rosto da dealer, que já ocupa o
          centro do oval embaixo. */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 0,
          right: 0,
          display: 'flex',
          // flex-end (com padding fixo à direita) em vez de "centro +
          // deslocamento em px" — o deslocamento fixo exigia recalcular
          // toda vez que um botão novo era adicionado (o balão ficava
          // largo o suficiente pra voltar a colidir com a dealer).
          // Ancorado na direita, crescer pra esquerda nunca chega perto
          // dela de novo.
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingRight: 40,
          zIndex: 6,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
        {hand?.serverSeedHash && <FairnessVerify hand={hand} />}

        <button
          onClick={toggleCamera}
          title={videoError || (cameraOn ? 'Desligar câmera' : 'Ligar câmera pros outros jogadores verem você')}
          style={{
            ...toolbarBtn,
            border: cameraOn ? '1px solid #7dff9c' : '1px solid rgba(0,234,255,0.5)',
            background: cameraOn ? 'rgba(125,255,156,0.12)' : 'rgba(0,234,255,0.1)',
            color: cameraOn ? '#7dff9c' : '#00eaff',
          }}
        >
          {cameraOn ? '📷 CÂMERA ON' : '📷 CÂMERA'}
        </button>

        <button
          onClick={togglePlayersAudio}
          title={playersAudioMuted ? 'Ativar som dos outros jogadores' : 'Silenciar som dos outros jogadores'}
          style={{
            ...toolbarBtn,
            border: playersAudioMuted ? '1px solid rgba(255,77,109,0.5)' : '1px solid rgba(0,234,255,0.5)',
            background: playersAudioMuted ? 'rgba(255,77,109,0.1)' : 'rgba(0,234,255,0.1)',
            color: playersAudioMuted ? '#ff4d6d' : '#00eaff',
          }}
        >
          {playersAudioMuted ? '🔇 JOGADORES' : '🔊 JOGADORES'}
        </button>

        <button
          onClick={() => setShowHistory(true)}
          style={{ ...toolbarBtn, border: '1px solid rgba(0,234,255,0.5)', background: 'rgba(0,234,255,0.1)', color: '#00eaff' }}
        >
          HISTÓRICO
        </button>

        <button
          onClick={leaveTable}
          disabled={isLeaving}
          style={{
            ...toolbarBtn,
            border: '1px solid rgba(255,77,109,0.5)',
            background: 'rgba(255,77,109,0.1)',
            color: '#ff4d6d',
            opacity: isLeaving ? 0.6 : 1,
            cursor: isLeaving ? 'default' : 'pointer',
          }}
        >
          {isLeaving ? 'SAINDO...' : 'SAIR DA MESA'}
        </button>
        </div>
      </div>

      {videoError && (
        <div style={{ position: 'absolute', top: 46, left: 0, right: 0, textAlign: 'center', color: '#ff4d6d', fontFamily: 'monospace', fontSize: 10 }}>
          {videoError}
        </div>
      )}

      {isLeaving && (
        <div style={{ position: 'absolute', top: 46, left: 0, right: 0, textAlign: 'center', color: '#ffd76a', fontFamily: 'monospace', fontSize: 11 }}>
          Você vai sair da mesa assim que esta mão terminar.
        </div>
      )}

      <div
        ref={tableWrapRef}
        style={{
          position: 'absolute',
          top: 'calc(50% + 60px)',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${tableScale})`,
          width: OVAL_WIDTH,
          height: OVAL_HEIGHT + ACTION_ZONE_HEIGHT,
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: OVAL_WIDTH, height: OVAL_HEIGHT }}>
          <PhaseControl hand={hand} seatedCount={seats.length} onStartHand={startHand} />
          <DealerSeat />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(0,40,60,0.55), rgba(0,10,20,0.85))',
            border: '2px solid #00eaff',
            boxShadow: '0 0 40px rgba(0,234,255,0.35), inset 0 0 60px rgba(0,234,255,0.08)',
          }}
        />

        {error && (
          <div style={{ position: 'absolute', top: 44, left: '50%', transform: 'translateX(-50%)', color: '#ff4d6d', fontFamily: 'monospace', fontSize: 11 }}>
            {error}
          </div>
        )}

        {seats.length === 0 && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'rgba(0,234,255,0.5)', fontFamily: 'monospace', fontSize: 12 }}>
            Conectando à mesa...
          </div>
        )}

        {seats.map((seat, i) => {
          const isMe = seat.userId === userId;
          // O JOGADOR DA VEZ (você) sempre fica embaixo, de frente pra
          // dealer — igual todo cliente de poker de verdade. Sem isso, sua
          // posição na tela dependia da ordem em que você sentou, então às
          // vezes você aparecia do lado, longe da barra FOLD/CALL/RAISE
          // (que fica sempre embaixo, no centro), confundindo qual assento
          // era o seu. Gira os outros jogadores ao redor de você mantendo
          // a ordem relativa real da mesa, só re-ancorada em você.
          const total = seats.length;
          const middleIndex = Math.floor((total - 1) / 2);
          const rotation = myIndex >= 0 ? myIndex - middleIndex : 0;
          const displayIndex = ((i - rotation) % total + total) % total;
          return (
            <TableSeat
              key={seat.userId}
              seat={seat}
              style={getSeatPosition(displayIndex, total)}
              handPlayer={hand?.players.find((p) => p.id === seat.userId)}
              isDealer={hand?.dealerPlayerId === seat.userId}
              isActing={hand?.actingPlayerId === seat.userId}
              isMe={isMe}
              showdown={hand?.stage === 'showdown'}
              videoStream={isMe ? localStream : remoteStreams[seat.userId]}
              videoMuted={isMe || playersAudioMuted}
            />
          );
        })}

        <CommunityCards hand={hand} />

        {hand?.complete && hand.results && (
          <div
            style={{
              position: 'absolute',
              // Logo abaixo do balão "Hora de revelar as cartas" da dealer
              // (que fica em top:45) e acima das cartas comunitárias (que
              // ficam centralizadas em 46% da altura) — antes ficava colado
              // no fundo da mesa (bottom:8), exatamente em cima do nome do
              // jogador da vez (que fica sempre embaixo, de frente à
              // dealer), poluindo a área dele.
              top: 92,
              left: '50%',
              width: '100%',
              transform: 'translateX(-50%)',
              color: '#7dff9c',
              fontFamily: 'monospace',
              fontSize: 11,
              textAlign: 'center',
              padding: '0 12px',
            }}
          >
            {hand.results.wonByFold
              ? `${hand.players.find((p) => p.id === hand.results!.pots[0].winners[0])?.name ?? ''} venceu (todos desistiram)`
              : hand.results.pots
                  .map(
                    (pot) =>
                      `${pot.winners.map((w) => hand.players.find((p) => p.id === w)?.name).join(' e ')} venceu com ${pot.handName} (${pot.amount})`
                  )
                  .join(' · ')}
          </div>
        )}
      </div>

      <div
        style={{
          position: 'absolute',
          top: OVAL_HEIGHT,
          left: 0,
          width: OVAL_WIDTH,
          height: ACTION_ZONE_HEIGHT,
        }}
      >
        {hand?.actingPlayerId === userId && !hand.complete && (
          <ActionBar legalActions={hand.legalActions} turnDeadline={hand.turnDeadline} onAction={handleAction} />
        )}

        {hand && !hand.complete && hand.actingPlayerId && hand.actingPlayerId !== userId && (
          <div
            style={{
              position: 'absolute',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'rgba(0,234,255,0.6)',
              fontFamily: 'monospace',
              fontSize: 12,
              textAlign: 'center',
            }}
          >
            Aguardando {hand.players.find((p) => p.id === hand.actingPlayerId)?.name ?? 'jogador'}...
          </div>
        )}

        {(!hand || hand.complete) && (
          <div
            style={{
              position: 'absolute',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'rgba(0,234,255,0.4)',
              fontFamily: 'monospace',
              fontSize: 12,
              textAlign: 'center',
            }}
          >
            {seats.length < 2 ? 'Aguardando mais jogadores...' : 'Aguardando próxima mão...'}
          </div>
        )}
      </div>

      {showHistory && <HandHistoryView token={token} tableId={tableId} onClose={() => setShowHistory(false)} />}
      </div>
    </>
  );
};

export default PokerTable;
