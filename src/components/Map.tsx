import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Town } from '../data/towns';
import { useEffect } from 'react';
import L from 'leaflet';

interface MapProps {
  towns: Town[];
  currentYear: number;
  selectedTown: Town | null;
}

function MapUpdater({ towns, selectedTown }: { towns: Town[], selectedTown: Town | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedTown) {
      map.flyTo([selectedTown.lat, selectedTown.lng], 12, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    } else if (towns.length > 0) {
      const bounds = L.latLngBounds(towns.map(t => [t.lat, t.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
    }
  }, [towns, map, selectedTown]);

  return null;
}

export default function Map({ towns, currentYear, selectedTown }: MapProps) {
  const filteredTowns = towns.filter(t => t.year <= currentYear);

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-black/5 shadow-inner bg-gray-100">
      <MapContainer
        center={[40.0583, -74.4057]}
        zoom={8}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {filteredTowns.map((town, idx) => {
          const isNew = town.year === currentYear;
          const isSelected = selectedTown?.municipality === town.municipality;
          
          return (
            <CircleMarker
              key={`${town.municipality}-${idx}`}
              center={[town.lat, town.lng]}
              radius={isSelected ? 10 : isNew ? 8 : 6}
              pathOptions={{
                fillColor: isSelected ? '#ef4444' : isNew ? '#f59e0b' : '#2563eb',
                color: '#ffffff',
                weight: isSelected ? 3 : 2,
                fillOpacity: 0.8,
                className: isNew ? 'pulse-marker' : ''
              }}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-lg">{town.municipality}</h3>
                  <p className="text-sm text-gray-600 capitalize">{town.type} in {town.county} County</p>
                  <p className="text-sm font-medium mt-1">Established: {town.year}</p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
        
        <MapUpdater towns={filteredTowns} selectedTown={selectedTown} />
      </MapContainer>
      
      <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-black/5">
        <div className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">Current View</div>
        <div className="text-2xl font-bold text-blue-600">{currentYear}</div>
        <div className="text-sm text-gray-600">{filteredTowns.length} Municipalities</div>
      </div>
    </div>
  );
}
