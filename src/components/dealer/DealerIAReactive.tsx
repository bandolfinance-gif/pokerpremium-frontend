import React, { useEffect, useState } from 'react';

type CockpitMood = 'CALM' | 'FOCUSED' | 'ALERT' | 'OVERDRIVE';

const DealerIAReactive: React.FC = () => {
  const [mood, setMood] = useState<CockpitMood>('CALM');
  const [activity, setActivity] = useState(0);

  useEffect(() => {
    const handleCockpitEvent = (event: Event) => {
      const custom = event as CustomEvent<{ type: string }>;
      const type = custom.detail?.type;

      setActivity(prev => Math.min(prev + 1, 100));

      if (type === 'click') {
        setMood('FOCUSED');
      } else if (type === 'key') {
        setMood('ALERT');
      } else if (type === 'move') {
        setMood('CALM');
      }
    };

    window.addEventListener('cockpit-event', handleCockpitEvent);

    const decay = setInterval(() => {
      setActivity(prev => Math.max(prev - 1, 0));
    }, 800);

    return () => {
      window.removeEventListener('cockpit-event', handleCockpitEvent);
      clearInterval(decay);
    };
  }, []);

  const getLine = () => {
    if (mood === 'OVERDRIVE') return 'Sistema em overdrive. Cada decisão importa.';
    if (mood === 'ALERT') return 'Leitura intensa. Você está ajustando o curso.';
    if (mood === 'FOCUSED') return 'Foco detectado. Vamos jogar sério.';
    return 'Cockpit está estável. Pronto quando você estiver.';
  };

  return (
    <div style={{ position: 'absolute', bottom: 120, right: 40, color: '#00eaff' }}>
      <div>DEALER IA // MODE: {mood}</div>
      <div>ACTIVITY: {activity}%</div>
      <div>{getLine()}</div>
    </div>
  );
};

export default DealerIAReactive;
