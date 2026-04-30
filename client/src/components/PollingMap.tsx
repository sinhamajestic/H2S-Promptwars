import React, { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface PollingMapProps {
  address: string;
}

export const PollingMap: React.FC<PollingMapProps> = ({ address }) => {
  const [hasConsent, setHasConsent] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasConsent) return;

    const loadMap = async () => {
      try {
        // Fetch API key securely from backend
        const res = await fetch('http://localhost:3001/api/places/config');
        if (!res.ok) throw new Error('Failed to fetch Maps config');
        const { apiKey } = await res.json();

        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places', 'geocoding']
        });

        const { Map } = await loader.importLibrary('maps');
        const { Geocoder } = await loader.importLibrary('geocoding');

        const geocoder = new Geocoder();
        
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results && results[0] && mapRef.current) {
            const location = results[0].geometry.location;
            const map = new Map(mapRef.current, {
              center: location,
              zoom: 15,
            });

            loader.importLibrary('marker').then(({ Marker }) => {
              new Marker({
                map,
                position: location,
                title: address
              });
            });
          } else {
            setMapError('Could not find location for this address.');
          }
        });

      } catch (err: unknown) {
        console.error(err);
        setMapError('Failed to load Google Maps.');
      }
    };

    loadMap();
  }, [hasConsent, address]);

  if (!hasConsent) {
    return (
      <div className="w-full h-64 bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center p-6 text-center">
        <h3 className="font-bold text-slate-800 mb-2">Polling Location Map</h3>
        <p className="text-slate-600 text-sm mb-4 max-w-md">
          To display the interactive map, Google Maps needs to load. By clicking below, you consent to Google's Terms of Service and Privacy Policy. No data is sent to Google until you click.
        </p>
        <button 
          onClick={() => setHasConsent(true)}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Load Map
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-xl border border-slate-200 overflow-hidden relative">
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-red-600 p-4 text-center z-10">
          {mapError}
        </div>
      )}
      <div ref={mapRef} className="w-full h-full bg-slate-200 animate-pulse" aria-label="Google Map Loading" />
    </div>
  );
};
