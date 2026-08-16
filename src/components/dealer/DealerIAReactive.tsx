import React, { useEffect, useState } from 'react';

type Mood = 'CALM' | 'FOCUSED' | 'ALERT' | 'OVERDRIVE';

const DealerIAReactive: React.FC = () => {
  const [mood, setMood] = useState<Mood>('CALM');
  const [activity, setActivity] = useState(0);
  const [contextLine, setContextLine] = useState('Sistema estável. Monitorando parâmetros.');

  useEffect(() => {
    const handleEvent = (event: Event) => {
      const e = event as CustomEvent<{ type: string }>;
      const type = e.detail?.type;

      setActivity(prev => Math.min(prev + 5, 100));

      if (type === 'click') {
        setMood('FOCUSED');
        setContextLine('Ação registrada. Precisão adequada.');
      }

      if (type === 'key') {
        setMood('ALERT');
        setContextLine('Entrada detectada. Ajuste processado.');
      }

      if (type === 'move') {
        setMood('CALM');
        setContextLine('Movimento suave. Fluxo operacional normal.');
      }

      if (activity > 85) {
        setMood('OVERDRIVE');
        setContextLine('Alta atividade. Recomendação: manter consistência.');
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
      return 'Ritmo elevado. Ajustando análise para acompanhar.';
    if (mood === 'ALERT')
      return 'Mudança de foco detectada. Mantendo precisão.';
    if (mood === 'FOCUSED')
      return 'Concentração adequada. Continuando monitoramento.';
    return 'Operação estável. Sistema pronto para novas ações.';
  })();

  return (
    <div style={{ position: 'absolute', bottom: 120, right: 40, color: '#00eaff', fontSize: '14px' }}>
      <div>DEALER IA // MODO: {mood}</div>
      <div>ATIVIDADE: {activity}%</div>
      <div>{moodLine}</div>
      <div style={{ marginTop: '6px', opacity: 0.85 }}>{contextLine}</div>
    </div>
  );
};

export default DealerIAReactive;
