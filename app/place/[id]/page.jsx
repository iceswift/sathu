'use client';

//หน้าแสดงข้อมูลสถานที่
import React, { useEffect, useState } from 'react';
import { supabase } from "@/utils/supabase/client";
import Image from 'next/image';
import { CarFront, MapPin, Share } from 'lucide-react'; // รวมไว้ที่เดียว
import GoogleMapSection from '@/app/_components/GoogleMapSection';
import { Button } from '@/components/ui/button';
import CalendarComponent from '@/app/_components/CalendarComponent';
import { FaLine, FaFacebookMessenger, FaFacebook, FaPhone } from 'react-icons/fa';

import { AiOutlineLayout } from 'react-icons/ai';
import { FaUsers } from 'react-icons/fa';
import { GiChurch } from 'react-icons/gi';
import { FaAccessibleIcon, FaFacebookSquare } from 'react-icons/fa';
import { FaFan } from 'react-icons/fa'; // พัดลม
import { TbAirConditioning } from "react-icons/tb"; // แอร์
import { MdWindow } from 'react-icons/md'; // หน้าต่าง
import { RiShareBoxLine } from "react-icons/ri";
import { IoArrowUp } from "react-icons/io5";

import { useUser } from '@clerk/nextjs';

export default function Place({ params }) {

  const [temple, setTemple] = useState(null);
  const [templeImages, setTempleImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [contactLinks, setContactLinks] = useState(null);
  const [id, setID] = useState(null);
  const { user } = useUser();
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    async function setParams() {
      const id = (await params).id;
      setID(id);
    }
    setParams();
    if (user) {
        verifyUserRecord();
    }
  }, [user]);
  const verifyUserRecord = async () => {
    const { data, error } = await supabase
        .from('listing')
        .select('*,listingImages(listing_id,url)')
        .eq('createdBy', user?.primaryEmailAddress.emailAddress)
        .eq('id', id);

    if (data) {
        console.log(data);
        setListing(data[0]);
    }

    if (data?.length <= 0) {
        router.replace('/');
    }
};

  // ตรวจจับการเลื่อนหน้าจอ
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ฟังก์ชันเลื่อนกลับขึ้นด้านบน
  const scrollToTop = () => {
    const scrollStep = -window.scrollY / 20; // เลื่อนขึ้นทีละ 1/20 ของระยะทาง
    const scrollInterval = setInterval(() => {
      if (window.scrollY > 0) {
        window.scrollBy(0, scrollStep); // เลื่อนทีละน้อย
      } else {
        clearInterval(scrollInterval); // หยุดเมื่อถึงด้านบน
      }
    }, 16); // 16ms ต่อ frame (ประมาณ 60fps)
  };
  

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
      <>
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
                <span className="text-3xl text-3lg font-semibold">฿</span> {/* เพิ่มสัญลักษณ์บาท */}
                {temple?.price}
              </h2>
              <h2 className="text-gray-500 text-lg flex items-center gap-2">
  <MapPin />
  <a
    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      temple?.address
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-1 hover:underline text-black-500"
  >
    {/* ข้อความที่อยู่ */}
    <span
      className="block sm:whitespace-normal sm:break-words max-w-[200px] sm:max-w-none truncate"
      title={temple?.address} // เพิ่ม tooltip เพื่อแสดงที่อยู่เต็มเมื่อวางเมาส์
    >
      {temple?.address}
    </span>
    {/* ไอคอน */}
    <RiShareBoxLine />
  </a>
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
  <span className="hidden sm:inline">Share</span>
</button>

          </div>
          <hr />

          {/* Key Features */}
          <div>
            <h2 className="font-bold text-2xl mb-2">Key Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <h2 className="flex gap-2 items-center bg-gray-100 rounded-lg p-3 text-gray-700 justify-center">
                <AiOutlineLayout className="h-6 w-6 text-gray-500" />
                {temple?.roomsize || 'N/A'} Sq.m
              </h2>
              <h2 className="flex gap-2 items-center bg-gray-100 rounded-lg p-3 text-gray-700 justify-center">
                <FaUsers className="h-6 w-6 text-gray-500" />
                {temple?.capacity || 'N/A'} People
              </h2>
              <h2 className="flex gap-2 items-center bg-gray-100 rounded-lg p-3 text-gray-700 justify-center">
                <CarFront className="h-6 w-6 text-gray-500" />
                {temple?.parking || 'N/A'} Parking
              </h2>
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
          <div className="flex flex-wrap lg:flex-nowrap gap-4">
  {/* Left Section */}
  <div className="flex-1">
    <h2 className="font-bold text-2xl sm:text-2xl mb-2">What&apos;s Special</h2>
    <p className="text-gray-600">{temple.description}</p>
  </div>

  {/* Calendar Section */}
  <div className="w-full lg:w-1/3">
  <div className="max-w-sm mx-auto border border-black rounded-lg p-4 flex justify-center">
    <CalendarComponent userEmail={user?.primaryEmailAddress?.emailAddress} listing_id={id} />
  </div>
</div>

</div>
          <div className="mt-6">
            <h2 className="font-bold text-2xl mb-4 text-center md:text-left">Find On Map</h2>
            <GoogleMapSection
              coordinates={temple.coordinates}
              listing={[temple]}
              listingImgs={templeImages}
            />
          </div>

          {/* Agent Detail Section */}
<div className="mt-6">
  <h2 className="font-bold text-2xl mb-4 text-center md:text-left">Contact</h2>
  <div className="flex flex-col lg:flex-row gap-6 items-center justify-between p-6 rounded-lg shadow-md border">
    {/* Agent Profile Section */}
    <div className="flex flex-col lg:flex-row items-center gap-6">
      <Image
        src={temple?.profileImage || '/placeholder-profile.png'}
        alt="profileImage"
        width={80}
        height={80}
        className="rounded-full object-cover w-20 h-20 sm:w-24 sm:h-24"
      />
      <div className="text-center lg:text-left">
        <h2 className="text-lg font-bold">{temple?.fullName || 'Unknown Agent'}</h2>
        <h2 className="text-gray-500 text-sm sm:text-base">{temple?.createdBy || 'No email available'}</h2>
      </div>
    </div>

    {/* Contact Details Section */}
    <div className="flex flex-col gap-4 text-sm sm:text-base lg:text-lg w-full lg:w-auto">
      {/* Line */}
      <div className="flex items-center gap-3">
        <FaLine className="text-black-500 h-5 w-5 sm:h-6 sm:w-6" />
        <span>{temple?.line || 'No Line ID'}</span>
      </div>
      {/* Facebook */}
      <div className="flex items-center gap-3">
        <FaFacebookSquare className="text-black-500 h-5 w-5 sm:h-6 sm:w-6" />
        <span>{temple?.facebook || 'No Facebook'}</span>
      </div>
      {/* Phone */}
      <div className="flex items-center gap-3">
        <FaPhone className="text-black-500 h-5 w-5 sm:h-6 sm:w-6" />
        <span>{temple?.phone || 'No Phone'}</span>
      </div>
    </div>
  </div>
</div>

        </div>
      </div>

            {/* ปุ่ม Scroll To Top */}
            {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition-opacity duration-300 opacity-100"
          style={{
            opacity: showScrollButton ? 1 : 0,
            pointerEvents: showScrollButton ? "auto" : "none",
          }}
        >
          <IoArrowUp className="h-6 w-6" />
        </button>
      )}
      </>
    )
  );
}
