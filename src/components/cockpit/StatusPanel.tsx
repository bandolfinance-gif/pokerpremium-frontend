import React from 'react';
import '../../styles/StatusPanel.css';

const StatusPanel: React.FC = () => {
  return (
    <div className='status-panel'>
      <div className='status-title'>SYSTEM STATUS</div>

      <div className='status-bar'>
        <div className='status-label'>ENERGY</div>
        <div className='status-fill energy'></div>
      </div>

      <div className='status-bar'>
        <div className='status-label'>SHIELD</div>
        <div className='status-fill shield'></div>
      </div>

      <div className='status-bar'>
        <div className='status-label'>CORE TEMP</div>
        <div className='status-fill core'></div>
      </div>
    </div>
  );
};

export default StatusPanel;
