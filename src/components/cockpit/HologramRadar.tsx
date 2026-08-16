import React from 'react';
import '../../styles/HologramRadar.css';

const HologramRadar: React.FC = () => {
  return (
    <div className='radar-container'>
      <div className='radar-circle'></div>
      <div className='radar-sweep'></div>
    </div>
  );
};

export default HologramRadar;
