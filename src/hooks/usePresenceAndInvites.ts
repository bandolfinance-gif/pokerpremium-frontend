import { useCallback, useEffect, useState } from 'react';
import { acceptInvite, declineInvite, fetchPendingInvites, pingPresence, TableInvite } from '../services/invitesApi';

const HEARTBEAT_MS = 25 * 1000;
const POLL_MS = 8 * 1000;

// Mantém o jogador "visível" pra dealer (heartbeat) e busca convites de
// mesa pendentes em polling — roda o tempo todo que o cockpit está aberto,
// não só na aba Mesa, porque a dealer pode chamar alguém que está
// navegando em Cursos ou Comunidade.
export const usePresenceAndInvites = (token: string) => {
  const [invites, setInvites] = useState<TableInvite[]>([]);

  useEffect(() => {
    const beat = () => pingPresence(token).catch(() => {});
    beat();
    const id = setInterval(beat, HEARTBEAT_MS);
    return () => clearInterval(id);
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    const poll = () => {
      fetchPendingInvites(token)
        .then((data) => {
          if (!cancelled) setInvites(data);
        })
        .catch(() => {});
    };
    poll();
    const id = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [token]);

  const respond = useCallback(
    async (inviteId: string, action: 'accept' | 'decline'): Promise<string | null> => {
      setInvites((prev) => prev.filter((inv) => inv.id !== inviteId));
      if (action === 'accept') {
        const { tableId } = await acceptInvite(token, inviteId);
        return tableId;
      }
      await declineInvite(token, inviteId);
      return null;
    },
    [token]
  );

  return { invites, respond };
};
