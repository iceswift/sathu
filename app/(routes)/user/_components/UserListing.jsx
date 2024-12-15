'use client'

//My listing
import { Button } from '@/components/ui/button';
import { supabase } from '@/utils/supabase/client';
import { MapPin, Ruler, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaDharmachakra } from "react-icons/fa";
import { FaUsers } from 'react-icons/fa';
import { FaAccessibleIcon } from 'react-icons/fa';
import { FaRegSquarePlus } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { FaSearch } from "react-icons/fa"; // นำเข้าไอคอนแว่นขยาย
import { GiChurch, GiMosque, GiKhanda, GiStarOfDavid } from 'react-icons/gi';

import { useUser } from '@clerk/nextjs';

function UserListing() {
  const [listing, setListing] = useState([]); // เก็บรายการโพสต์
  const [searchQuery, setSearchQuery] = useState(''); // เก็บข้อความค้นหา
  const { user } = useUser(); // ดึงข้อมูลผู้ใช้

  useEffect(() => {
    if (user) {
      fetchUserListings();
    }
  }, [user]);

  const fetchUserListings = async () => {
    const { data, error } = await supabase
      .from('listing')
      .select('*,listingImages(listing_id,url)')
      .eq('createdBy', user?.primaryEmailAddress?.emailAddress); // ตรวจสอบ createdBy

    if (error) {
      console.error('Error fetching listings:', error);
      return;
    }

    setListing(data); // เก็บข้อมูลที่กรองแล้วใน state
    console.log('Fetched listings:', data);
  };

  const filteredListings = listing.filter((item) =>
    item?.name?.toLowerCase().includes(searchQuery.toLowerCase()) // กรองรายการตามชื่อ
  );
  

  const handleDelete = async (id) => {
    // Delete related rows in the listingImages table
    const { error: imageError } = await supabase
      .from('listingImages')
      .delete()
      .eq('listing_id', id);
  
    if (imageError) {
      console.error('Error deleting related images:', imageError);
      return;
    }
  
    // Delete the row in the listing table
    const { error: listingError } = await supabase
      .from('listing')
      .delete()
      .eq('id', id);
  
    if (listingError) {
      console.error('Error deleting listing:', listingError);
      return;
    }
  
    // Remove the deleted listing from state
    setListing((prevListings) => prevListings.filter((item) => item.id !== id));
  };
  
  
  

  return (
    <div>
<div className="flex justify-between items-center mb-4">
    <h2 className="font-bold text-2xl">Manage your listing</h2>
    <Link href="/add-new-listing" className="text-black-500 text-3xl">
        <FaRegSquarePlus />
    </Link>
</div>

{/* ช่องค้นหา */}
<div className="relative mb-4">
  <input
    type="text"
    placeholder="Search by name..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full p-2 border rounded-md pr-10" // เพิ่ม padding ด้านขวา
  />
  {/* ไอคอนแว่นขยาย */}
  <FaSearch className="absolute right-3 top-2/4 transform -translate-y-1/2 text-gray-500" />
</div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {listing &&
          filteredListings.map((item, index) => (
            <div
              key={index}
              className="relative bg-white rounded-lg shadow-md p-3 hover:border hover:border-primary transition-shadow hover:shadow-lg hover:-translate-y-1 transform duration-200"
            >
              <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-lg text-sm shadow-md flex items-center gap-2">
                {item.active ? (
                  <>
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    Published
                  </>
                ) : (
                  <>
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    Draft
                  </>
                )}
              </div>
              <Image
                src={item?.listingImages[0]?.url || '/placeholder.svg'}
                width={800}
                height={150}
                alt={item?.name || "Default Alt Text"}
                className="rounded-lg object-cover h-[170px] w-full"
              />
              <div className="mt-4">
                <h2 className="font-bold text-xl">{item?.name || 'No Name'}</h2>
                <p className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <MapPin className="h-4 w-4" /> {item.address || 'No Address'}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {item.description ? item.description.slice(0, 90) + '...' : 'No Description'}
                </p>
                <div>
                <div className="flex gap-2 mt-2">
                  <div className="flex items-center gap-2 bg-slate-200 rounded-md p-2 w-full text-gray-500 justify-center">
                    {item?.religions === 'buddhism' && (
                      <FaDharmachakra className="h-6 w-6 text-gray-500" /> /* ไอคอนพระธรรมจักร */
                    )}
                    {item?.religions === 'Christianity' && (
                      <GiChurch className="h-6 w-6 text-gray-500" /> /* ไอคอนโบสถ์ */
                    )}
                    {item?.religions === 'Islam' && (
                      <GiMosque className="h-6 w-6 text-gray-500" /> /* ไอคอนมัสยิด */
                    )}
                    {item?.religions === 'Sikhism' && (
                      <GiKhanda className="h-6 w-6 text-gray-500" /> /* ไอคอนศาสนาซิกข์ */
                    )}
                    {item?.religions === 'Judaism' && (
                      <GiStarOfDavid className="h-6 w-6 text-gray-500" /> /* ไอคอนดาวแห่งเดวิด */
                    )}
                  </div>
                  <div className="flex items-center gap-2 bg-slate-200 rounded-md p-2 w-full text-gray-500 justify-center">
                    <FaUsers className="h-6 w-6 text-gray-500" />
                    {item?.capacity || 'N/A'}
                  </div>
                  <div className="flex items-center gap-2 bg-slate-200 rounded-md p-2 w-full text-gray-500 justify-center">
                    {item?.toilet === 'yes_pwd' ? (
                      <FaAccessibleIcon className="h-6 w-6 text-gray-500" />
                    ) : (
                      'N/A'
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
              <Link href={'/place/' + item.id}>
              <Button size="sm" variant="outline" className="w-full flex justify-center items-center">
                <FaRegEye className="h-6 w-6"/>
              </Button>
            </Link>
                            <Link href={'/edit-listing/' + item.id}>
              <Button size="sm" className="w-full flex justify-center items-center">
                <FaRegEdit/>
              </Button>
            </Link>
            <Button
  size="sm"
  variant="destructive"
  className="w-full flex justify-center items-center"
  onClick={() => handleDelete(item.id)} // ส่ง item.id เพื่อใช้ลบ
>
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
