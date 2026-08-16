import React from 'react';
import '../../styles/HUDEnergyBar.css';

const HUDEnergyBar: React.FC = () => {
  return (
    <div className='hud-energy-bar'>
      <div className='hud-energy-fill'></div>
    </div>
  );
};

export default HUDEnergyBar;
