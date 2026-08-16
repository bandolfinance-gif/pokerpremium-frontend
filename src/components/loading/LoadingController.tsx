import React, { useEffect, useState } from 'react';
import LoadingScreen from './LoadingScreen';

const LoadingController: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return loading ? <LoadingScreen /> : <>{children}</>;
};

export default LoadingController;
