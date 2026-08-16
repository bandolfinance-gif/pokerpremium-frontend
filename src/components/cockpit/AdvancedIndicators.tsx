import React from 'react';
import '../../styles/AdvancedIndicators.css';

const AdvancedIndicators: React.FC = () => {
  const indicators = [
    { label: 'THRUST', value: 85 },
    { label: 'STABILITY', value: 72 },
    { label: 'SYNC', value: 94 },
    { label: 'NEON FLOW', value: 63 }
  ];

  return (
    <div className='advanced-indicators'>
      {indicators.map((ind, i) => (
        <div key={i} className='indicator'>
          <div className='indicator-label'>{ind.label}</div>
          <div className='indicator-bar'>
            <div className='indicator-fill' style={{ width: ind.value + '%' }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdvancedIndicators;
