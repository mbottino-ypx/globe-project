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

  // Buscar las coordenadas de la localidad
  useEffect(() => {
    if (locationName) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${locationName}`)
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
        mapInstance.setView(mapCenter, 8); // Actualizar vista del mapa existente
      } else {
        // Crear nuevo mapa
        const map = L.map(mapRef.current).setView(mapCenter, 8);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        setMapInstance(map);
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
