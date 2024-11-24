// components/GlobeMapSwitcher.tsx
import React, { useState, useEffect, useRef } from "react";
import Globe from "react-globe.gl";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { GlobeMethods } from "react-globe.gl";

interface GlobeMapSwitcherProps {
  locationName: string;
}

const GlobeMapSwitcher: React.FC<GlobeMapSwitcherProps> = ({ locationName }) => {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const svgIcon = L.divIcon({
    html: `<svg class="absolute z-[1]" width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" > <g clip-path="url(#clip0_744_579)"> <path d="M0.5 12.2364V0.5H10.1665V15.6349L0.5 12.2364Z" fill="#383838" stroke="#383838" /> <path d="M31.5 11.936L21.8335 15.3345V0.5H31.5V11.936Z" fill="#383838" stroke="#383838" /> <path d="M20.8335 31.5008H11.1665V20.0571L20.8335 16.7411V31.5008Z" fill="#383838" stroke="#383838" /> </g> </svg>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    className: 'custom-icon'
  });

  const style = document.createElement('style');
  style.innerHTML = `
    .custom-icon .custom-svg {
      background: transparent;
      border: none;
    }
  `

  // Buscar las coordenadas de la localidad
  useEffect(() => {
    if (locationName) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            const { lat, lon } = data[0];
            setMapCenter([parseFloat(lat), parseFloat(lon)]);

            // Iniciar animación de transición
            setIsAnimating(true);
            setTimeout(() => {
              setShowMap(true);
              setIsAnimating(false);
            }, 1000);
          } else {
            alert("Localidad no encontrada");
          }
        })
        .catch((err) => {
          console.error(err.message);
          alert("Error: No se pudo encontrar la localidad");
        });
    }
  }, [locationName]);

  // Inicializar el mapa de Leaflet al mostrarlo
  useEffect(() => {
    if (showMap && mapCenter && mapRef.current) {
      if (mapInstance) {
        mapInstance.setView(mapCenter, 18); // Ajustar nivel de zoom para ver calles aledañas más de cerca

        L.marker(mapCenter, {icon: svgIcon}).addTo(mapInstance);
      } else {
        // Crear nuevo mapa
        const map = L.map(mapRef.current).setView(mapCenter, 18); // Ajustar nivel de zoom para ver calles aledañas más de cerca

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        setMapInstance(map);

        L.marker(mapCenter, {icon: svgIcon}).addTo(map);
      }
    }
  }, [showMap, mapCenter]);

  // Destruir el mapa al desmontar o cambiar a globo
  useEffect(() => {
    if (!showMap && mapInstance) {
      mapInstance.remove();
      setMapInstance(null);
    }
  }, [showMap]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* Globo */}
      <div
        style={{
          transition: "opacity 1s, transform 1s",
          opacity: !showMap && !isAnimating ? 1 : 0,
          transform: !showMap && !isAnimating ? "scale(1)" : "scale(1.2)", // Zoom in al cambiar al mapa
          position: "absolute",
          width: "100%",
          height: "100%",
          pointerEvents: showMap ? "none" : "auto",
        }}
      >
        <Globe
          ref={globeRef}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundColor="rgba(0,0,0,0)"
        />
      </div>

      {/* Mapa */}
      <div
        style={{
          transition: "opacity 1s, transform 1s",
          opacity: showMap && !isAnimating ? 1 : 0,
          transform: showMap && !isAnimating ? "scale(1)" : "scale(0.9)", // Zoom out al aparecer
          position: "absolute",
          width: "100%",
          height: "100%",
          pointerEvents: !showMap ? "none" : "auto",
        }}
      >
        {showMap && (
          <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />
        )}
      </div>

      {/* Botón para volver al globo */}
      {showMap && (
        <button
          onClick={() => setShowMap(false)}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 1000,
            padding: "10px",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Volver al Globo
        </button>
      )}
    </div>
  );
};

export default GlobeMapSwitcher;
