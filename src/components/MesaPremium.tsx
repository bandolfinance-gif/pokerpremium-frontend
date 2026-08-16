// @ts-nocheck
import React from "react";
import Showdown from "./Showdown";
import "../styles/CameraShowdown.css";

const MesaPremium = ({ table }: { table: any }) => {
  return (
    <div className={table.phase === "showdown" ? "camera-showdown mesa-premium" : "mesa-premium"}>
      {table.phase === "showdown" && <Showdown vencedor={table.vencedor} />}
    </div>
  );
};

export default MesaPremium;

