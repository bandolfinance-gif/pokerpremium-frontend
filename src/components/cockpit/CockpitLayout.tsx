import React from 'react';

// Estrutura visual do cockpit: fornece o plano de posicionamento relativo
// onde os HUDs se ancoram. Posicionamento fino de cada HUD ainda vive em
// cada HUD (ver Diretriz de arquitetura), este componente é só o palco.
interface CockpitLayoutProps {
  children: React.ReactNode;
}

const CockpitLayout: React.FC<CockpitLayoutProps> = ({ children }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {children}
    </div>
  );
};

export default CockpitLayout;
