import { MarkerF, OverlayView } from '@react-google-maps/api'
import React, { useState } from 'react'
import MarkerListingItem from './MarkerListingItem';

function MarkerItem({item, itemImg}) {
    const [selectedListing,setSelectedListing]=useState();
  return (
    <div>
        <MarkerF
            position={item.coordinates}
            onClick={()=>setSelectedListing(item)}
            icon={{
                url:'/pin.png',
                scaledSize:{
                    width:60,
                    height:60
                }
            }}
        >
          {selectedListing&&  <OverlayView
            position={selectedListing.coordinates}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
                <div>
                    <MarkerListingItem 
                    closeHandler={()=>setSelectedListing(null)}
                    temple={selectedListing} 
                    templeImg={itemImg}
                    />
                </div>

            </OverlayView>}

        </MarkerF>
    </div>
  )
}

export default MarkerItem