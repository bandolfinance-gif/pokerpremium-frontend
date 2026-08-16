import React, { useEffect, useState } from 'react';

type Mood = 'CALM' | 'FOCUSED' | 'ALERT' | 'OVERDRIVE';
type Profile = 'CALMA' | 'ANALITICA' | 'DIRETA' | 'ESTRATEGICA';

const DealerIAReactive: React.FC = () => {
  const [mood, setMood] = useState<Mood>('CALM');
  const [activity, setActivity] = useState(0);
  const [contextLine, setContextLine] = useState('Tudo está estável por aqui.');
  const [profile, setProfile] = useState<Profile>('CALMA');

  const profileLines: Record<Profile, string> = {
    CALMA: 'Mantendo estabilidade. Vamos seguir no seu ritmo.',
    ANALITICA: 'Processando padrões da mesa. Sua linha está clara.',
    DIRETA: 'Decisão objetiva. Continue.',
    ESTRATEGICA: 'Ajustando leitura estratégica. Cada ação importa.'
  };

  useEffect(() => {
    const handleEvent = (event: Event) => {
      const e = event as CustomEvent<{ type: string }>;
      const type = e.detail?.type;

      setActivity(prev => Math.min(prev + 5, 100));

      // Alternância automática de perfis
      if (activity < 30) setProfile('CALMA');
      else if (activity < 60) setProfile('ANALITICA');
      else if (activity < 85) setProfile('DIRETA');
      else setProfile('ESTRATEGICA');

      // Eventos do cockpit
      if (type === 'click') {
        setMood('FOCUSED');
        setContextLine('Boa ação. Você está mantendo o ritmo.');
      }

      if (type === 'key') {
        setMood('ALERT');
        setContextLine('Mudança detectada. Ajuste preciso.');
      }

      if (type === 'move') {
        setMood('CALM');
        setContextLine('Movimento suave. Tudo fluindo bem.');
      }

      // Ações do jogador — frases avançadas
      if (type === 'poker-bet') {
        setContextLine('Aposta registrada. Ajustando leitura da mesa.');
      }

      if (type === 'poker-call') {
        setContextLine('Call detectado. Mantendo estabilidade.');
      }

      if (type === 'poker-raise') {
        setContextLine('Raise identificado. A mesa mudou de tom.');
      }

      if (type === 'poker-fold') {
        setContextLine('Jogador desistiu. Fluxo atualizado.');
      }

      // Etapas da rodada — frases profissionais
      if (type === 'poker-flop') {
        setContextLine('Flop revelado. A dinâmica mudou.');
      }

      if (type === 'poker-turn') {
        setContextLine('Turn aberto. A leitura fica mais precisa.');
      }

      if (type === 'poker-river') {
        setContextLine('River na mesa. Última chance de ajustar sua linha.');
      }

      if (type === 'poker-showdown') {
        setContextLine('Showdown iniciado. Processando leitura final.');
      }

      if (type === 'poker-reset') {
        setContextLine('Rodada reiniciada. Preparando novo fluxo.');
      }

      if (activity > 85) {
        setMood('OVERDRIVE');
        setContextLine('Seu ritmo está intenso. Estou acompanhando cada detalhe.');
      }
    };

    window.addEventListener('cockpit-event', handleEvent);

    const decay = setInterval(() => {
      setActivity(prev => Math.max(prev - 3, 0));
    }, 500);

    return () => {
      window.removeEventListener('cockpit-event', handleEvent);
      clearInterval(decay);
    };
  }, [activity]);

  const moodLine = (() => {
    if (mood === 'OVERDRIVE')
      return 'Você está num ritmo forte. Vamos manter a clareza.';
    if (mood === 'ALERT')
      return 'Percebi sua mudança de foco. Continue atento.';
    if (mood === 'FOCUSED')
      return 'Boa precisão. Seu foco está sólido.';
    return 'Tudo está estável. Quando quiser avançar, estou aqui.';
  })();

  return (
    <div style={{ position: 'absolute', bottom: 120, right: 40, color: '#00eaff', fontSize: '14px' }}>
      <div>DEALER IA // MODO: {mood}</div>
      <div>PERFIL: {profile}</div>
      <div>ATIVIDADE: {activity}%</div>
      <div>{moodLine}</div>
      <div style={{ marginTop: '6px', opacity: 0.85 }}>{contextLine}</div>
      <div style={{ marginTop: '6px', opacity: 0.65 }}>{profileLines[profile]}</div>
    </div>
  );
};

export default DealerIAReactive;
