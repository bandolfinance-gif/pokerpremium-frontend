import React from 'react';

export interface DealerModel {
  modelUrl: string; // imagem estática ou GLB/FBX, dependendo do asset recebido
  animations: {
    idle: string;
    speak: string;
    announce: string;
    gesture: string;
  };
  // Enquadramento do rosto dentro do círculo — cada foto tem proporção e
  // composição diferentes (retrato quase quadrado vs. foto paisagem, por
  // exemplo), então o recorte certo pra uma não é o recorte certo pra
  // outra. Sem isso definido, cai no padrão neutro (cover + centro).
  crop?: { objectPosition: string; scale?: number; transformOrigin?: string };
}

interface DealerRendererProps {
  model?: DealerModel;
  speaking?: boolean;
  size?: number;
}

// Sem asset 3D real ainda. Se model.modelUrl vier como imagem (foto/estilizado),
// já renderiza. GLB/FBX vai precisar de um viewer 3D (three.js / react-three-fiber),
// que ainda não está no projeto — decisão pendente para quando o asset existir.
const DealerRenderer: React.FC<DealerRendererProps> = ({ model, speaking = false, size = 76 }) => {
  const glow = speaking ? '0 0 30px rgba(255,215,106,0.9)' : '0 0 20px rgba(255,215,106,0.5)';

  if (model?.modelUrl) {
    const crop = model.crop;

    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid #ffd76a',
          boxShadow: glow,
          transition: 'box-shadow 0.2s ease',
        }}
      >
        <img
          src={model.modelUrl}
          alt="Dealer"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: crop?.objectPosition ?? 'center',
            transform: crop?.scale ? `scale(${crop.scale})` : 'none',
            transformOrigin: crop?.transformOrigin ?? 'center',
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 30%, #2a1c4a, #08061a)',
        border: '2px solid #ffd76a',
        boxShadow: glow,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        transition: 'box-shadow 0.2s ease',
      }}
    >
      &#9824;
    </div>
  );
};

export default DealerRenderer;
