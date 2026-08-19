import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { changePassword, fetchProfile, Profile, updateProfile } from '../../services/profileApi';
import { uploadAvatar } from '../../services/authApi';
import PlayerAvatarRenderer from '../table/PlayerAvatarRenderer';
import { ELEGANT_FONT as SANS } from '../../styles/elegantTheme';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

interface ProfileViewProps {
  token: string;
  onProfileUpdate: (updates: { name?: string; email?: string; avatarImage?: string | null }) => void;
}

// Converte a data ISO do backend (ex.: "1990-05-20T00:00:00.000Z") pro
// formato que <input type="date"> aceita (yyyy-mm-dd), sem depender de
// fuso — só corta a parte de hora.
const toDateInputValue = (iso: string | null) => (iso ? iso.slice(0, 10) : '');

const panelStyle: React.CSSProperties = {
  background: 'linear-gradient(160deg, rgba(0,20,30,0.6), rgba(0,0,0,0.55))',
  border: '1px solid rgba(0,234,255,0.3)',
  borderRadius: 18,
  padding: '22px 24px',
  boxShadow: '0 0 14px rgba(0,234,255,0.12)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 12,
  border: '1px solid rgba(0,234,255,0.35)',
  background: 'rgba(0,0,0,0.3)',
  color: '#e8fdff',
  fontFamily: SANS,
  fontSize: 14,
  marginBottom: 14,
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = { fontSize: 12, opacity: 0.65, marginBottom: 5, display: 'block', fontWeight: 500 };

const sectionTitleStyle: React.CSSProperties = { color: '#00eaff', marginBottom: 14, fontSize: 14, fontWeight: 700 };

const btnStyle: React.CSSProperties = {
  padding: '9px 20px',
  borderRadius: 20,
  border: '1px solid #00eaff',
  background: 'rgba(0,234,255,0.12)',
  color: '#00eaff',
  fontFamily: SANS,
  fontWeight: 700,
  fontSize: 13,
  cursor: 'pointer',
};

// Aba de conta do jogador: dados de cadastro organizados num só lugar
// (antes disso não existia NENHUMA forma de ver/editar o que foi
// preenchido no registro, nem de trocar senha — cadastro era write-once).
const ProfileView: React.FC<ProfileViewProps> = ({ token, onProfileUpdate }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [tipoCadastro, setTipoCadastro] = useState<'fisica' | 'juridica'>('fisica');
  const [documento, setDocumento] = useState('');
  const [savingDados, setSavingDados] = useState(false);
  const [dadosMsg, setDadosMsg] = useState('');

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [savingSenha, setSavingSenha] = useState(false);
  const [senhaMsg, setSenhaMsg] = useState('');
  const [senhaErro, setSenhaErro] = useState('');

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile(token).then((p) => {
      setProfile(p);
      setName(p.name);
      setEmail(p.email);
      setDataNascimento(toDateInputValue(p.dataNascimento));
      setTipoCadastro(p.tipoCadastro);
      setDocumento(p.documento || '');
    });
  }, [token]);

  const salvarDados = async () => {
    setSavingDados(true);
    setDadosMsg('');
    try {
      const updated = await updateProfile(token, {
        name,
        email,
        tipoCadastro,
        documento: documento || undefined,
        dataNascimento: dataNascimento || null,
      });
      setProfile(updated);
      onProfileUpdate({ name: updated.name, email: updated.email });
      setDadosMsg('Dados atualizados!');
      setTimeout(() => setDadosMsg(''), 2500);
    } catch (err) {
      setDadosMsg(axios.isAxiosError(err) ? err.response?.data?.message ?? 'Erro ao salvar' : 'Erro ao salvar');
    } finally {
      setSavingDados(false);
    }
  };

  const trocarSenha = async () => {
    setSenhaErro('');
    setSenhaMsg('');
    if (novaSenha.length < 6) {
      setSenhaErro('A nova senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setSenhaErro('As senhas novas não são iguais.');
      return;
    }
    setSavingSenha(true);
    try {
      await changePassword(token, senhaAtual, novaSenha);
      setSenhaMsg('Senha alterada com sucesso!');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
      setTimeout(() => setSenhaMsg(''), 2500);
    } catch (err) {
      setSenhaErro(axios.isAxiosError(err) ? err.response?.data?.message ?? 'Erro ao trocar senha' : 'Erro ao trocar senha');
    } finally {
      setSavingSenha(false);
    }
  };

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const { avatarImage } = await uploadAvatar(token, file);
      setProfile((prev) => (prev ? { ...prev, avatarImage } : prev));
      onProfileUpdate({ avatarImage });
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!profile) {
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0,234,255,0.5)', fontFamily: SANS }}>
        Carregando perfil...
      </div>
    );
  }

  const avatar = profile.avatarImage
    ? { id: profile.id, avatarImage: `${API_URL}${profile.avatarImage}`, avatarType: 'photo' as const }
    : undefined;
  const initials = profile.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflowY: 'auto',
        padding: '24px 40px 60px',
        color: '#e8fdff',
        fontFamily: SANS,
        fontSize: 14,
      }}
    >
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#ffd76a', marginBottom: 22, textAlign: 'center' }}>
          Meu Perfil
        </div>

        <div style={{ ...panelStyle, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ position: 'relative' }}>
            <PlayerAvatarRenderer avatar={avatar} fallbackInitials={initials} size={72} />
          </div>
          <div>
            <div style={{ color: '#f2fbff', fontSize: 17, fontWeight: 700 }}>{profile.name}</div>
            <div style={{ opacity: 0.6, fontSize: 12, marginTop: 3 }}>{profile.email}</div>
            <div style={{ opacity: 0.5, fontSize: 11, marginTop: 3 }}>
              Membro desde {new Date(profile.criadoEm).toLocaleDateString('pt-BR')} · {profile.chips.toLocaleString('pt-BR')} fichas
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              style={{ ...btnStyle, marginTop: 10, fontSize: 11, padding: '5px 14px' }}
            >
              {uploadingAvatar ? 'Enviando...' : 'Trocar foto'}
            </button>
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleAvatarFile} style={{ display: 'none' }} />
          </div>
        </div>

        <div style={{ ...panelStyle, marginBottom: 18 }}>
          <div style={sectionTitleStyle}>Dados do cadastro</div>

          <label style={labelStyle}>Nome</label>
          <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />

          <label style={labelStyle}>Email</label>
          <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label style={labelStyle}>Data de nascimento</label>
          <input style={inputStyle} type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />

          <label style={labelStyle}>Tipo de cadastro</label>
          <select
            style={inputStyle}
            value={tipoCadastro}
            onChange={(e) => setTipoCadastro(e.target.value as 'fisica' | 'juridica')}
          >
            <option value="fisica">Pessoa Física</option>
            <option value="juridica">Pessoa Jurídica</option>
          </select>

          <label style={labelStyle}>{tipoCadastro === 'juridica' ? 'CNPJ' : 'CPF'}</label>
          <input
            style={inputStyle}
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
            placeholder={tipoCadastro === 'juridica' ? '00.000.000/0000-00' : '000.000.000-00'}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={salvarDados} disabled={savingDados} style={btnStyle}>
              {savingDados ? 'Salvando...' : 'Salvar dados'}
            </button>
            {dadosMsg && <span style={{ fontSize: 12, color: dadosMsg.includes('!') ? '#7dff9c' : '#ff4d6d' }}>{dadosMsg}</span>}
          </div>
        </div>

        <div style={panelStyle}>
          <div style={sectionTitleStyle}>Trocar senha</div>

          <label style={labelStyle}>Senha atual</label>
          <input style={inputStyle} type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} />

          <label style={labelStyle}>Nova senha</label>
          <input style={inputStyle} type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />

          <label style={labelStyle}>Confirmar nova senha</label>
          <input style={inputStyle} type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={trocarSenha}
              disabled={savingSenha || !senhaAtual || !novaSenha || !confirmarSenha}
              style={savingSenha || !senhaAtual || !novaSenha || !confirmarSenha ? { ...btnStyle, opacity: 0.4, cursor: 'not-allowed' } : btnStyle}
            >
              {savingSenha ? 'Alterando...' : 'Alterar senha'}
            </button>
            {senhaMsg && <span style={{ fontSize: 12, color: '#7dff9c' }}>{senhaMsg}</span>}
            {senhaErro && <span style={{ fontSize: 12, color: '#ff4d6d' }}>{senhaErro}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
