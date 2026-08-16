import React from 'react';
import '../../styles/CornerGlow.css';

const CornerGlow: React.FC = () => {
  return (
    <>
      <div className='corner-glow corner-top-left'></div>
      <div className='corner-glow corner-top-right'></div>
      <div className='corner-glow corner-bottom-left'></div>
      <div className='corner-glow corner-bottom-right'></div>
    </>
  );
};

export default CornerGlow;
