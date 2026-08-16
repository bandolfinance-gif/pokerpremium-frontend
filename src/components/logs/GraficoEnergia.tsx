import React from 'react';

export default function GraficoEnergia({ energia }: { energia: number }) {
  const width = Math.max(0, Math.min(100, energia));
  return (
    <div className='grafico-energia'>
      <div className='barra-externa'>
        <div className='barra-interna' style={{ width: width + '%', background: energia > 20 ? 'cyan' : 'red' }} />
      </div>
      <p>{energia}%</p>
    </div>
  );
}


