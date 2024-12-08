'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from "@/utils/supabase/client";

export default function page({ params }) {
    const [temple, setTemple] = useState(null);
    const [templeImg, setTempleImg] = useState("");

    useEffect(() => {
        async function getData() {
            const id = (await params).id
            const { data: templeData, error: templeError } = await supabase.from("listing").select().eq('id', id);
            const { data: templeImg, error: templeImgError } = await supabase.from("listingImages").select().eq('listing_id', id);
            setTemple(templeData[0])
            setTempleImg(templeImg[0].url)
        }
        getData();
    }, [])

  return (
    <div className='mt-24'>
      <p>{temple?.name}</p>
      {templeImg && <img src={templeImg} alt={temple?.name} />}
    </div>
  )
}
