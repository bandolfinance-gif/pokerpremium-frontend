import React, { useEffect, useState } from 'react';

type Mood = 'CALM' | 'FOCUSED' | 'ALERT' | 'OVERDRIVE';

const DealerIAReactive: React.FC = () => {
  const [mood, setMood] = useState<Mood>('CALM');
  const [activity, setActivity] = useState(0);

  useEffect(() => {
    const handleEvent = (event: Event) => {
      const e = event as CustomEvent<{ type: string }>;
      const type = e.detail?.type;

      setActivity(prev => Math.min(prev + 4, 100));

      if (type === 'click') setMood('FOCUSED');
      if (type === 'key') setMood('ALERT');
      if (type === 'move') setMood('CALM');

      if (activity > 80) setMood('OVERDRIVE');
    };

    window.addEventListener('cockpit-event', handleEvent);

    const decay = setInterval(() => {
      setActivity(prev => Math.max(prev - 2, 0));
    }, 600);

    return () => {
      window.removeEventListener('cockpit-event', handleEvent);
      clearInterval(decay);
    };
  }, [activity]);

  const line = (() => {
    if (mood === 'OVERDRIVE') return 'Você acelerou o ritmo. Estou acompanhando cada detalhe.';
    if (mood === 'ALERT') return 'Percebi sua mudança de foco. Vamos manter a precisão.';
    if (mood === 'FOCUSED') return 'Boa concentração. Continue assim.';
    return 'Tudo está estável por aqui. Quando quiser, seguimos.';
  })();

  return (
    <div style={{ position: 'absolute', bottom: 120, right: 40, color: '#00eaff', fontSize: '14px' }}>
      <div>DEALER IA // MODO: {mood}</div>
      <div>ATIVIDADE: {activity}%</div>
      <div>{line}</div>
    </div>
  );
};

export default DealerIAReactive;
