// pages/index.tsx
import dynamic from "next/dynamic";
import React, { useState } from "react";

const GlobeMapSwitcher = dynamic(() => import("./components/globe"), {
  ssr: false, // Deshabilita la renderización en el servidor
});

const App = () => {
  const [location, setLocation] = useState("");

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  return (
    <div>
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "10px",
          borderRadius: "5px",
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Buscar una localidad"
          value={location}
          onChange={handleLocationChange}
          style={{
            padding: "5px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            outline: "none",
          }}
        />
      </div>

      {/* Componente combinado */}
      <GlobeMapSwitcher locationName={location} />
    </div>
  );
};

export default App;
