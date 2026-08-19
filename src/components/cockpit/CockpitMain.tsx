import React, { useEffect, useRef, useState } from 'react';

import CockpitLayout from './CockpitLayout';
import CockpitFX from './CockpitFX';
import CockpitTabs, { CockpitTab } from './CockpitTabs';
import CockpitIAView from './CockpitIAView';
import ActiveTablesView from './ActiveTablesView';
import TournamentsView from './TournamentsView';
import CommunityView from './CommunityView';
import CoursesView from './CoursesView';
import AdminDashboardView from './AdminDashboardView';
import PlayerDashboardView from './PlayerDashboardView';
import HouseDashboardView from './HouseDashboardView';
import ProfileView from './ProfileView';
import DealerVoice from './DealerVoice';
import InviteNotifications from './InviteNotifications';
import PokerTable from '../table/PokerTable';
import ChatBox from '../table/ChatBox';
import { useGameSocket } from '../../services/gameSocket';
import { setLiveGameState } from '../../services/liveGameStore';
import { usePresenceAndInvites } from '../../hooks/usePresenceAndInvites';

interface CockpitMainProps {
  userId: string;
  userName: string;
  userRole: string;
  userAvatarImage: string | null;
  token: string;
  onLogout: () => void;
  onProfileUpdate: (updates: { name?: string; email?: string; avatarImage?: string | null }) => void;
}

// Container principal do cockpit: monta FX + Layout e alterna entre as
// visões do cockpit por aba. A conexão com a mesa (useGameSocket) vive
// aqui, não dentro de PokerTable — assim ela continua ativa mesmo quando
// o jogador está na aba Cockpit IA, que depende de dados em tempo real
// da mesma mão.
const CockpitMain: React.FC<CockpitMainProps> = ({ userId, userName, userRole, userAvatarImage, token, onLogout, onProfileUpdate }) => {
  const [tab, setTab] = useState<CockpitTab>(
    () => (new URLSearchParams(window.location.search).get('tab') as CockpitTab) || 'mesa'
  );
  const [selectedTableId, setSelectedTableId] = useState(
    () => new URLSearchParams(window.location.search).get('tableId') || 'mesa-principal'
  );
  const { state: gameState, error: gameError, startHand, sendAction, leaveTable } = useGameSocket(token, selectedTableId);
  const { invites, respond } = usePresenceAndInvites(token);

  useEffect(() => {
    setLiveGameState(gameState?.hand ?? null, gameState?.tableSeats ?? [], userId);
  }, [gameState, userId]);

  // Detecta quando o jogador REALMENTE saiu da mesa (deixou de aparecer em
  // tableSeats depois de ter aparecido) e tira ele da tela da mesa
  // sozinho — clicar "SAIR DA MESA" antes só mandava o pedido pro
  // servidor, mas a tela continuava mostrando a mesma mesa vazia, sem
  // nenhuma confirmação visível de que realmente saiu.
  const wasSeatedRef = useRef(false);
  useEffect(() => {
    const isSeated = gameState?.tableSeats.some((s) => s.userId === userId) ?? false;
    if (isSeated) {
      wasSeatedRef.current = true;
    } else if (wasSeatedRef.current) {
      wasSeatedRef.current = false;
      setTab('mesas-ativas');
    }
  }, [gameState, userId]);

  const handleJoinTable = (tableId: string) => {
    setSelectedTableId(tableId);
    setTab('mesa');
  };

  return (
    <CockpitLayout>
      <CockpitFX />
      <DealerVoice />
      <InviteNotifications invites={invites} onRespond={respond} onAcceptedTable={handleJoinTable} />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <CockpitTabs active={tab} onChange={setTab} onLogout={onLogout} userRole={userRole} />
        <div style={{ position: 'relative', flex: 1, overflow: 'auto' }}>
          {tab === 'mesa' && (
            <>
              <PokerTable
                userId={userId}
                token={token}
                tableId={selectedTableId}
                state={gameState}
                error={gameError}
                startHand={startHand}
                sendAction={sendAction}
                leaveTable={leaveTable}
              />
              <ChatBox token={token} tableId={selectedTableId} />
            </>
          )}
          {tab === 'ia' && <CockpitIAView />}
          {tab === 'mesas-ativas' && (
            <ActiveTablesView userRole={userRole} userId={userId} token={token} onJoinTable={handleJoinTable} />
          )}
          {tab === 'torneios' && (
            <TournamentsView userRole={userRole} userId={userId} token={token} onJoinTournament={handleJoinTable} />
          )}
          {tab === 'comunidade' && (
            <CommunityView userId={userId} userName={userName} userAvatarImage={userAvatarImage} token={token} />
          )}
          {tab === 'cursos' && <CoursesView userName={userName} token={token} />}
          {tab === 'relatorios' && userRole === 'admin' && <AdminDashboardView token={token} />}
          {tab === 'relatorios' && (userRole === 'house' || userRole === 'agent') && <HouseDashboardView userRole={userRole} token={token} />}
          {tab === 'relatorios' && userRole === 'player' && <PlayerDashboardView userName={userName} token={token} />}
          {tab === 'perfil' && <ProfileView token={token} onProfileUpdate={onProfileUpdate} />}
        </div>
      </div>
    </CockpitLayout>
  );
};

export default CockpitMain;
