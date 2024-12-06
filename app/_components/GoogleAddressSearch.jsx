"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { Search } from 'lucide-react';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';

const DynamicGooglePlacesAutocomplete = dynamic(() => import('react-google-places-autocomplete'), { ssr: false });

function GoogleAddressSearch({ selectedAddress, setCoordinates }) {
  if (!process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY) {
    console.error('Google API Key is missing');
    return <div>API Key is missing</div>;
  }

  return (
    <div>
      <DynamicGooglePlacesAutocomplete
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
        selectProps={{
          placeholder: (
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-500" />
              <span>Search Address</span>
            </div>
          ),
          isClearable: true,
          className: 'w-full',
          onChange: (place) => {
            console.log(place);
            selectedAddress(place); // อัปเดตค่าที่อยู่ที่เลือก
            if (place && place.label) {
              geocodeByAddress(place.label)
                .then((results) => getLatLng(results[0]))
                .then(({ lat, lng }) => {
                  setCoordinates({ lat, lng });
                  console.log('Latitude:', lat, 'Longitude:', lng);
                })
                .catch((error) => console.error('Error during geocoding:', error));
            } else {
              console.warn('No place selected or place is null');
            }
          },
        }}
      />
    </div>
  );
}

export default GoogleAddressSearch;
