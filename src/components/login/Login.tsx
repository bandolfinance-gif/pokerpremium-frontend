import './login.css';
import React, { useState } from 'react';
import axios from 'axios';
import { AuthUser, loginUser, registerUser, TipoCadastro, uploadAvatar, UserRole } from '../../services/authApi';
import RoleSelect, { ROLE_THEME } from './RoleSelect';

interface LoginProps {
  onAuthenticated: (user: AuthUser, token: string) => void;
}

const ROLE_SUBTITLE: Record<UserRole, string> = {
  player: 'Cadastro de jogador',
  house: 'Cadastro de casa de poker',
  agent: 'Cadastro de agente de poker',
  admin: 'Cadastro de administrador',
};

const Login: React.FC<LoginProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<'login' | 'choose-role' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('player');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipoCadastro, setTipoCadastro] = useState<TipoCadastro>('fisica');
  const [documento, setDocumento] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);
    setAvatarPreview(file ? URL.createObjectURL(file) : null);
  };

  const startRegister = (chosenRole: UserRole) => {
    setRole(chosenRole);
    // Casa/Agente costumam ser pessoa jurídica por padrão, mas continua
    // trocável — nada impede um agente autônomo como pessoa física.
    setTipoCadastro(chosenRole === 'house' || chosenRole === 'agent' ? 'juridica' : 'fisica');
    setMode('register');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || (mode === 'register' && !name)) {
      setError('Preencha todos os campos.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response =
        mode === 'login'
          ? await loginUser(email, password)
          : await registerUser(name, email, password, role, tipoCadastro, documento || undefined);

      let user = response.user;
      if (mode === 'register' && avatarFile) {
        try {
          const { avatarImage } = await uploadAvatar(response.token, avatarFile);
          user = { ...user, avatarImage };
        } catch {
          // Foto é opcional — se o upload falhar, a conta já foi criada normalmente.
        }
      }
      onAuthenticated(user, response.token);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? 'Não foi possível conectar ao servidor.'
        : 'Erro inesperado.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'choose-role') {
    return <RoleSelect onSelect={startRegister} onBack={() => setMode('login')} />;
  }

  const theme = ROLE_THEME[role];
  const cardStyle = mode === 'register' ? ({ '--accent': theme.accent, '--accent-soft': theme.accentSoft } as React.CSSProperties) : undefined;

  return (
    <div className="login-wrapper">
      <div className={mode === 'register' ? 'login-card themed' : 'login-card'} style={cardStyle}>
        <img src="/logo-icon.svg" alt="PokerPremium" className="login-badge" />
        <div className="login-logo">
          <span className="login-logo-poker">POKER</span>
          <span className="login-logo-premium">Premium</span>
        </div>

        {mode === 'register' && (
          <div className="role-badge">{theme.icon} {ROLE_SUBTITLE[role]}</div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <label className="login-label" htmlFor="login-name">Nome</label>
              <input
                id="login-name"
                className="login-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                autoComplete="name"
              />

              <label className="login-label" htmlFor="login-tipo-cadastro">Cadastro</label>
              <select
                id="login-tipo-cadastro"
                className="login-input"
                value={tipoCadastro}
                onChange={(e) => setTipoCadastro(e.target.value as TipoCadastro)}
              >
                <option value="fisica">Pessoa Física</option>
                <option value="juridica">Pessoa Jurídica</option>
              </select>

              <label className="login-label" htmlFor="login-documento">
                {tipoCadastro === 'juridica' ? 'CNPJ' : 'CPF'} (opcional por enquanto)
              </label>
              <input
                id="login-documento"
                className="login-input"
                type="text"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                placeholder={tipoCadastro === 'juridica' ? '00.000.000/0000-00' : '000.000.000-00'}
              />

              <label className="login-label" htmlFor="login-avatar">Foto de perfil (opcional)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                {avatarPreview && (
                  <img
                    src={avatarPreview}
                    alt="Prévia"
                    style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: `1px solid ${theme.accent}` }}
                  />
                )}
                <input
                  id="login-avatar"
                  className="login-input"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAvatarChange}
                />
              </div>
            </>
          )}

          <label className="login-label" htmlFor="login-email">Email</label>
          <input
            id="login-email"
            className="login-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            autoComplete="username"
          />

          <label className="login-label" htmlFor="login-password">Senha</label>
          <input
            id="login-password"
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />

          {error && <div className="login-error">{error}</div>}

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? '...' : mode === 'login' ? 'ENTRAR' : 'CRIAR CONTA'}
          </button>
        </form>

        <div className="login-footer">
          {mode === 'login' ? (
            <>Ainda não tem conta? <span className="login-link" onClick={() => setMode('choose-role')}>Criar conta</span></>
          ) : (
            <>Já tem conta? <span className="login-link" onClick={() => setMode('login')}>Entrar</span></>
          )}
        </div>
      </div>

      <InstallButton />
    </div>
  );
};

export default Login;
