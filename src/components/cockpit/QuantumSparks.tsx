import React from 'react';
import '../../styles/QuantumSparks.css';

const QuantumSparks: React.FC = () => {
  const sparks = Array.from({ length: 18 });

  return (
    <>
      {sparks.map((_, i) => (
        <div key={i} className='quantum-spark'></div>
      ))}
    </>
  );
};

export default QuantumSparks;
