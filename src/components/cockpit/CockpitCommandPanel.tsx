import React from 'react';
import '../../styles/CockpitCommandPanel.css';

const CockpitCommandPanel: React.FC = () => {
  const buttons = ['SCAN', 'BOOST', 'SHIELD', 'CORE', 'SYNC'];

  return (
    <div className='command-panel'>
      {buttons.map((label, i) => (
        <div key={i} className='command-button'>
          {label}
        </div>
      ))}
    </div>
  );
};

export default CockpitCommandPanel;
