import React, { useEffect, useState } from 'react';
import {
  concluirLicao,
  Certificado,
  CursoDetalhe,
  fetchCurso,
  gerarCertificado,
  responderExercicio,
  RespostaResultado,
} from '../../services/cursosApi';
import { ELEGANT_FONT as SANS } from '../../styles/elegantTheme';

interface CourseDetailViewProps {
  slug: string;
  token: string;
  userName: string;
  onBack: () => void;
}

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

const disabledBtnStyle: React.CSSProperties = {
  ...btnStyle,
  opacity: 0.35,
  cursor: 'not-allowed',
};

// Leitor de curso real: sidebar com as lições e progresso de verdade
// (persistido por usuário no backend), conteúdo em múltiplas páginas por
// lição, e exercício de múltipla escolha que só marca a lição como
// concluída se a resposta estiver certa. Certificado só libera quando
// TODAS as lições do curso foram concluídas de verdade.
const CourseDetailView: React.FC<CourseDetailViewProps> = ({ slug, token, userName, onBack }) => {
  const [curso, setCurso] = useState<CursoDetalhe | null>(null);
  const [licaoIndex, setLicaoIndex] = useState(0);
  const [paginaIndex, setPaginaIndex] = useState(0);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<number | null>(null);
  const [resposta, setResposta] = useState<RespostaResultado | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [certificado, setCertificado] = useState<Certificado | null>(null);

  useEffect(() => {
    fetchCurso(slug, token).then((c) => {
      setCurso(c);
      const primeiraIncompleta = c.licoes.findIndex((l) => !l.concluida);
      setLicaoIndex(primeiraIncompleta === -1 ? 0 : primeiraIncompleta);
    });
  }, [slug, token]);

  const irParaLicao = (index: number) => {
    setLicaoIndex(index);
    setPaginaIndex(0);
    setOpcaoSelecionada(null);
    setResposta(null);
  };

  if (certificado) {
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: 520,
            padding: '36px 40px',
            border: '2px solid #ffd76a',
            borderRadius: 20,
            background: 'rgba(0,0,0,0.7)',
            boxShadow: '0 0 30px rgba(255,215,106,0.4)',
            textAlign: 'center',
            fontFamily: SANS,
            color: '#e8fdff',
          }}
        >
          <div style={{ color: '#ffd76a', letterSpacing: 3, fontSize: 13, fontWeight: 700 }}>CERTIFICADO POKERPREMIUM</div>
          <div style={{ margin: '20px 0 6px', fontSize: 24, fontWeight: 700, color: '#ffd76a' }}>{certificado.aluno}</div>
          <div style={{ opacity: 0.8, marginBottom: 16 }}>concluiu o curso</div>
          <div style={{ fontSize: 19, fontWeight: 600, marginBottom: 20 }}>{certificado.curso}</div>
          <div style={{ opacity: 0.75, fontSize: 13, lineHeight: 1.6 }}>{certificado.mensagem}</div>
          <div style={{ marginTop: 18, fontSize: 12, opacity: 0.6 }}>
            {new Date(certificado.dataConclusao).toLocaleDateString('pt-BR')}
          </div>
          <button onClick={onBack} style={{ ...btnStyle, marginTop: 24 }}>
            Voltar aos cursos
          </button>
        </div>
      </div>
    );
  }

  if (!curso) {
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0,234,255,0.5)', fontFamily: SANS }}>
        Carregando curso...
      </div>
    );
  }

  const licao = curso.licoes[licaoIndex];
  const naUltimaPagina = paginaIndex === licao.paginas.length - 1;
  const proximaLicaoIndex = licaoIndex + 1 < curso.licoes.length ? licaoIndex + 1 : null;

  const atualizarProgresso = (progresso: number, cursoConcluido: boolean, licaoConcluida: boolean) => {
    setCurso((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        progresso,
        concluido: cursoConcluido,
        licoes: prev.licoes.map((l, i) => (i === licaoIndex ? { ...l, concluida: licaoConcluida || l.concluida } : l)),
      };
    });
  };

  const handleResponder = async () => {
    if (opcaoSelecionada === null) return;
    setEnviando(true);
    try {
      const r = await responderExercicio(slug, licaoIndex, opcaoSelecionada, token);
      setResposta(r);
      if (r.correta) atualizarProgresso(r.progresso, r.cursoConcluido, true);
    } finally {
      setEnviando(false);
    }
  };

  const handleConcluirSemExercicio = async () => {
    setEnviando(true);
    try {
      const r = await concluirLicao(slug, licaoIndex, token);
      atualizarProgresso(r.progresso, r.cursoConcluido, true);
    } finally {
      setEnviando(false);
    }
  };

  const handleGerarCertificado = async () => {
    const cert = await gerarCertificado(slug, token);
    setCertificado(cert);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', color: '#e8fdff', fontFamily: SANS, fontSize: 14 }}>
      {/* sidebar */}
      <div
        style={{
          width: 250,
          flexShrink: 0,
          borderRight: '1px solid rgba(0,234,255,0.25)',
          padding: '18px 14px',
          overflowY: 'auto',
        }}
      >
        <button onClick={onBack} style={{ ...btnStyle, fontSize: 11, marginBottom: 16, width: '100%' }}>
          ← Voltar aos cursos
        </button>
        <div style={{ color: '#ffd76a', fontSize: 15, fontWeight: 700, marginBottom: 3 }}>{curso.titulo}</div>
        <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 14 }}>{curso.progresso}% concluído</div>

        {curso.licoes.map((l, i) => (
          <div
            key={l.indice}
            onClick={() => irParaLicao(i)}
            style={{
              padding: '9px 12px',
              borderRadius: 12,
              marginBottom: 7,
              cursor: 'pointer',
              background: i === licaoIndex ? 'rgba(0,234,255,0.15)' : 'transparent',
              border: i === licaoIndex ? '1px solid #00eaff' : '1px solid transparent',
              display: 'flex',
              justifyContent: 'space-between',
              gap: 8,
              fontSize: 13,
              fontWeight: i === licaoIndex ? 600 : 400,
            }}
          >
            <span>{l.titulo}</span>
            <span style={{ color: l.concluida ? '#7dff9c' : 'rgba(255,255,255,0.3)' }}>{l.concluida ? '✔' : '○'}</span>
          </div>
        ))}

        {curso.concluido && (
          <button onClick={handleGerarCertificado} style={{ ...btnStyle, marginTop: 14, width: '100%', borderColor: '#ffd76a', color: '#ffd76a', background: 'rgba(255,215,106,0.12)' }}>
            Gerar certificado
          </button>
        )}
      </div>

      {/* conteúdo */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 44px', maxWidth: 720 }}>
        <div style={{ color: '#00eaff', fontSize: 19, fontWeight: 700, marginBottom: 5 }}>{licao.titulo}</div>
        <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 22 }}>
          página {paginaIndex + 1} de {licao.paginas.length}
        </div>

        <div style={{ lineHeight: 1.75, fontSize: 15, opacity: 0.92, marginBottom: 26, whiteSpace: 'pre-wrap' }}>{licao.paginas[paginaIndex]}</div>

        {!naUltimaPagina && (
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              disabled={paginaIndex === 0}
              onClick={() => setPaginaIndex((p) => p - 1)}
              style={paginaIndex === 0 ? disabledBtnStyle : btnStyle}
            >
              Anterior
            </button>
            <button onClick={() => setPaginaIndex((p) => p + 1)} style={btnStyle}>
              Próxima página
            </button>
          </div>
        )}

        {naUltimaPagina && (
          <div style={{ borderTop: '1px solid rgba(0,234,255,0.2)', paddingTop: 22 }}>
            {paginaIndex > 0 && (
              <button onClick={() => setPaginaIndex((p) => p - 1)} style={{ ...btnStyle, marginBottom: 18 }}>
                Anterior
              </button>
            )}

            {licao.temExercicio && !licao.concluida && (
              <div>
                <div style={{ color: '#ffd76a', fontWeight: 600, fontSize: 15, marginBottom: 12 }}>{licao.pergunta}</div>
                {licao.opcoes!.map((op, i) => (
                  <div
                    key={i}
                    onClick={() => setOpcaoSelecionada(i)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 12,
                      marginBottom: 7,
                      cursor: 'pointer',
                      border: opcaoSelecionada === i ? '1px solid #ffd76a' : '1px solid rgba(255,255,255,0.15)',
                      background: opcaoSelecionada === i ? 'rgba(255,215,106,0.1)' : 'transparent',
                      fontSize: 13,
                    }}
                  >
                    {op}
                  </div>
                ))}
                <button
                  disabled={opcaoSelecionada === null || enviando}
                  onClick={handleResponder}
                  style={{ ...(opcaoSelecionada === null || enviando ? disabledBtnStyle : btnStyle), marginTop: 10 }}
                >
                  Responder
                </button>

                {resposta && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ color: resposta.correta ? '#7dff9c' : '#ff4d6d', fontWeight: 600 }}>
                      {resposta.correta ? '✔ Certo!' : '✘ Não foi dessa vez.'}
                    </div>
                    <div style={{ opacity: 0.8, fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>{resposta.explicacao}</div>
                    {!resposta.correta && (
                      <button onClick={() => { setOpcaoSelecionada(null); setResposta(null); }} style={{ ...btnStyle, marginTop: 12 }}>
                        Tentar de novo
                      </button>
                    )}
                    {resposta.correta && proximaLicaoIndex !== null && (
                      <button onClick={() => irParaLicao(proximaLicaoIndex)} style={{ ...btnStyle, marginTop: 12 }}>
                        Próxima lição →
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {licao.temExercicio && licao.concluida && (
              <div>
                <div style={{ color: '#7dff9c', fontWeight: 600, marginBottom: 10 }}>✔ Lição concluída</div>
                {proximaLicaoIndex !== null && (
                  <button onClick={() => irParaLicao(proximaLicaoIndex)} style={btnStyle}>
                    Próxima lição →
                  </button>
                )}
              </div>
            )}

            {!licao.temExercicio && !licao.concluida && (
              <button disabled={enviando} onClick={handleConcluirSemExercicio} style={enviando ? disabledBtnStyle : btnStyle}>
                Marcar como concluída
              </button>
            )}

            {!licao.temExercicio && licao.concluida && (
              <div>
                <div style={{ color: '#7dff9c', fontWeight: 600, marginBottom: 10 }}>✔ Lição concluída</div>
                {proximaLicaoIndex !== null && (
                  <button onClick={() => irParaLicao(proximaLicaoIndex)} style={btnStyle}>
                    Próxima lição →
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailView;
