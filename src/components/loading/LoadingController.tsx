import React, { useEffect, useState } from 'react';
import LoadingScreen from './LoadingScreen';

const LoadingController: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const skip = new URLSearchParams(window.location.search).get('debug') === '1';
    const timer = setTimeout(() => setLoading(false), skip ? 0 : 2500);
    return () => clearTimeout(timer);
  }, []);

  return loading ? <LoadingScreen /> : <>{children}</>;
};

export default LoadingController;
