import React from 'react';
import './login.css';

export default function Login({ onLogin }: { onLogin: () => void }) {
  return (
    <div className='login-container'>
      <h2>Entrar no Sistema</h2>
      <button onClick={onLogin}>Acessar Cockpit</button>
    </div>
  );
}


