import React from 'react';
import LoadingController from './components/loading/LoadingController';
import CockpitSystem from './systems/CockpitSystem';

const App: React.FC = () => {
  return (
    <LoadingController>
      <CockpitSystem />
    </LoadingController>
  );
};

export default App;
