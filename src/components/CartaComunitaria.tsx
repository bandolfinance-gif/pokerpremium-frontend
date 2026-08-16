import React, { useState, useEffect } from 'react';

export default function CartaComunitaria({ carta }: { carta: any }) {
  const [flip, setFlip] = useState(false);
  useEffect(() => setFlip(true), []);
  return (
    <div className={'flip-card ' + (flip ? 'flip' : '')}>
      <div className='flip-card-inner'>
        <div className='flip-card-front'></div>
        <div className='flip-card-back'>{carta.rank}{carta.suit}</div>
      </div>
    </div>
  );
}


