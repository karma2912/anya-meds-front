'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Star, MapPin, Phone, Clock } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Define the props for our component
interface Doctor {
  id: number;
  name: string;
  specialty: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  rating?: number;
  availability?: string;
}

interface MapProps {
  doctors: Doctor[];
  center: [number, number];
  zoom: number;
  selectedDoctor: Doctor | null;
}

// Create custom icons
const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const selectedIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// A helper component to update the map view when props change
const ChangeView = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const DoctorMap = ({ doctors, center, zoom, selectedDoctor }: MapProps) => {
  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      scrollWheelZoom={true} 
      style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
      className="focus:outline-none"
    >
      <ChangeView center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {doctors.map(doctor => (
        <Marker 
          key={doctor.id} 
          position={[doctor.lat, doctor.lng]} 
          icon={selectedDoctor?.id === doctor.id ? selectedIcon : defaultIcon}
        >
          <Popup className="rounded-md">
            <div className="font-sans min-w-[200px]">
              <h3 className="font-bold text-md text-blue-700">{doctor.name}</h3>
              <p className="text-sm font-semibold text-gray-600">{doctor.specialty}</p>
              {doctor.rating && (
                <div className="flex items-center mt-1 text-sm">
                  <span className="flex items-center bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {doctor.rating}
                  </span>
                </div>
              )}
              <p className="text-xs mt-2 text-gray-500 flex items-start">
                <MapPin className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                <span>{doctor.address}</span>
              </p>
              <p className="text-xs mt-1 text-gray-500 flex items-center">
                <Phone className="w-3 h-3 mr-1" />
                <span>{doctor.phone}</span>
              </p>
              {doctor.availability && (
                <p className="text-xs mt-1 text-green-600 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{doctor.availability}</span>
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default DoctorMap;