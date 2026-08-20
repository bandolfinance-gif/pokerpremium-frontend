import React, { useEffect, useState } from 'react';
import {
  addComment,
  CommunityFeedPost,
  CommunityFollowUser,
  CommunityProfile as CommunityProfileData,
  fetchCommunityProfile,
  fetchFollowers,
  fetchFollowing,
  followUser,
  toggleLike,
  unfollowUser,
} from '../../services/communityApi';
import PlayerAvatarRenderer from '../table/PlayerAvatarRenderer';
import { ELEGANT_FONT as SANS } from '../../styles/elegantTheme';
import { resolveMediaUrl } from '../../services/media';

interface CommunityProfileProps {
  token: string;
  userId: string;
  onOpenProfile: (userId: string) => void;
  onBack: () => void;
}

const initialsOf = (name: string) => name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
const avatarFor = (id: string, avatarImage: string | null) => {
  const resolved = resolveMediaUrl(avatarImage);
  return resolved ? { id, avatarImage: resolved, avatarType: 'photo' as const } : undefined;
};

const timeAgo = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `${min}min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
};

// Perfil público de comunidade — próprio ou de outro jogador. Conquistas
// são reais (calculadas a partir de mãos/torneios de verdade, ver
// backend/services/achievements.js), não decorativas.
const CommunityProfile: React.FC<CommunityProfileProps> = ({ token, userId, onOpenProfile, onBack }) => {
  const [profile, setProfile] = useState<CommunityProfileData | null>(null);
  const [listaAberta, setListaAberta] = useState<'seguidores' | 'seguindo' | null>(null);
  const [lista, setLista] = useState<CommunityFollowUser[]>([]);
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<'grade' | 'linha'>('grade');
  const [lightboxPostId, setLightboxPostId] = useState<string | null>(null);

  const load = () => {
    fetchCommunityProfile(token, userId).then(setProfile).catch(() => {});
  };

  useEffect(load, [token, userId]);

  const toggleFollow = async () => {
    if (!profile) return;
    if (profile.sigo) await unfollowUser(token, userId);
    else await followUser(token, userId);
    load();
  };

  const abrirLista = async (tipo: 'seguidores' | 'seguindo') => {
    setListaAberta(tipo);
    const data = tipo === 'seguidores' ? await fetchFollowers(token, userId) : await fetchFollowing(token, userId);
    setLista(data);
  };

  const handleLike = async (postId: string) => {
    const updated = await toggleLike(token, postId);
    setProfile((prev) => (prev ? { ...prev, posts: prev.posts.map((p) => (p.id === postId ? updated : p)) } : prev));
  };

  const handleComment = async (postId: string) => {
    const texto = commentDrafts[postId];
    if (!texto || !texto.trim()) return;
    const updated = await addComment(token, postId, texto.trim());
    setProfile((prev) => (prev ? { ...prev, posts: prev.posts.map((p) => (p.id === postId ? updated : p)) } : prev));
    setCommentDrafts((prev) => ({ ...prev, [postId]: '' }));
  };

  const renderPostCard = (post: CommunityFeedPost) => {
    const isConquista = post.tipo === 'conquista';
    return (
      <div
        key={post.id}
        style={{
          borderRadius: 14,
          marginBottom: 12,
          overflow: 'hidden',
          border: isConquista ? '1px solid #ffd76a' : '1px solid rgba(0,234,255,0.25)',
          background: isConquista ? 'rgba(255,215,106,0.08)' : 'rgba(0,20,30,0.4)',
        }}
      >
        <div style={{ padding: '10px 14px 6px', fontSize: 10, opacity: 0.6 }}>{timeAgo(post.createdAt)}</div>
        {isConquista ? (
          <div style={{ padding: '0 14px 10px', color: '#ffd76a', fontSize: 12 }}>
            {post.conquistaIcone} Desbloqueou: <strong>{post.conquistaTitulo}</strong>
          </div>
        ) : (
          post.texto && <div style={{ padding: '0 14px 10px', fontSize: 12 }}>{post.texto}</div>
        )}
        {post.midiaUrl && (
          <div style={{ background: '#000' }}>
            {post.midiaTipo === 'video' ? (
              <video src={resolveMediaUrl(post.midiaUrl) || ''} style={{ width: '100%', maxHeight: 360, display: 'block' }} controls />
            ) : (
              <img src={resolveMediaUrl(post.midiaUrl) || ''} alt="" style={{ width: '100%', maxHeight: 360, objectFit: 'cover', display: 'block' }} />
            )}
          </div>
        )}
        <div style={{ display: 'flex', gap: 14, padding: '8px 14px', fontSize: 11 }}>
          <button onClick={() => handleLike(post.id)} style={{ background: 'none', border: 'none', color: post.curtidoPorMim ? '#ff6fae' : 'rgba(232,253,255,0.7)', cursor: 'pointer', fontSize: 12 }}>
            {post.curtidoPorMim ? '❤️' : '🤍'} {post.curtidas}
          </button>
          <button onClick={() => setOpenComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))} style={{ background: 'none', border: 'none', color: 'rgba(232,253,255,0.7)', cursor: 'pointer', fontSize: 12 }}>
            💬 {post.comentarios.length}
          </button>
        </div>
        {openComments[post.id] && (
          <div style={{ padding: '0 14px 12px' }}>
            {post.comentarios.map((c) => (
              <div key={c.id} style={{ fontSize: 11, marginBottom: 4 }}>
                <strong style={{ color: '#00eaff' }}>{c.autorNome}</strong> {c.texto}
              </div>
            ))}
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              <input
                value={commentDrafts[post.id] ?? ''}
                onChange={(e) => setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                placeholder="Comentar..."
                style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0,234,255,0.25)', borderRadius: 20, color: '#e8fdff', padding: '6px 14px', fontFamily: SANS, fontSize: 13 }}
              />
              <button onClick={() => handleComment(post.id)} style={{ background: 'rgba(0,234,255,0.15)', border: 'none', borderRadius: 20, color: '#00eaff', padding: '6px 14px', cursor: 'pointer' }}>➤</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!profile) {
    return <div style={{ textAlign: 'center', opacity: 0.5, fontSize: 12 }}>Carregando perfil...</div>;
  }

  const avatar = avatarFor(profile.id, profile.avatarImage);
  const conquistasGanhas = profile.achievements.filter((a) => a.conquistado).length;

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', fontFamily: SANS }}>
      <button onClick={onBack} style={{ background: 'none', border: '1px solid rgba(0,234,255,0.4)', borderRadius: 20, color: '#00eaff', fontFamily: SANS, fontWeight: 600, fontSize: 12, padding: '5px 14px', cursor: 'pointer', marginBottom: 16 }}>
        ← Voltar
      </button>

      <div
        style={{
          background: 'linear-gradient(160deg, rgba(0,20,30,0.7), rgba(0,0,0,0.55))',
          border: '1px solid rgba(0,234,255,0.35)',
          borderRadius: 16,
          padding: 20,
          marginBottom: 18,
          boxShadow: '0 0 24px rgba(0,234,255,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <PlayerAvatarRenderer avatar={avatar} fallbackInitials={initialsOf(profile.name)} size={84} />
          <div style={{ flex: 1 }}>
            <div style={{ color: '#f2fbff', fontWeight: 700, fontSize: 19 }}>{profile.name}</div>
            <div style={{ fontSize: 12, opacity: 0.55, marginTop: 3 }}>
              Membro desde {new Date(profile.membroDesde).toLocaleDateString('pt-BR')}
            </div>
            <div style={{ display: 'flex', gap: 20, marginTop: 12, fontSize: 13 }}>
              <div>
                <span style={{ color: '#ffd76a', fontWeight: 700 }}>{conquistasGanhas}</span> conquistas
              </div>
              <div onClick={() => abrirLista('seguidores')} style={{ cursor: 'pointer' }}>
                <span style={{ color: '#ffd76a', fontWeight: 700 }}>{profile.followerCount}</span> seguidores
              </div>
              <div onClick={() => abrirLista('seguindo')} style={{ cursor: 'pointer' }}>
                <span style={{ color: '#ffd76a', fontWeight: 700 }}>{profile.followingCount}</span> seguindo
              </div>
            </div>
          </div>
          {!profile.souEu && (
            <button
              onClick={toggleFollow}
              style={{
                padding: '8px 20px',
                borderRadius: 20,
                border: profile.sigo ? '1px solid rgba(0,234,255,0.4)' : '1px solid #ffd76a',
                background: profile.sigo ? 'rgba(0,234,255,0.08)' : 'linear-gradient(135deg, rgba(255,215,106,0.25), rgba(255,111,174,0.15))',
                color: profile.sigo ? 'rgba(232,253,255,0.7)' : '#ffd76a',
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              {profile.sigo ? 'Seguindo' : '+ Seguir'}
            </button>
          )}
        </div>
      </div>

      {listaAberta && (
        <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,234,255,0.3)', borderRadius: 12, padding: 14, marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#00eaff', fontWeight: 700, fontSize: 13 }}>{listaAberta === 'seguidores' ? 'Seguidores' : 'Seguindo'}</span>
            <button onClick={() => setListaAberta(null)} style={{ background: 'none', border: 'none', color: 'rgba(232,253,255,0.6)', cursor: 'pointer', fontSize: 14 }}>✕</button>
          </div>
          {lista.length === 0 && <div style={{ fontSize: 12, opacity: 0.5 }}>Ninguém aqui ainda.</div>}
          {lista.map((u) => (
            <div key={u.id} onClick={() => onOpenProfile(u.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', cursor: 'pointer' }}>
              <PlayerAvatarRenderer avatar={avatarFor(u.id, u.avatarImage)} fallbackInitials={initialsOf(u.name)} size={28} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>{u.name}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ color: '#ffd76a', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Conquistas</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 24 }}>
        {profile.achievements.map((a) => (
          <div
            key={a.id}
            title={a.descricao}
            style={{
              padding: 12,
              borderRadius: 12,
              textAlign: 'center',
              border: a.conquistado ? '1px solid #ffd76a' : '1px solid rgba(255,255,255,0.12)',
              background: a.conquistado ? 'rgba(255,215,106,0.1)' : 'rgba(0,0,0,0.25)',
              opacity: a.conquistado ? 1 : 0.4,
            }}
          >
            <div style={{ fontSize: 24 }}>{a.icone}</div>
            <div style={{ fontSize: 12, fontWeight: 600, marginTop: 5 }}>{a.titulo}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ color: '#00eaff', fontWeight: 700, fontSize: 13 }}>Publicações</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['grade', 'linha'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              style={{
                padding: '5px 14px',
                borderRadius: 16,
                border: viewMode === v ? '1px solid #ffd76a' : '1px solid rgba(0,234,255,0.3)',
                background: viewMode === v ? 'rgba(255,215,106,0.14)' : 'transparent',
                color: viewMode === v ? '#ffd76a' : 'rgba(232,253,255,0.6)',
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              {v === 'grade' ? '▦ Álbum' : '☰ Linha do tempo'}
            </button>
          ))}
        </div>
      </div>

      {profile.posts.length === 0 && <div style={{ fontSize: 13, opacity: 0.5 }}>Nenhuma publicação ainda.</div>}

      {viewMode === 'grade' && profile.posts.length > 0 && (() => {
        const comMidia = profile.posts.filter((p) => p.midiaUrl);
        if (comMidia.length === 0) {
          return <div style={{ fontSize: 13, opacity: 0.5 }}>Nenhuma foto ou reel publicado ainda — mude pra "Linha do tempo" pra ver os posts de texto/conquista.</div>;
        }
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
            {comMidia.map((post) => (
              <div
                key={post.id}
                onClick={() => setLightboxPostId(post.id)}
                style={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden', borderRadius: 4, cursor: 'pointer', background: '#000' }}
              >
                {post.midiaTipo === 'video' ? (
                  <video src={resolveMediaUrl(post.midiaUrl) || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} muted />
                ) : (
                  <img src={resolveMediaUrl(post.midiaUrl) || ''} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                )}
                {post.midiaTipo === 'video' && (
                  <div style={{ position: 'absolute', top: 6, right: 6, fontSize: 13, textShadow: '0 0 4px rgba(0,0,0,0.8)' }}>▶</div>
                )}
                {(post.curtidas > 0 || post.comentarios.length > 0) && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', gap: 10, justifyContent: 'center', padding: '4px 0 5px', background: 'linear-gradient(0deg, rgba(0,0,0,0.75), transparent)' }}>
                    {post.curtidas > 0 && <span style={{ color: '#fff', fontWeight: 700, fontSize: 11 }}>❤️ {post.curtidas}</span>}
                    {post.comentarios.length > 0 && <span style={{ color: '#fff', fontWeight: 700, fontSize: 11 }}>💬 {post.comentarios.length}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })()}

      {viewMode === 'linha' && profile.posts.map((post: CommunityFeedPost) => renderPostCard(post))}

      {lightboxPostId && (() => {
        const post = profile.posts.find((p) => p.id === lightboxPostId);
        if (!post) return null;
        return (
          <div
            onClick={() => setLightboxPostId(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          >
            <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
              <button
                onClick={() => setLightboxPostId(null)}
                style={{ marginBottom: 10, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 20, color: '#fff', padding: '5px 14px', cursor: 'pointer', fontFamily: SANS, fontSize: 12 }}
              >
                ✕ Fechar
              </button>
              {renderPostCard(post)}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default CommunityProfile;
