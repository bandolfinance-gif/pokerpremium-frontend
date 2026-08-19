import React, { useState } from 'react';
import { TableInvite } from '../../services/invitesApi';
import { ELEGANT_FONT as SANS } from '../../styles/elegantTheme';

interface InviteNotificationsProps {
  invites: TableInvite[];
  onRespond: (inviteId: string, action: 'accept' | 'decline') => Promise<string | null>;
  onAcceptedTable: (tableId: string) => void;
}

// Overlay flutuante com os convites de mesa que a dealer disparou pra
// esse jogador — fica de pé em cima de qualquer aba (heartbeat/polling
// rodam o cockpit inteiro, não só a Mesa), por isso vive fora do fluxo
// normal de layout, ancorado no canto.
const InviteNotifications: React.FC<InviteNotificationsProps> = ({ invites, onRespond, onAcceptedTable }) => {
  const [busyId, setBusyId] = useState<string | null>(null);

  if (invites.length === 0) return null;

  const handle = async (invite: TableInvite, action: 'accept' | 'decline') => {
    setBusyId(invite.id);
    try {
      const tableId = await onRespond(invite.id, action);
      if (action === 'accept' && tableId) onAcceptedTable(tableId);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 84,
        right: 20,
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        width: 320,
        maxWidth: 'calc(100vw - 40px)',
        fontFamily: SANS,
      }}
    >
      {invites.map((invite) => (
        <div
          key={invite.id}
          style={{
            background: 'linear-gradient(160deg, rgba(0,26,36,0.92), rgba(0,0,0,0.88))',
            border: '1px solid rgba(0,234,255,0.4)',
            borderRadius: 16,
            padding: '16px 18px',
            boxShadow: '0 8px 28px rgba(0,0,0,0.5), 0 0 18px rgba(0,234,255,0.18)',
            backdropFilter: 'blur(10px)',
            animation: 'invite-drop-in 0.35s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 16 }}>🎲</span>
            <span style={{ color: '#00eaff', fontWeight: 700, fontSize: 12, letterSpacing: 0.4 }}>
              CONVITE DA DEALER
            </span>
          </div>
          <div style={{ color: '#e8fdff', fontSize: 14, lineHeight: 1.4, marginBottom: 4 }}>
            <strong>{invite.fromName}</strong> tem uma vaga aberta na mesa
          </div>
          <div style={{ color: '#ffd76a', fontSize: 15, fontWeight: 700, marginBottom: 14 }}>
            {invite.tableName}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => handle(invite, 'accept')}
              disabled={busyId === invite.id}
              style={{
                flex: 1,
                padding: '9px 0',
                borderRadius: 20,
                border: '1px solid #00eaff',
                background: 'rgba(0,234,255,0.16)',
                color: '#00eaff',
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 13,
                cursor: busyId === invite.id ? 'default' : 'pointer',
                opacity: busyId === invite.id ? 0.6 : 1,
              }}
            >
              Entrar na mesa
            </button>
            <button
              onClick={() => handle(invite, 'decline')}
              disabled={busyId === invite.id}
              style={{
                flex: 1,
                padding: '9px 0',
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.25)',
                background: 'transparent',
                color: 'rgba(232,253,255,0.65)',
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: 13,
                cursor: busyId === invite.id ? 'default' : 'pointer',
                opacity: busyId === invite.id ? 0.6 : 1,
              }}
            >
              Agora não
            </button>
          </div>
        </div>
      ))}
      <style>{`
        @keyframes invite-drop-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default InviteNotifications;
