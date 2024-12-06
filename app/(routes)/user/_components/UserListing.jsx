import { supabase } from '@/utils/supabase/client'
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { list } from 'postcss';

function UserListing() {

    const {user} = useUser();
    const [listing, setListing]=useState();

    useEffect(()=>{
        user&&GetUserListing();
    } , [user])
    const GetUserListing=async()=>{
        const {data,eror} = await supabase
        .from('listing')
        .select(`*, listingImages(url, listing_id)`)
        .eq('createdBy', user?.primaryEmailAddress.emailAddress);

        console.log(data);
    }
  return (
    <div>
      <h2 className='font-bold text-2xl'>Manage your listing</h2>
      <div>
        {/* {listing&&listing.map((item, index)=>(

        ))} */}
      </div>
    </div>
  )
}

export default UserListing
