import React, { useEffect, useRef } from 'react';
import {
  defaultDealerVoiceConfig,
  DealerVoiceConfig,
  eventToDealerMessage,
  speakDealerEvent,
} from '../../services/dealerVoice';

interface DealerVoiceProps {
  config?: DealerVoiceConfig;
}

// Só a síntese de voz (áudio) — sem visual próprio. O balão de fala vive
// ao lado do avatar da dealer, em DealerSeat, pra sempre acompanhar onde
// a mesa está.
//
// Só fala em cima de eventos de AÇÃO (fold/call/raise) — eventos de
// ESTADO (flop/turn/river/showdown) não são mais falados aqui, porque
// isso duplicava a narração real que já vem do backend via chat
// (ChatBox fala toda mensagem da "Dealer IA", que agora tem cartas e
// resultado de verdade). Falar os dois ao mesmo tempo soava como eco —
// a mesma fase anunciada duas vezes, uma genérica e uma real.
const DealerVoice: React.FC<DealerVoiceProps> = ({ config = defaultDealerVoiceConfig }) => {
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    const handler = (event: Event) => {
      const e = event as CustomEvent<{ type: string }>;
      const type = e.detail?.type;
      if (!type) return;

      const dealerEvent = eventToDealerMessage(type, configRef.current);
      if (!dealerEvent || dealerEvent.type !== 'action') return;

      speakDealerEvent(dealerEvent, configRef.current);
    };

    window.addEventListener('cockpit-event', handler);
    return () => window.removeEventListener('cockpit-event', handler);
  }, []);

  return null;
};

export default DealerVoice;
