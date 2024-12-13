import { Button } from '@/components/ui/button';
import { supabase } from '@/utils/supabase/client';
import { MapPin, Bath, BedDouble, Ruler, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

function UserListing() {
  const [listing, setListing] = useState([]);

  useEffect(() => {
    GetUserListing();
  }, []);

  const GetUserListing = async () => {
    const { data, error } = await supabase
      .from('listing')
      .select(`*, listingImages(url, listing_id)`);
    if (error) {
      console.error('Error fetching listing:', error);
      return;
    }
    setListing(data);
    console.log(data);
  };

  return (
    <div>
      <h2 className="font-bold text-2xl">Manage your listing</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {listing &&
          listing.map((item, index) => (
            <div
              key={index}
              className="p-3 hover:border hover:border-primary rounded-lg cursor-pointer relative"
            >
              <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-lg text-sm shadow-md">
                {item.active ? 'Published' : 'Draft'}
              </div>
              <Image
                src={
                  item?.listingImages[0]
                    ? item?.listingImages[0]?.url
                    : '/placeholder.svg'
                }
                width={800}
                height={150}
                alt={item?.name || "Default Alt Text"}
                className="rounded-lg object-cover h-[170px] w-full"
              />
              <div className="flex mt-2 flex-col gap-2">
                <h2 className="font-bold text-xl">{item?.name || 'No Name'}</h2>
                <h2 className="flex gap-2 text-sm text-gray-400 ">
                  <MapPin className="h-4 w-4" />
                  {item.address}
                </h2>
                <p className="text-gray-500 text-sm">
                  {item.description.slice(0, 90)}...
                </p>
                <div className="flex gap-2 mt-2 justify-between">
                  <h2 className="flex gap-2 text-sm bg-slate-200 
                  rounded-md p-2 w-full text-gray-500 justify-center items-center">
                    <BedDouble className="h-4 w-4" />
                    {item?.bedroom || 'N/A'}
                  </h2>
                  <h2 className="flex gap-2 text-sm bg-slate-200 
                  rounded-md p-2 w-full text-gray-500 justify-center items-center">
                    <Bath className="h-4 w-4" />
                    {item?.bathroom || 'N/A'}
                  </h2>
                  <h2 className="flex gap-2 w-full text-sm bg-slate-200 
                  rounded-md p-2 text-gray-500 justify-center items-center">
                    <Ruler className="h-4 w-4" />
                    {item?.area || 'N/A'}
                  </h2>
                </div>
                <div className="flex gap-2 justify-between">
                  <Link href={'/place/' + item.id} className="w-full">
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </Link>
                  <Link href={'/edit-listing/' + item.id} className="w-full">
                    <Button size="sm" className="w-full">
                      Edit
                    </Button>
                  </Link>
                  <Button size="sm" variant="destructive" className="w-full">
                    <Trash />
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default UserListing;