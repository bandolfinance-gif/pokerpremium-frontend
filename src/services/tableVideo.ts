import { useEffect, useRef, useState } from 'react';

// Sinalização de vídeo piggyback no mesmo socket do chat (mesma porta/host
// do backend, caminho /chat — ver server.js).
const WS_BASE_URL = process.env.REACT_APP_WS_BASE_URL || 'ws://localhost:3001';
const WS_URL = `${WS_BASE_URL}/chat`;

// Mudo do ÁUDIO DOS OUTROS JOGADORES na câmera ao vivo — separado do mudo
// da voz da dealer (dealerVoice.ts), pra dar pra combinar dos dois jeitos:
// só a dealer, só os jogadores, os dois juntos, ou nenhum. Por navegador,
// mesmo padrão dos outros mudos da mesa.
const PLAYERS_AUDIO_MUTE_KEY = 'pokerpremium_players_audio_muted';
export const isPlayersAudioMuted = (): boolean => localStorage.getItem(PLAYERS_AUDIO_MUTE_KEY) === '1';
export const setPlayersAudioMuted = (muted: boolean) => {
  localStorage.setItem(PLAYERS_AUDIO_MUTE_KEY, muted ? '1' : '0');
};

// Só STUN público (descoberta de IP/NAT) — sem TURN (relay pago/próprio),
// então em redes muito restritivas (NAT simétrico dos dois lados) a
// conexão pode não fechar. Suficiente pra a maioria das redes domésticas.
const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

interface SignalMessage {
  type: 'video-peers' | 'video-state' | 'signal';
  peers?: string[];
  userId?: string;
  name?: string;
  on?: boolean;
  from?: string;
  data?: any;
}

// Câmera ao vivo entre jogadores da mesma mesa: WebRTC ponto-a-ponto
// (malha completa, sem servidor de mídia — adequado pro tamanho de uma
// mesa de poker, no máximo 9 jogadores). O servidor de chat (mesma
// conexão WS, mesma porta) só retransmite SDP/ICE cru entre os dois
// peers certos — nunca vê ou processa vídeo/áudio.
//
// Regra de quem inicia a oferta, pra nunca colidir (os dois lados nunca
// ofertam ao mesmo tempo pro mesmo par): entre dois jogadores A e B, uma
// conexão só é necessária se pelo menos um dos dois estiver transmitindo;
// quando necessária, quem tem o userId menor (ordem de string) sempre
// inicia a oferta — os dois lados calculam essa regra de forma idêntica e
// independente, então nunca há disputa sobre quem oferta.
export const useTableVideo = (tableId: string, token: string, myUserId: string, seatUserIds: string[]) => {
  const [cameraOn, setCameraOn] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState('');

  const wsRef = useRef<WebSocket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const cameraOnRef = useRef(false);
  const broadcastersRef = useRef<Set<string>>(new Set());
  const peersRef = useRef<Record<string, RTCPeerConnection>>({});
  const seatUserIdsRef = useRef<string[]>(seatUserIds);
  seatUserIdsRef.current = seatUserIds;

  const closePeer = (peerId: string) => {
    peersRef.current[peerId]?.close();
    delete peersRef.current[peerId];
    setRemoteStreams((prev) => {
      if (!(peerId in prev)) return prev;
      const next = { ...prev };
      delete next[peerId];
      return next;
    });
  };

  const send = (msg: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) wsRef.current.send(JSON.stringify(msg));
  };

  const ensurePeer = (peerId: string, initiator: boolean): RTCPeerConnection => {
    let pc = peersRef.current[peerId];
    if (pc) return pc;

    pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    peersRef.current[peerId] = pc;

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => pc!.addTrack(track, localStreamRef.current!));
    }

    pc.ontrack = (event) => {
      setRemoteStreams((prev) => ({ ...prev, [peerId]: event.streams[0] }));
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) send({ type: 'signal', to: peerId, data: { kind: 'ice', candidate: event.candidate } });
    };

    pc.onconnectionstatechange = () => {
      if (pc && (pc.connectionState === 'failed' || pc.connectionState === 'closed')) closePeer(peerId);
    };

    if (initiator) {
      pc.onnegotiationneeded = async () => {
        try {
          const offer = await pc!.createOffer();
          await pc!.setLocalDescription(offer);
          send({ type: 'signal', to: peerId, data: { kind: 'offer', sdp: pc!.localDescription } });
        } catch {
          // conexão pode já ter fechado no meio da negociação — ignora
        }
      };
    }

    return pc;
  };

  // Reavalia, pra cada jogador sentado, se uma conexão é necessária (eu
  // OU ele transmitindo) e se eu sou quem deveria iniciar a oferta.
  const reconcilePeers = () => {
    const others = seatUserIdsRef.current.filter((id) => id !== myUserId);
    for (const peerId of others) {
      const needed = cameraOnRef.current || broadcastersRef.current.has(peerId);
      const exists = !!peersRef.current[peerId];
      if (needed && !exists && myUserId < peerId) {
        ensurePeer(peerId, true);
      } else if (!needed && exists) {
        closePeer(peerId);
      }
    }
  };

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?tableId=${encodeURIComponent(tableId)}&token=${encodeURIComponent(token)}`);
    wsRef.current = ws;

    ws.onmessage = async (event) => {
      let data: SignalMessage;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      if (data.type === 'video-peers') {
        broadcastersRef.current = new Set(data.peers || []);
        reconcilePeers();
        return;
      }

      if (data.type === 'video-state' && data.userId) {
        if (data.on) broadcastersRef.current.add(data.userId);
        else {
          broadcastersRef.current.delete(data.userId);
          closePeer(data.userId);
        }
        reconcilePeers();
        return;
      }

      if (data.type === 'signal' && data.from && data.data) {
        const peerId = data.from;
        const signal = data.data;
        if (signal.kind === 'offer') {
          const pc = ensurePeer(peerId, false);
          await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          send({ type: 'signal', to: peerId, data: { kind: 'answer', sdp: pc.localDescription } });
        } else if (signal.kind === 'answer') {
          const pc = peersRef.current[peerId];
          if (pc) await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        } else if (signal.kind === 'ice') {
          const pc = peersRef.current[peerId];
          if (pc) await pc.addIceCandidate(new RTCIceCandidate(signal.candidate)).catch(() => {});
        }
      }
    };

    return () => {
      ws.close();
      // peersRef é um objeto mutável comum (não um ref de nó DOM), lido de
      // propósito no valor mais atual no momento do cleanup, não numa
      // cópia presa do momento em que o efeito montou.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.keys(peersRef.current).forEach(closePeer);
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      setLocalStream(null);
      setCameraOn(false);
      cameraOnRef.current = false;
      broadcastersRef.current = new Set();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableId, token, myUserId]);

  // Reconcilia sempre que a lista de jogadores sentados muda (alguém
  // entrou/saiu da mesa).
  useEffect(() => {
    reconcilePeers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seatUserIds.join(',')]);

  const toggleCamera = async () => {
    if (cameraOnRef.current) {
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      setLocalStream(null);
      cameraOnRef.current = false;
      setCameraOn(false);
      Object.entries(peersRef.current).forEach(([, pc]) => {
        pc.getSenders().forEach((s) => s.track && pc.removeTrack(s));
      });
      send({ type: 'video-state', on: false });
      reconcilePeers();
      return;
    }

    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      setLocalStream(stream);
      cameraOnRef.current = true;
      setCameraOn(true);
      // Peers já existentes (ex.: alguém que já estava me esperando)
      // recebem a track agora — WebRTC renegocia sozinho via
      // onnegotiationneeded quando a conexão já foi criada como initiator.
      Object.values(peersRef.current).forEach((pc) => {
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      });
      send({ type: 'video-state', on: true });
      reconcilePeers();
    } catch {
      setError('Não foi possível acessar a câmera/microfone — verifique a permissão do navegador.');
    }
  };

  return { cameraOn, localStream, remoteStreams, toggleCamera, error };
};
