import React from 'react';

export interface PlayerAvatar {
  id: string;
  avatarImage: string;
  avatarType: 'photo' | '3d' | 'stylized';
  avatarEmotion?: 'neutral' | 'focused' | 'tilt';
  avatarGlow?: boolean;
}

interface PlayerAvatarRendererProps {
  avatar?: PlayerAvatar;
  fallbackInitials: string;
  size?: number;
}

// Renderiza o avatar real do jogador quando existir (avatar.avatarImage);
// até lá, cai no placeholder geométrico (círculo + iniciais). Trocar o asset
// real não exige mexer em nenhum consumidor deste componente.
const PlayerAvatarRenderer: React.FC<PlayerAvatarRendererProps> = ({ avatar, fallbackInitials, size = 56 }) => {
  const glow = avatar?.avatarGlow ?? true;

  const baseStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    border: '2px solid #00eaff',
    boxShadow: glow ? '0 0 14px rgba(0,234,255,0.6)' : 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  if (avatar?.avatarImage) {
    return (
      <div style={baseStyle}>
        <img
          src={avatar.avatarImage}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        ...baseStyle,
        background: 'radial-gradient(circle at 35% 30%, #1c3a4a, #061018)',
        color: '#00eaff',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        fontSize: size * 0.28,
      }}
    >
      {fallbackInitials}
    </div>
  );
};

export default PlayerAvatarRenderer;
