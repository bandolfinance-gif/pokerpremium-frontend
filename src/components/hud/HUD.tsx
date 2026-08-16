
import React, { useEffect, useState } from "react";
import { dataService } from "../../services/DataService";
import { audioService } from "../../sons/AudioService";
import sons from "../../sons/sons.json";

export default function HUD() {
  const [log, setLog] = useState("");

  useEffect(() => {
    dataService.subscribe((data: any) => {
      setLog(data.log);
      audioService.play(sons.hud);
    });
  }, []);

  return (
    <div className="hud painel pulse neon-anim scanline holograma-3d">
      <h3>HUD</h3>
      <p>{log}</p>
    </div>
  );
}



