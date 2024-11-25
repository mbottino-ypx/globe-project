// pages/location.tsx
import dynamic from "next/dynamic";
import React, { useState } from "react";

const GlobeMapSwitcher = dynamic(() => import("../components/globe-locations"), {
  ssr: false, // Deshabilita la renderización en el servidor
});

const LocationPage: React.FC = () => {
  const [location, setLocation] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const handleSearch = () => {
    setSearchLocation(location);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="">
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
          placeholder="Search a country or location"
          value={location}
          onChange={handleLocationChange}
          onKeyPress={handleKeyPress}
          style={{
            padding: "5px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            outline: "none",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "5px 10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#fff",
            cursor: "pointer",
          }}
        >
          Buscar
        </button>
      </div>

      {/* Componente combinado */}
      <GlobeMapSwitcher locationName={searchLocation} />
    </div>
  );
};

export default LocationPage;
