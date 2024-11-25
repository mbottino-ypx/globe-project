// components/GlobeMapSwitcher.tsx
import React, { useEffect, useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import "tailwindcss/tailwind.css";

interface GlobeMapSwitcherProps {
  locationName: string;
}

const GlobeMapSwitcher: React.FC<GlobeMapSwitcherProps> = ({ locationName }) => {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [showMarker, setShowMarker] = useState(false);

  // Función para buscar las coordenadas del país o ciudad
  useEffect(() => {
    const fetchLocation = async (query: string) => {
      try {
        const countryResponse = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`);
        if (!countryResponse.ok) throw new Error("País no encontrado");
        const [countryData] = await countryResponse.json();
        const { latlng } = countryData;

        // Girar el globo para centrar la ubicación
        if (globeRef.current) {
          globeRef.current.pointOfView({ lat: latlng[0], lng: latlng[1], altitude: 0.8 }, 2000);
          setShowMarker(true);  // Mostrar el marcador después de centrar la ubicación
        }
      } catch (err) {
        // console.error(err.message);
        alert("Error: No se pudo encontrar la localidad o país");
      }
    };

    if (locationName) {
      fetchLocation(locationName);
    }
  }, [locationName]);

  return (
    <div className="relative w-full h-screen">
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={false}
        enablePointerInteraction={false}
      />

      {showMarker && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg
            className="z-10"
            width="24"
            height="24"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_744_579)">
              <path
                d="M0.5 12.2364V0.5H10.1665V15.6349L0.5 12.2364Z"
                fill="#ffffff"
                stroke="#ffffff"
              />
              <path
                d="M31.5 11.936L21.8335 15.3345V0.5H31.5V11.936Z"
                fill="#ffffff"
                stroke="#ffffff"
              />
              <path
                d="M20.8335 31.5008H11.1665V20.0571L20.8335 16.7411V31.5008Z"
                fill="#ffffff"
                stroke="#ffffff"
              />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
};

export default GlobeMapSwitcher;
