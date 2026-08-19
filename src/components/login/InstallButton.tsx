import React, { useEffect, useState } from 'react';
import { isInstallAvailable, onInstallAvailabilityChange, promptInstall } from '../../services/installPrompt';

// Botão redondo, fixo embaixo na tela de entrada, com a própria
// logomarca — "baixar o app" na prática instala o PWA (ícone na tela
// inicial, abre em tela cheia como um app de verdade) via prompt nativo
// do navegador. Só aparece quando o navegador oferece essa opção
// (Chrome/Android e desktop); no Safari/iOS não existe esse prompt
// programático — lá a instalação continua manual, pelo menu de
// compartilhar, e o botão fica escondido pra não prometer algo que não
// vai acontecer ao tocar nele.
const InstallButton: React.FC = () => {
  const [canInstall, setCanInstall] = useState(isInstallAvailable());
  useEffect(() => onInstallAvailabilityChange(setCanInstall), []);

  if (!canInstall) return null;

  return (
    <button
      onClick={() => promptInstall()}
      aria-label="Baixar o app PokerPremium"
      title="Baixar o app PokerPremium"
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 28,
        transform: 'translateX(-50%)',
        width: 64,
        height: 64,
        borderRadius: '50%',
        border: '1px solid rgba(0,234,255,0.5)',
        background: 'radial-gradient(circle at 35% 30%, rgba(0,234,255,0.22), rgba(5,7,10,0.96))',
        boxShadow: '0 0 22px rgba(0,234,255,0.45), 0 6px 18px rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 50,
        padding: 0,
      }}
    >
      <img src="/logo-icon.svg" alt="" style={{ width: 30, height: 30 }} />
    </button>
  );
};

export default InstallButton;
