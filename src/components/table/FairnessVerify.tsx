import React, { useState } from 'react';
import { FairnessResult, VerifiableHand, verifyHandFairness } from '../../services/provablyFair';

interface FairnessVerifyProps {
  hand: VerifiableHand;
}

// Botão de auditoria: roda a verificação inteira no navegador do próprio
// jogador — não pede pro servidor "confirmar" nada, o cálculo é feito
// aqui. Só aparece quando a mão termina (é quando a seed é revelada).
const FairnessVerify: React.FC<FairnessVerifyProps> = ({ hand }) => {
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<FairnessResult | null>(null);

  if (!hand.serverSeed) return null;

  const handleVerify = async () => {
    setOpen(true);
    setChecking(true);
    const r = await verifyHandFairness(hand);
    setResult(r);
    setChecking(false);
  };

  return (
    // Fica na fileira de controles ACIMA da mesa (mesma linha do HISTÓRICO/
    // SAIR DA MESA), não dentro do oval — antes ficava colado embaixo do
    // oval (bottom:-22) e a curva da elipse passava bem em cima do texto;
    // com várias mesas/quantidades de jogadores diferentes também podia
    // cair debaixo do assento da posição inferior-esquerda.
    <div style={{ position: 'absolute', top: -34, left: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          title="Hash da seed do embaralhamento, publicado antes da mão começar — permite auditar depois que o baralho não foi manipulado."
          style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(0,234,255,0.4)' }}
        >
          🔒 fair-hash: {hand.serverSeedHash.slice(0, 12)}…
        </span>
        <button
          onClick={handleVerify}
          style={{
            fontFamily: 'monospace',
            fontSize: '9px',
            padding: '1px 6px',
            borderRadius: 4,
            border: '1px solid rgba(255,215,106,0.5)',
            background: 'rgba(255,215,106,0.08)',
            color: '#ffd76a',
            cursor: 'pointer',
          }}
        >
          VERIFICAR MÃO
        </button>
      </div>

      {open && (
        // Modal flutuante centralizado (fixed, cobre a tela toda) em vez de
        // um bloco que crescia inline a partir do canto do oval — antes
        // isso invadia por cima do assento de cima-esquerda (que fica bem
        // perto desse canto) sempre que o resultado aparecia. Assim nunca
        // colide com nenhum assento, não importa a posição.
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              padding: '16px 18px',
              borderRadius: 10,
              background: '#05070a',
              border: '1px solid rgba(255,215,106,0.5)',
              boxShadow: '0 0 30px rgba(255,215,106,0.25)',
              fontFamily: 'monospace',
              fontSize: 12,
              color: '#e8fdff',
              width: 320,
              maxWidth: '90vw',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ color: '#ffd76a', letterSpacing: 0.5 }}>AUDITORIA DA MÃO</span>
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', color: '#00eaff', cursor: 'pointer', fontSize: 16 }}
              >
                ×
              </button>
            </div>
            {checking && <div style={{ opacity: 0.7 }}>Recalculando embaralhamento no seu navegador...</div>}
            {!checking && result && (
              <>
                <div style={{ color: result.hashOk ? '#7dff9c' : '#ff4d6d' }}>
                  {result.hashOk ? '✔' : '✘'} Hash publicado bate com a seed revelada
                </div>
                <div style={{ color: result.dealOk ? '#7dff9c' : '#ff4d6d', marginTop: 4 }}>
                  {result.dealOk ? '✔' : '✘'} Cartas batem com o embaralhamento reproduzido
                </div>
                <div style={{ marginTop: 10, opacity: 0.55, fontSize: 10, wordBreak: 'break-all', lineHeight: 1.5 }}>
                  seed: {hand.serverSeed}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FairnessVerify;
