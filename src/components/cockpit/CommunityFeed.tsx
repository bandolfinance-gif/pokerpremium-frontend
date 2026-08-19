import React, { useEffect, useRef, useState } from 'react';
import { addComment, CommunityFeedPost, createPost, fetchPosts, toggleLike } from '../../services/communityApi';
import PlayerAvatarRenderer from '../table/PlayerAvatarRenderer';
import { ELEGANT_FONT as SANS } from '../../styles/elegantTheme';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

interface CommunityFeedProps {
  token: string;
  userAvatarImage: string | null;
  userName: string;
  onOpenProfile: (userId: string) => void;
}

const avatarFor = (id: string, avatarImage: string | null) =>
  avatarImage ? { id, avatarImage: `${API_URL}${avatarImage}`, avatarType: 'photo' as const } : undefined;

const initialsOf = (name: string) => name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

const timeAgo = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `${min}min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
};

// Linha do tempo estilo feed social (avatar + nome no topo, mídia em
// destaque, curtir/comentar embaixo) — familiar de qualquer rede social,
// com acabamento elegante (tipografia de sistema, não monospace) sobre a
// paleta neon do resto do app. Posts de conquista (auto-gerados quando o
// jogador desbloqueia algo real) ganham um tratamento visual dourado
// distinto dos posts manuais.
const CommunityFeed: React.FC<CommunityFeedProps> = ({ token, userAvatarImage, userName, onOpenProfile }) => {
  const [posts, setPosts] = useState<CommunityFeedPost[]>([]);
  const [scope, setScope] = useState<'todos' | 'seguindo'>('todos');
  const [novoPost, setNovoPost] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [feedError, setFeedError] = useState('');
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPosts = () => {
    fetchPosts(token, scope).then(setPosts).catch(() => setFeedError('Não foi possível carregar o feed.'));
  };

  useEffect(loadPosts, [token, scope]);

  const handlePickMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setMediaFile(file);
    setMediaPreview(file ? URL.createObjectURL(file) : null);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoPost.trim() && !mediaFile) return;
    setPublishing(true);
    setFeedError('');
    try {
      await createPost(token, novoPost.trim(), mediaFile);
      setNovoPost('');
      setMediaFile(null);
      setMediaPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      loadPosts();
    } catch {
      setFeedError('Não foi possível publicar — verifique se não tem conteúdo impróprio.');
    } finally {
      setPublishing(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const updated = await toggleLike(token, postId);
      setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
    } catch {
      setFeedError('Não foi possível curtir.');
    }
  };

  const handleComment = async (postId: string) => {
    const texto = commentDrafts[postId];
    if (!texto || !texto.trim()) return;
    try {
      const updated = await addComment(token, postId, texto.trim());
      setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
      setCommentDrafts((prev) => ({ ...prev, [postId]: '' }));
    } catch {
      setFeedError('Não foi possível comentar — verifique se não tem conteúdo impróprio.');
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', fontFamily: SANS }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
        {(['todos', 'seguindo'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setScope(s)}
            style={{
              padding: '6px 18px',
              borderRadius: 20,
              border: scope === s ? '1px solid #ffd76a' : '1px solid rgba(0,234,255,0.35)',
              background: scope === s ? 'linear-gradient(135deg, rgba(255,215,106,0.2), rgba(255,111,174,0.12))' : 'rgba(0,0,0,0.3)',
              color: scope === s ? '#ffd76a' : 'rgba(0,234,255,0.75)',
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {s === 'todos' ? 'Todos' : 'Seguindo'}
          </button>
        ))}
      </div>

      {/* composer */}
      <form
        onSubmit={handlePublish}
        style={{
          background: 'linear-gradient(160deg, rgba(0,20,30,0.7), rgba(0,0,0,0.55))',
          border: '1px solid rgba(0,234,255,0.35)',
          borderRadius: 18,
          padding: 14,
          marginBottom: 22,
          boxShadow: '0 0 20px rgba(0,234,255,0.15)',
        }}
      >
        <div style={{ display: 'flex', gap: 10 }}>
          <PlayerAvatarRenderer avatar={avatarFor('me', userAvatarImage)} fallbackInitials={initialsOf(userName)} size={38} />
          <textarea
            value={novoPost}
            onChange={(e) => setNovoPost(e.target.value)}
            placeholder="Compartilhar uma vitória, conquista, foto ou reel..."
            rows={2}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              color: '#e8fdff',
              fontFamily: SANS,
              fontSize: 14,
              paddingTop: 8,
            }}
          />
        </div>

        {mediaPreview && (
          <div style={{ position: 'relative', marginTop: 8, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(0,234,255,0.3)' }}>
            {mediaFile?.type.startsWith('video') ? (
              <video src={mediaPreview} style={{ width: '100%', maxHeight: 260, display: 'block' }} controls />
            ) : (
              <img src={mediaPreview} alt="" style={{ width: '100%', maxHeight: 260, objectFit: 'cover', display: 'block' }} />
            )}
            <button
              type="button"
              onClick={() => { setMediaFile(null); setMediaPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
              style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.7)', border: '1px solid #ff4d6d', color: '#ff4d6d', borderRadius: 8, fontFamily: SANS, fontWeight: 600, fontSize: 11, padding: '3px 10px', cursor: 'pointer' }}
            >
              Remover
            </button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{ background: 'none', border: '1px solid rgba(0,234,255,0.3)', borderRadius: 20, color: '#00eaff', fontFamily: SANS, fontWeight: 600, fontSize: 12, padding: '6px 14px', cursor: 'pointer' }}
          >
            📷 Foto / Reel
          </button>
          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,video/mp4,video/webm" onChange={handlePickMedia} style={{ display: 'none' }} />

          <button
            type="submit"
            disabled={publishing || (!novoPost.trim() && !mediaFile)}
            style={{
              padding: '7px 20px',
              borderRadius: 20,
              border: '1px solid #ffd76a',
              background: 'linear-gradient(135deg, rgba(255,215,106,0.25), rgba(255,111,174,0.15))',
              color: '#ffd76a',
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 13,
              cursor: publishing ? 'not-allowed' : 'pointer',
              opacity: publishing || (!novoPost.trim() && !mediaFile) ? 0.5 : 1,
            }}
          >
            {publishing ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </form>

      {feedError && <div style={{ color: '#ff4d6d', fontSize: 12, marginBottom: 12, textAlign: 'center' }}>{feedError}</div>}
      {posts.length === 0 && <div style={{ opacity: 0.5, fontSize: 13, textAlign: 'center' }}>Nenhuma publicação ainda.</div>}

      {posts.map((post) => {
        const isConquista = post.tipo === 'conquista';
        return (
          <div
            key={post.id}
            style={{
              borderRadius: 18,
              marginBottom: 18,
              overflow: 'hidden',
              border: isConquista ? '1px solid #ffd76a' : '1px solid rgba(0,234,255,0.25)',
              background: isConquista
                ? 'linear-gradient(160deg, rgba(255,215,106,0.14), rgba(0,0,0,0.6))'
                : 'linear-gradient(160deg, rgba(0,20,30,0.55), rgba(0,0,0,0.55))',
              boxShadow: isConquista ? '0 0 24px rgba(255,215,106,0.25)' : '0 0 14px rgba(0,234,255,0.1)',
            }}
          >
            <div
              onClick={() => onOpenProfile(post.autorId)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px 10px', cursor: 'pointer' }}
            >
              <PlayerAvatarRenderer avatar={avatarFor(post.autorId, post.autorAvatarImage)} fallbackInitials={initialsOf(post.autorNome)} size={38} />
              <div style={{ flex: 1 }}>
                <div style={{ color: isConquista ? '#ffd76a' : '#f2fbff', fontWeight: 600, fontSize: 14 }}>{post.autorNome}</div>
                <div style={{ fontSize: 11, opacity: 0.5 }}>{timeAgo(post.createdAt)}</div>
              </div>
              {isConquista && <div style={{ fontSize: 24 }}>{post.conquistaIcone}</div>}
            </div>

            {isConquista ? (
              <div style={{ padding: '0 16px 14px' }}>
                <div style={{ color: '#ffd76a', fontSize: 14 }}>
                  🎖️ Desbloqueou: <strong>{post.conquistaTitulo}</strong>
                </div>
              </div>
            ) : (
              post.texto && <div style={{ padding: '0 16px 12px', color: '#e8fdff', fontSize: 14, lineHeight: 1.5 }}>{post.texto}</div>
            )}

            {post.midiaUrl && (
              <div style={{ background: '#000' }}>
                {post.midiaTipo === 'video' ? (
                  <video src={`${API_URL}${post.midiaUrl}`} style={{ width: '100%', maxHeight: 420, display: 'block' }} controls />
                ) : (
                  <img src={`${API_URL}${post.midiaUrl}`} alt="" style={{ width: '100%', maxHeight: 420, objectFit: 'cover', display: 'block' }} />
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: 18, padding: '12px 16px', fontSize: 13 }}>
              <button
                onClick={() => handleLike(post.id)}
                style={{ background: 'none', border: 'none', color: post.curtidoPorMim ? '#ff6fae' : 'rgba(232,253,255,0.75)', cursor: 'pointer', fontFamily: SANS, fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {post.curtidoPorMim ? '❤️' : '🤍'} {post.curtidas}
              </button>
              <button
                onClick={() => setOpenComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                style={{ background: 'none', border: 'none', color: 'rgba(232,253,255,0.75)', cursor: 'pointer', fontFamily: SANS, fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                💬 {post.comentarios.length}
              </button>
            </div>

            {openComments[post.id] && (
              <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(0,234,255,0.12)', paddingTop: 12 }}>
                {post.comentarios.map((c) => (
                  <div key={c.id} style={{ fontSize: 13, marginBottom: 6 }}>
                    <strong style={{ color: '#00eaff' }}>{c.autorNome}</strong> <span style={{ opacity: 0.9 }}>{c.texto}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  <input
                    value={commentDrafts[post.id] ?? ''}
                    onChange={(e) => setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                    placeholder="Comentar..."
                    style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0,234,255,0.25)', borderRadius: 20, color: '#e8fdff', padding: '7px 14px', fontFamily: SANS, fontSize: 13 }}
                  />
                  <button
                    onClick={() => handleComment(post.id)}
                    style={{ background: 'rgba(0,234,255,0.15)', border: 'none', borderRadius: 20, color: '#00eaff', padding: '6px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
                  >
                    ➤
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CommunityFeed;
