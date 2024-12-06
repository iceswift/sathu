"use client"

import GoogleAddressSearch from '@/app/_components/GoogleAddressSearch';
import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { supabase } from '@/utils/supabase/client';
import { useUser } from '@clerk/nextjs';
import { toast } from "react-hot-toast";
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';


function AddNewListing() {
    const [selectedAddress, setSelectedAddress] = useState();
    const [coordinates, setCoordinates] = useState();
    const {user} = useUser();
    const [loader, setLoader] = useState(false);
    const [loading, setLoading] = useState(false);
    const router=useRouter();

    const nextHandler=async()=>{
        console.log(selectedAddress, coordinates);
            setLoader(true)

            const { data, error } = await supabase
            .from('listing')
            .insert([
            { address: selectedAddress.label, coordinates: coordinates, createdBy: user?.primaryEmailAddress.emailAddress},
            ])
            .select()
            if (data) {
                setLoader(false)
                console.log("New Data added", data);
                toast("New Address added for listing");
                router.replace('/edit-listing/'+data[0].id);
              }
              
              if (error) {
                toast('Server Side Error');
              }
        
    }
  return (
    <div className='mt-10 md:mx-56 lg:mx-80'>
    <div className="p-10 flex flex-col gap-5 items-center justify-center">
      
      <Image
        src="/pin_icon.png"
        alt="Add Icon"
        width={96} // ขนาดใหญ่ขึ้น
        height={96}
      />
      
      <h2 className="font-bold text-2xl">Add New Listing</h2>
      <div className='flex flex-col'>
        <h2 className="text-gray-500  mb-4">Enter Address which you want to list</h2>
            <GoogleAddressSearch 
                selectedAddress={(value) => setSelectedAddress(value)}
                setCoordinates={(value) => setCoordinates(value)} 
            />
        <Button 
            disabled={!selectedAddress|| !coordinates || !coordinates || loader} 
            onClick={nextHandler} className="mt-4">{loader?<Loader className='animate-spin'/>:'Next'}</Button>
            
      </div>
    </div>
    </div>
  );
}

export default AddNewListing;
