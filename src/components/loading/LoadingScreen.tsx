import React from "react";
import "../../styles/LoadingScreen.css";

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-wrapper">
      <div className="loading-neon-circle"></div>
      <div className="loading-text">Carregando PokerPremium...</div>
    </div>
  );
};

export default LoadingScreen;
