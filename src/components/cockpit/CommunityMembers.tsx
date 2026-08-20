import React, { useEffect, useState } from 'react';
import { CommunityMember, fetchMembers, followUser, unfollowUser } from '../../services/communityApi';
import PlayerAvatarRenderer from '../table/PlayerAvatarRenderer';
import { ELEGANT_FONT as SANS } from '../../styles/elegantTheme';
import { resolveMediaUrl } from '../../services/media';

interface CommunityMembersProps {
  token: string;
  onOpenProfile: (userId: string) => void;
}

const initialsOf = (name: string) => name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

// Todo mundo que cria conta já aparece aqui automaticamente — não existe
// um passo separado de "entrar na comunidade". Cartão com foto, nome,
// seguidores e botão de seguir/deixar de seguir, direto.
const CommunityMembers: React.FC<CommunityMembersProps> = ({ token, onOpenProfile }) => {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    fetchMembers(token).then(setMembers).catch(() => {});
  };

  useEffect(load, [token]);

  const toggleFollow = async (m: CommunityMember) => {
    setBusyId(m.id);
    try {
      if (m.sigo) await unfollowUser(token, m.id);
      else await followUser(token, m.id);
      setMembers((prev) =>
        prev.map((x) => (x.id === m.id ? { ...x, sigo: !x.sigo, seguidores: x.seguidores + (x.sigo ? -1 : 1) } : x))
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', fontFamily: SANS }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 16,
        }}
      >
        {members.map((m) => {
          const resolvedAvatar = resolveMediaUrl(m.avatarImage);
          const avatar = resolvedAvatar ? { id: m.id, avatarImage: resolvedAvatar, avatarType: 'photo' as const } : undefined;
          return (
            <div
              key={m.id}
              style={{
                background: 'linear-gradient(160deg, rgba(0,20,30,0.6), rgba(0,0,0,0.55))',
                border: '1px solid rgba(0,234,255,0.3)',
                borderRadius: 16,
                padding: 18,
                textAlign: 'center',
                boxShadow: '0 0 14px rgba(0,234,255,0.1)',
              }}
            >
              <div onClick={() => onOpenProfile(m.id)} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                  <PlayerAvatarRenderer avatar={avatar} fallbackInitials={initialsOf(m.name)} size={64} />
                </div>
                <div style={{ color: '#f2fbff', fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{m.name}</div>
                <div style={{ fontSize: 12, opacity: 0.55, marginBottom: 12 }}>{m.seguidores} seguidor{m.seguidores === 1 ? '' : 'es'}</div>
              </div>

              {!m.souEu && (
                <button
                  onClick={() => toggleFollow(m)}
                  disabled={busyId === m.id}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 20,
                    border: m.sigo ? '1px solid rgba(0,234,255,0.4)' : '1px solid #ffd76a',
                    background: m.sigo ? 'rgba(0,234,255,0.08)' : 'linear-gradient(135deg, rgba(255,215,106,0.25), rgba(255,111,174,0.15))',
                    color: m.sigo ? 'rgba(232,253,255,0.7)' : '#ffd76a',
                    fontFamily: SANS,
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  {m.sigo ? 'Seguindo' : '+ Seguir'}
                </button>
              )}
              {m.souEu && <div style={{ fontSize: 12, fontWeight: 600, color: '#ffd76a', opacity: 0.8 }}>Você</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommunityMembers;
