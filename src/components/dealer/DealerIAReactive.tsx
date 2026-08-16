import React, { useEffect, useState } from 'react';

type Mood = 'CALM' | 'FOCUSED' | 'ALERT' | 'OVERDRIVE';

const DealerIAReactive: React.FC = () => {
  const [mood, setMood] = useState<Mood>('CALM');
  const [activity, setActivity] = useState(0);
  const [lastAction, setLastAction] = useState<string>('Nenhuma ação recente');

  useEffect(() => {
    const handleEvent = (event: Event) => {
      const e = event as CustomEvent<{ type: string }>;
      const type = e.detail?.type;

      setActivity(prev => Math.min(prev + 5, 100));

      if (type === 'click') {
        setMood('FOCUSED');
        setLastAction('Você fez uma ação precisa.');
      }

      if (type === 'key') {
        setMood('ALERT');
        setLastAction('Mudança detectada. Você ajustou algo.');
      }

      if (type === 'move') {
        setMood('CALM');
        setLastAction('Movimento suave. Tudo fluindo.');
      }

      if (activity > 85) {
        setMood('OVERDRIVE');
        setLastAction('Seu ritmo está intenso.');
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

  const line = (() => {
    if (mood === 'OVERDRIVE')
      return 'Você está num ritmo forte. Estou acompanhando tudo com atenção.';
    if (mood === 'ALERT')
      return 'Percebi sua mudança de foco. Vamos manter a clareza nas decisões.';
    if (mood === 'FOCUSED')
      return 'Boa precisão. Continue nesse ritmo.';
    return 'Tudo está estável. Quando quiser avançar, estou aqui.';
  })();

  return (
    <div style={{ position: 'absolute', bottom: 120, right: 40, color: '#00eaff', fontSize: '14px' }}>
      <div>DEALER IA // MODO: {mood}</div>
      <div>ATIVIDADE: {activity}%</div>
      <div>{line}</div>
      <div style={{ marginTop: '6px', opacity: 0.8 }}>{lastAction}</div>
    </div>
  );
};

export default DealerIAReactive;
