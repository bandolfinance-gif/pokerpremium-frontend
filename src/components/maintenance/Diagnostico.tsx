import React, { useContext } from 'react';
import { CockpitContext } from '../../systems/CockpitSystem';

export default function Diagnostico() {
  const { energia, iaStatus, alerta } = useContext(CockpitContext);

  return (
    <div className='diagnostico pulse'>
      <h3>DiagnÃ³stico do Sistema</h3>
      <p>Energia: {energia}%</p>
      <p>IA: {iaStatus}</p>
      <p>"Alerta:" {alerta ? 'Ativado' : 'Normal'}</p>
    </div>
  );
}


