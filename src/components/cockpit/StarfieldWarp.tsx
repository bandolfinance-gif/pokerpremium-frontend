import React from 'react';
import '../../styles/StarfieldWarp.css';

const StarfieldWarp: React.FC = () => {
  const stars = Array.from({ length: 120 });

  return (
    <>
      {stars.map((_, i) => (
        <div key={i} className='warp-star'></div>
      ))}
    </>
  );
};

export default StarfieldWarp;
