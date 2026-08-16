import React, { useEffect } from 'react';
import { DealerFX } from '../core/audio/DealerFX';

export default function DealerIA({ fase='', acao='', modo='voz' }: any) {
  useEffect(() => {
    if (modo === 'voz') DealerFX.falar(acao || fase);
  }, [fase, acao, modo]);
  return null;
}


