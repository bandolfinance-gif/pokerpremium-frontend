import React from 'react';

export default function JogadorMesa({ nome, stack, avatar, vencedor=false }: any) {
  return (
    <div className={vencedor ? 'winner-highlight jogador-mesa' : 'jogador-mesa'}>
      <img src={avatar} className='avatar-jogador' />
      <div><strong>{nome}</strong><p>Stack: {stack}</p></div>
    </div>
  );
}


