import React, { useEffect, useMemo, useState } from 'react';
import { CursoResumo, fetchCursos } from '../../services/cursosApi';
import CourseDetailView from './CourseDetailView';
import { ELEGANT_FONT as SANS } from '../../styles/elegantTheme';

interface CoursesViewProps {
  userName: string;
  token: string;
}

const panelStyle: React.CSSProperties = {
  background: 'linear-gradient(160deg, rgba(0,20,30,0.6), rgba(0,0,0,0.55))',
  border: '1px solid rgba(0,234,255,0.3)',
  borderRadius: 16,
  padding: '18px 20px',
  boxShadow: '0 0 14px rgba(0,234,255,0.12)',
  cursor: 'pointer',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
};

const NIVEL_LABEL: Record<string, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
};

const NIVEL_COLOR: Record<string, string> = {
  iniciante: '#7dff9c',
  intermediario: '#ffd76a',
  avancado: '#ff6fae',
};

const CoursesView: React.FC<CoursesViewProps> = ({ userName, token }) => {
  const [cursos, setCursos] = useState<CursoResumo[]>([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');
  const [cursoSelecionado, setCursoSelecionado] = useState<string | null>(null);

  const carregarCursos = () => {
    fetchCursos(token).then(setCursos).catch(() => {});
  };

  useEffect(() => {
    carregarCursos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const categorias = useMemo(() => ['todas', ...Array.from(new Set(cursos.map((c) => c.categoria)))], [cursos]);
  const cursosFiltrados = categoriaFiltro === 'todas' ? cursos : cursos.filter((c) => c.categoria === categoriaFiltro);

  if (cursoSelecionado) {
    return (
      <CourseDetailView
        slug={cursoSelecionado}
        token={token}
        userName={userName}
        onBack={() => {
          setCursoSelecionado(null);
          carregarCursos();
        }}
      />
    );
  }

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
      <div style={{ fontSize: 12, opacity: 0.55, textAlign: 'center', marginBottom: 18 }}>
        Progresso é por conta, salvo de verdade — cada lição concluída (com exercício acertado, quando houver) fica
        registrada. Certificado libera só quando o curso inteiro é concluído.
      </div>

      <div
        style={{
          display: 'flex',
          gap: 6,
          justifyContent: 'center',
          marginBottom: 28,
          flexWrap: 'wrap',
          padding: 6,
          maxWidth: 'fit-content',
          margin: '0 auto 28px',
          borderRadius: 26,
          border: '1px solid rgba(0,234,255,0.2)',
          background: 'rgba(0,0,0,0.35)',
        }}
      >
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaFiltro(cat)}
            style={{
              padding: '7px 18px',
              borderRadius: 20,
              border: 'none',
              background: categoriaFiltro === cat
                ? 'linear-gradient(135deg, rgba(255,215,106,0.9), rgba(255,111,174,0.75))'
                : 'transparent',
              color: categoriaFiltro === cat ? '#1a1206' : 'rgba(232,253,255,0.65)',
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 12.5,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {cat === 'todas' ? 'Todas' : cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18, maxWidth: 1280, margin: '0 auto' }}>
        {cursosFiltrados.map((curso) => (
          <div key={curso.id} style={panelStyle} onClick={() => setCursoSelecionado(curso.id)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div style={{ color: '#f2fbff', fontWeight: 700, fontSize: 15 }}>{curso.titulo}</div>
              <span style={{ fontSize: 11, fontWeight: 600, color: NIVEL_COLOR[curso.nivel], flexShrink: 0, marginLeft: 8 }}>
                {NIVEL_LABEL[curso.nivel]}
              </span>
            </div>
            <div style={{ opacity: 0.55, fontSize: 11, marginBottom: 8 }}>{curso.categoria} · {curso.totalLicoes} lições</div>
            <div style={{ opacity: 0.8, fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>{curso.descricao}</div>

            <div style={{ background: 'rgba(0,234,255,0.1)', borderRadius: 8, height: 8, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${curso.progresso}%`,
                  height: '100%',
                  background: curso.progresso >= 100 ? '#ffd76a' : '#00eaff',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>{curso.progresso}% concluído</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesView;
