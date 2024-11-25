// pages/location.tsx
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { locations } from "../utils/mock/location";

const GlobeMapSwitcher = dynamic(() => import("../components/globe-locations"), {
  ssr: false, // Deshabilita la renderización en el servidor
});

const LocationPage: React.FC = () => {
  const [searchLocation, setSearchLocation] = useState("");

  const handleSearch = (location: string) => {
    setSearchLocation(location);
  };

  return (
    <div className="relative h-screen">
      <div
        style={{
          position: "absolute",
          top: "10px",
          // left: "50%",
          // transform: "translateX(-50%)",
          zIndex: 1000,
          backgroundColor: "rgb(186 186 186 / 90%)",
          padding: "10px",
          borderRadius: "5px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginLeft: '1%'

//           position: absolute;
//     top: 10px;
//     /* left: 50%; */
//     /* transform: translateX(-50%); */
//     z-index: 1000;
//     background-color: rgb(88 87 87 / 90%);
//     padding: 10px;
//     border-radius: 5px;
//     display: flex
// ;
//     flex-direction: column;
//     gap: 10px;
//     margin-left: 1%;
        }}
      >
        {locations.map((location) => (
          <button
            key={location.id}
            className="block w-full text-left p-2 bg-white rounded mb-2 hover:bg-gray-200"
            onClick={() => handleSearch(location.name)}
          >
            {location.name}
          </button>
        ))}
      </div>

      {/* Componente combinado */}
      <GlobeMapSwitcher locationName={searchLocation} />
    </div>
  );
};

export default LocationPage;
