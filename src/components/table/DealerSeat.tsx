import React, { useEffect, useRef, useState } from 'react';
import DealerRenderer, { DealerModel } from './DealerRenderer';
import { defaultDealerVoiceConfig, eventToDealerMessage, getDealerGender, onDealerGenderChange } from '../../services/dealerVoice';

interface DealerSeatProps {
  model?: DealerModel;
}

const FEMALE_MODEL: DealerModel = {
  modelUrl: '/dealer-photo.png',
  animations: { idle: '', speak: '', announce: '', gesture: '' },
  // Foto quase quadrada onde o rosto fica pequeno/alto no quadro — sem
  // isso, o recorte circular puxava pro colo em vez da cara.
  crop: { objectPosition: 'center 0%', scale: 1.7, transformOrigin: '50% 8%' },
};

const MALE_MODEL: DealerModel = {
  modelUrl: '/dealer-photo-male.png',
  animations: { idle: '', speak: '', announce: '', gesture: '' },
  // Foto é uma cena inteira em paisagem (armadura, banner "Dealer IA",
  // balão de fala já embutido) — sem zoom, o círculo mostraria a cena
  // inteira com o rosto minúsculo no topo. Ancora e amplia perto de onde
  // o rosto fica nessa imagem específica.
  crop: { objectPosition: 'center', scale: 2.2, transformOrigin: '46% 18%' },
};

// Assento do dealer no topo da mesa. Acende (glow mais forte) por um instante
// a cada evento de mesa, simulando "fala" até termos animações reais do modelo.
// O balão de fala fica ao lado do avatar (não por cima), e acompanha a mesa
// onde quer que ela esteja — antes vivia solto em posição fixa e ficava
// cobrindo a cara da dealer.
const DealerSeat: React.FC<DealerSeatProps> = ({ model }) => {
  const [speaking, setSpeaking] = useState(false);
  const [lastLine, setLastLine] = useState('');
  const [gender, setGender] = useState(getDealerGender());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Preferência de gênero da dealer é por navegador (mesmo padrão do mudo de
  // voz) — quem escolhe explicitamente um `model` via prop tem prioridade
  // sobre a preferência salva.
  useEffect(() => onDealerGenderChange(setGender), []);

  const resolvedModel = model ?? (gender === 'male' ? MALE_MODEL : FEMALE_MODEL);

  useEffect(() => {
    const handler = (event: Event) => {
      setSpeaking(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setSpeaking(false), 1500);

      const e = event as CustomEvent<{ type: string }>;
      const type = e.detail?.type;
      if (!type) return;
      const dealerEvent = eventToDealerMessage(type, defaultDealerVoiceConfig);
      if (dealerEvent) setLastLine(dealerEvent.message);
    };
    window.addEventListener('cockpit-event', handler);
    return () => {
      window.removeEventListener('cockpit-event', handler);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      <div style={{ position: 'absolute', top: '-9%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        <div style={{ margin: '0 auto', width: 76 }}>
          <DealerRenderer model={resolvedModel} speaking={speaking} size={76} />
        </div>
        <div style={{ marginTop: 6, color: '#ffd76a', fontFamily: 'monospace', fontSize: '13px', letterSpacing: '2px' }}>
          DEALER IA
        </div>
      </div>

      {lastLine && (
        <div
          style={{
            position: 'absolute',
            // Posicionado DIRETO em relação ao oval (não mais aninhado
            // dentro do bloco da dealer, que tem seu próprio transform de
            // centralização — empilhar "top:100% + margem" em cima
            // daquilo dependia da altura renderizada do avatar+rótulo, e
            // cada ajuste ou cruzava a curva de cima ou caía em cima das
            // cartas comunitárias embaixo). Um valor fixo direto no oval
            // (0-380px de altura) tira essa incerteza de vez.
            top: 45,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'max-content',
            maxWidth: 220,
            padding: '8px 14px',
            borderRadius: '14px',
            background: 'rgba(0,0,0,0.88)',
            border: '1px solid #00eaff',
            boxShadow: '0 0 12px #00eaff',
            color: '#00eaff',
            fontFamily: 'monospace',
            fontSize: '12px',
            textAlign: 'center',
            zIndex: 4,
          }}
        >
          {lastLine}
        </div>
      )}
    </>
  );
};

export default DealerSeat;
