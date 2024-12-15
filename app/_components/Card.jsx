"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/utils/supabase/client";
import { MapPin, Ruler, Trash } from "lucide-react";
import Link from "next/link";
import { FaDharmachakra } from "react-icons/fa";
import { FaUsers } from 'react-icons/fa';
import { FaAccessibleIcon } from 'react-icons/fa';
import { IoArrowUp } from "react-icons/io5";

export default function Card({ temple }) {
  const [image, setImage] = useState("");
  const [viewmore, setViewmore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    async function getImage() {
      const { data, error } = await supabase.from("listingImages").select();
      const templeObj = data.find((data) => data.listing_id == temple.id);
      setImage(templeObj?.url || "");
      setLoading(false);
    }
    getImage();
  }, [temple.id]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
  

  if (loading) {
    return (
      <div className="h-[230px] w-full bg-slate-200 animate-pulse rounded-lg "></div>
    );
  }

  return (
    <>
      <Link href={`/place/${temple.id}`}>
        <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer hover:-translate-y-1 transform duration-200 border border-transparent p-3 hover:border hover:border-black">
          {/* รูปภาพ */}
          {image && (
            <Image
              src={image}
              alt={temple.name}
              width={800}
              height={170}
              className="rounded-lg object-cover h-[170px] w-full"
            />
          )}
          {/* ข้อมูลภายในการ์ด */}
          <div className="flex flex-col gap-2 mt-2">
            {/* ชื่อวัด */}
            <h2 className="font-bold text-xl">{temple.name}</h2>
            {/* ที่อยู่ */}
            <h2 className="flex gap-2 text-sm text-gray-400 items-center">
              <MapPin className="h-4 w-4" />
              {temple.address}
            </h2>
            {/* รายละเอียดเพิ่มเติม */}
            <p className="text-gray-500 text-sm">
              {viewmore
                ? temple.description
                : temple.description.slice(0, 90)}
              <span
                onClick={() => setViewmore(!viewmore)}
                className="text-blue-500 cursor-pointer ml-1"
              >
                {viewmore ? "view less" : "view more"}
              </span>
            </p>
            {/* ข้อมูลเพิ่มเติม */}
            <div className="flex gap-2 mt-2 justify-between">
              <h2 className="flex gap-2 text-sm bg-slate-200 rounded-md p-2 w-full text-gray-500 justify-center items-center">
                <FaDharmachakra className="h-4 w-4" />
                {temple?.religions || "N/A"}
              </h2>
              <h2 className="flex gap-2 text-sm bg-slate-200 rounded-md p-2 w-full text-gray-500 justify-center items-center">
                <FaUsers className="h-4 w-4" />
                {temple?.capacity || "N/A"}
              </h2>
              <h2 className="flex gap-2 text-sm bg-slate-200 rounded-md p-2 w-full text-gray-500 justify-center items-center">
                <FaAccessibleIcon className="h-4 w-4" />
                {temple?.toilet || "N/A"}
              </h2>
            </div>
          </div>
        </div>
      </Link>
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
  );
}
