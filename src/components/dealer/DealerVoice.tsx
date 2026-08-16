import React, { useEffect } from 'react';

interface DealerVoiceProps {
  text: string;
}

const DealerVoice: React.FC<DealerVoiceProps> = ({ text }) => {
  useEffect(() => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'pt-BR';
    utter.pitch = 1.3;
    utter.rate = 1.05;
    utter.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === 'pt-BR');
    if (voice) utter.voice = voice;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }, [text]);

  return null;
};

export default DealerVoice;
