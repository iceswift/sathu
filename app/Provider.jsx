"use client"

import React from 'react'
import { LoadScript } from '@react-google-maps/api'

function Provider({children}) {
  return (
    <div>
      <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
      libraries={['places']}
      >
        {children}
      </LoadScript>
    </div>
  )
}

export default Provider