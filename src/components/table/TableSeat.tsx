import React, { useEffect, useRef } from 'react';
import PlayerAvatarRenderer, { PlayerAvatar } from './PlayerAvatarRenderer';
import Card from './Card';
import { HandPlayerState } from '../../services/gameSocket';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export interface TableSeatData {
  userId: string;
  name: string;
  chips: number;
  connected: boolean;
  avatarImage: string | null;
}

interface TableSeatProps {
  seat: TableSeatData;
  style: React.CSSProperties;
  handPlayer?: HandPlayerState;
  isDealer?: boolean;
  isActing?: boolean;
  isMe?: boolean;
  showdown?: boolean;
  videoStream?: MediaStream | null;
  videoMuted?: boolean;
}

const initials = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

// Assento de jogador na mesa: avatar + nome + fichas + cartas na mão
// (viradas pra cima só pra você mesmo, ou pra todo mundo no showdown).
const TableSeat: React.FC<TableSeatProps> = ({ seat, style, handPlayer, isDealer, isActing, isMe, showdown, videoStream, videoMuted }) => {
  const folded = handPlayer?.folded;
  const ringColor = isActing ? '#ffd76a' : folded ? '#5a6672' : '#00eaff';
  const avatar: PlayerAvatar | undefined = seat.avatarImage
    ? { id: seat.userId, avatarImage: `${API_URL}${seat.avatarImage}`, avatarType: 'photo' }
    : undefined;

  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.srcObject = videoStream ?? null;
    // Alguns navegadores ignoram silenciosamente o autoplay de mídia com
    // áudio (o vídeo do PRÓPRIO jogador vem mudo de propósito, mas o dos
    // outros jogadores tem áudio e precisa desse play() explícito, senão
    // fica um quadro parado sem som em vez de tocar).
    if (videoStream) el.play().catch(() => {});
  }, [videoStream]);

  // O atributo `muted` do JSX só é confiável na CRIAÇÃO do elemento — o
  // React não reaplica ele de forma consistente depois, num <video> que
  // já está tocando (é um problema conhecido). Sem isso, o botão "🔊/🔇
  // JOGADORES" mudava o estado mas o áudio continuava do jeito que
  // estava antes. Setando a propriedade do DOM direto resolve.
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = !!videoMuted;
  }, [videoMuted]);

  return (
    <div style={{ position: 'absolute', ...style, width: 110, transform: 'translate(-50%, -50%)', textAlign: 'center', opacity: folded ? 0.45 : 1 }}>
      {handPlayer?.holeCards && (
        <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginBottom: 4 }}>
          <Card card={handPlayer.holeCards[0]} width={26} height={36} />
          <Card card={handPlayer.holeCards[1]} width={26} height={36} />
        </div>
      )}
      {handPlayer && !handPlayer.holeCards && !folded && (
        <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginBottom: 4 }}>
          <Card faceDown width={26} height={36} />
          <Card faceDown width={26} height={36} />
        </div>
      )}

      <div style={{ position: 'relative', margin: '0 auto', width: 56, height: 56 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            boxShadow: isActing ? '0 0 16px #ffd76a' : 'none',
            border: `2px solid ${ringColor}`,
            overflow: 'hidden',
          }}
        >
          {videoStream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={!!videoMuted}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: isMe ? 'scaleX(-1)' : 'none' }}
            />
          ) : (
            <PlayerAvatarRenderer avatar={avatar} fallbackInitials={initials(seat.name)} size={52} />
          )}
        </div>
        {isDealer && (
          <div
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: '#ffd76a',
              color: '#05070a',
              fontSize: 10,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #05070a',
            }}
          >
            D
          </div>
        )}
        {!seat.connected && (
          <div
            style={{
              position: 'absolute',
              bottom: -4,
              right: -4,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#ff4d6d',
              border: '1px solid #05070a',
            }}
            title="Desconectado"
          />
        )}
      </div>

      <div
        style={{
          marginTop: 4,
          color: isMe ? '#ffd76a' : '#e8fdff',
          fontFamily: 'monospace',
          fontSize: '12px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        title={seat.name}
      >
        {seat.name}{isMe ? ' (você)' : ''}
      </div>
      <div style={{ color: '#ffd76a', fontFamily: 'monospace', fontSize: '11px' }}>
        {(handPlayer ? handPlayer.stack : seat.chips).toLocaleString('pt-BR')}
      </div>
      {handPlayer && handPlayer.currentBet > 0 && (
        <div style={{ color: '#00eaff', fontFamily: 'monospace', fontSize: '10px' }}>
          aposta: {handPlayer.currentBet.toLocaleString('pt-BR')}
        </div>
      )}
      {handPlayer?.allIn && <div style={{ color: '#ff6fae', fontFamily: 'monospace', fontSize: '10px' }}>ALL-IN</div>}
      {folded && <div style={{ color: '#5a6672', fontFamily: 'monospace', fontSize: '10px' }}>FOLD</div>}
      {showdown && handPlayer?.holeCards && (
        <div style={{ color: '#7dff9c', fontFamily: 'monospace', fontSize: '10px' }}>
          {/* nome da mão vem do results.hands, resolvido pelo componente pai */}
        </div>
      )}
    </div>
  );
};

export default TableSeat;
