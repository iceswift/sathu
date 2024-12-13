"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/utils/supabase/client";
import { MapPin } from "lucide-react";
import Link from "next/link";

export default function Card({ temple }) {
  const [image, setImage] = useState("");
  const [viewmore, setViewmore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getImage() {
      const { data, error } = await supabase.from("listingImages").select();
      const templeObj = data.find((data) => data.listing_id == temple.id);
      setImage(templeObj?.url || "");
      setLoading(false);
    }
    getImage();
  }, [temple.id]);

  if (loading) {
    return (
      <div className="h-[230px] w-full bg-slate-200 animate-pulse rounded-lg "></div>
    );
  }

  return (
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
        </div>
      </div>
    </Link>
  );
}
