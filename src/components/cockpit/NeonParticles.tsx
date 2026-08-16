import React from 'react';
import '../../styles/NeonParticles.css';

const NeonParticles: React.FC = () => {
  return (
    <div className="neon-particles-layer">
      {Array.from({ length: 40 }).map((_, index) => (
        <div key={index} className="neon-particle" />
      ))}
    </div>
  );
};

export default NeonParticles;
