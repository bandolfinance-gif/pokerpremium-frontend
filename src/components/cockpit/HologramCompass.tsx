import React from 'react';
import '../../styles/HologramCompass.css';

const HologramCompass: React.FC = () => {
  return (
    <div className='compass-container'>
      <div className='compass-ring'></div>
      <div className='compass-needle'></div>
    </div>
  );
};

export default HologramCompass;
