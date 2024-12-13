'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from "@/utils/supabase/client";
import Image from 'next/image';
import { CarFront, MapPin, Share} from 'lucide-react'; // รวมไว้ที่เดียว
import GoogleMapSection from '@/app/_components/GoogleMapSection';
import { Button } from '@/components/ui/button';

import { AiOutlineLayout } from 'react-icons/ai';
import { FaUsers } from 'react-icons/fa';
import { GiChurch } from 'react-icons/gi';
import { FaAccessibleIcon } from 'react-icons/fa';
import { FaFan } from 'react-icons/fa'; // พัดลม
import { TbAirConditioning } from "react-icons/tb"; // แอร์
import { MdWindow } from 'react-icons/md'; // หน้าต่าง




export default function Place({ params }) {
  const [temple, setTemple] = useState(null);
  const [templeImages, setTempleImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function getData() {
      const id = (await params).id;

      // ดึงข้อมูลวัด
      const { data: templeData, error: templeError } = await supabase
        .from("listing")
        .select()
        .eq('id', id);

      // ดึงภาพของวัด
      const { data: templeImgs, error: templeImgsError } = await supabase
        .from("listingImages")
        .select()
        .eq('listing_id', id);
      setTemple(templeData[0]);
      setTempleImages(templeImgs);
    }

    getData();
  }, []);

  // ฟังก์ชันเลื่อนภาพ
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % templeImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + templeImages.length) % templeImages.length);
  };

  return (
    temple && (
      <div className='px-4 md:px-32 lg:px-56 py-5'>
        <div className="mt-24 my-6 flex flex-col gap-8">


          {/* Carousel */}
          <div className="relative w-full max-w-4xl mx-auto mt-8">
            {templeImages.length > 0 ? (
              <>
                {templeImages[currentIndex]?.url && (
                  <Image
                    src={templeImages[currentIndex]?.url}
                    alt={`Image ${currentIndex}`}
                    width={800}
                    height={300}
                    className="rounded-xl object-cover h-[300px] w-full sm:h-[360px] md:h-[400px] max-w-3xl mx-auto"
                  />
                )}
                {currentIndex > 0 && templeImages.length > 1 && (
                  <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-100 hover:bg-black w-10 aspect-square rounded-full shadow-md text-gray-600 hover:text-white flex items-center justify-center transition-colors duration-300"
                  >
                    ❮
                  </button>
                )}
                {templeImages.length > 1 && (
                  <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-100 hover:bg-black w-10 aspect-square rounded-full shadow-md text-gray-600 hover:text-white flex items-center justify-center transition-colors duration-300"
                  >
                    ❯
                  </button>
                )}


              </>
            ) : (
              <div className="w-full h-[360px] bg-slate-200 animate-pulse rounded-lg"></div>
            )}
          </div>

          <div className="flex justify-between items-center">
            {/* ราคาและที่อยู่ */}
            <div>
              <h2 className="font-bold text-3xl flex items-center gap-2 mb-2">
                <span className="text-3xl text-lg font-semibold">฿</span> {/* เพิ่มสัญลักษณ์บาท */}
                {temple?.price}
              </h2>
              <h2 className="text-gray-500 text-lg flex gap-2">
                <MapPin />
                {temple?.address}
              </h2>
            </div>

            {/* ปุ่ม Share */}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: 'Check out this listing!',
                      text: `Take a look at this amazing listing: ${temple?.address}`,
                      url: window.location.href,
                    })
                    .catch((error) => console.error('Error sharing:', error));
                } else {
                  alert('Sharing is not supported in this browser.');
                }
              }}
              className="flex gap-2 items-center bg-black text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-800 transition-colors duration-300"
            >
              <Share className="h-5 w-5" />
              Share
            </button>
          </div>
          <hr />

{/* Key Features */}
<div>
  <h2 className="font-bold text-2xl mb-2">Key Features</h2>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    <h2 className="flex gap-2 items-center bg-gray-100 rounded-lg p-3 text-gray-700 justify-center">
      <AiOutlineLayout className="h-6 w-6 text-gray-500" />
      {temple?.roomsize || 'N/A'} Room Size
    </h2>
    <h2 className="flex gap-2 items-center bg-gray-100 rounded-lg p-3 text-gray-700 justify-center">
      <FaUsers className="h-6 w-6 text-gray-500" />
      {temple?.capacity || 'N/A'} Capacity
    </h2>
    <h2 className="flex gap-2 items-center bg-gray-100 rounded-lg p-3 text-gray-700 justify-center">
      <CarFront className="h-6 w-6 text-gray-500" />
      {temple?.parking || 'N/A'} Parking
    </h2>
{/* ประเภทห้อง */}
{/* ประเภทห้อง */}
<h2 className="flex gap-2 items-center bg-gray-100 rounded-lg p-3 text-gray-700 justify-center">
  {temple?.roomtypes === 'standard_room' && (
    <MdWindow className="h-6 w-6 text-gray-500" /> /* ไอคอนหน้าต่าง */
  )}
  {temple?.roomtypes === 'fan_room' && (
    <FaFan className="h-6 w-6 text-gray-500" /> /* ไอคอนพัดลม */
  )}
  {temple?.roomtypes === 'air_room' && (
    <TbAirConditioning className="h-6 w-6 text-gray-500" /> /* ไอคอนแอร์ */
  )}
  {temple?.roomtypes || 'N/A'}
</h2>


    <h2 className="flex gap-2 items-center bg-gray-100 rounded-lg p-3 text-gray-700 justify-center">
      <FaAccessibleIcon className="h-6 w-6 text-gray-500" />
      {temple?.toilet || 'N/A'} 
    </h2>
    <h2 className="flex gap-2 items-center bg-gray-100 rounded-lg p-3 text-gray-700 justify-center">
      <GiChurch className="h-6 w-6 text-gray-500" />
      {temple?.religions || 'N/A'} 
    </h2>
  </div>
</div>





          {/* คำอธิบาย */}
          <div>
            <h2 className="font-bold text-2xl mb-2">What&apos;s Special</h2>
            <p className="text-gray-600">{temple.description}</p>
          </div>

          <div className="mt-6">
            <h2 className="font-bold text-2xl mb-2">Find On Map</h2>
            <GoogleMapSection
              coordinates={temple.coordinates}
              listing={[temple]}
              listingImgs={templeImages}
            />
          </div>

          {/* Agent Detail Section */}
          <div className="mt-6">
            <h2 className="font-bold text-2xl mb-2">Agent Detail</h2>
            <div className="flex flex-col md:flex-row gap-5 items-center justify-between p-5 rounded-lg shadow-md border">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <Image
                  src={temple?.profileImage || '/placeholder-profile.png'}
                  alt="profileImage"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div className="text-center md:text-left">
                  <h2 className="text-lg font-bold">{temple?.fullName || 'Unknown Agent'}</h2>
                  <h2 className="text-gray-500">{temple?.createdBy || 'No email available'}</h2>
                </div>
              </div>
              <Button
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg w-full md:w-auto"
                onClick={() => alert(`Send a message to ${temple?.fullName}`)}
              >
                Send Message
              </Button>
            </div>
          </div>

        </div>

      </div>

    )
  );
}
