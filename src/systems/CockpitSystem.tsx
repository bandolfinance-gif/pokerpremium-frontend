// @ts-nocheck
import React, { useState } from "react";

export interface ICockpitData {
  energia: number;
  alerta: boolean;
  radar: any;
  iaStatus: string;
  fluxo: number;
  setIaStatus: (s: string) => void;
  setAlerta: (b: boolean) => void;
}

export const CockpitContext = React.createContext<ICockpitData>({
  energia: 100,
  alerta: false,
  radar: {},
  iaStatus: "idle",
  fluxo: 0,
  setIaStatus: () => {},
  setAlerta: () => {}
});

export function CockpitProvider({ children }) {
  const [energia] = useState(100);
  const [alerta, setAlerta] = useState(false);
  const [iaStatus, setIaStatus] = useState("idle");
  const [fluxo] = useState(0);
  const [radar] = useState({});

  return (
    <CockpitContext.Provider
      value={{
        energia,
        alerta,
        radar,
        iaStatus,
        fluxo,
        setIaStatus,
        setAlerta
      }}
    >
      {children}
    </CockpitContext.Provider>
  );
}

