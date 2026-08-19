import React from 'react';

interface ErrorBoundaryState {
  error: Error | null;
}

// Rede de segurança: sem isso, um erro de render deixa a tela em branco
// sem nenhuma pista do que quebrou. Com isso, mostra o erro na tela.
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('PokerPremium crashed:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#05070a',
            color: '#ff4d6d',
            fontFamily: 'monospace',
            padding: 32,
            overflow: 'auto',
          }}
        >
          <h2 style={{ color: '#ffd76a' }}>Algo quebrou no PokerPremium</h2>
          <p>{this.state.error.message}</p>
          <pre style={{ whiteSpace: 'pre-wrap', opacity: 0.7, fontSize: 12 }}>
            {this.state.error.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 16,
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid #ff4d6d',
              background: 'rgba(255,77,109,0.15)',
              color: '#ff4d6d',
              fontFamily: 'monospace',
              cursor: 'pointer',
            }}
          >
            Recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
