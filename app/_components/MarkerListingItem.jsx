import { Button } from '@/components/ui/button';
import { MapPin, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

function MarkerListingItem({ temple, templeImg, closeHandler }) {
  const [viewmore, setViewmore] = useState(false);

  return (
    <div>
      <div className="w-96 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer hover:-translate-y-1 transform duration-200 border border-transparent p-3 hover:border hover:border-black">
        <X onClick={() => closeHandler()} className="cursor-pointer" />

        {/* รูปภาพ */}
        {templeImg && (
          <Image
            src={templeImg}
            alt={temple.name}
            width={800}
            height={170}
            className="rounded-lg object-cover h-[170px] w-full"
          />
        )}

        {/* ข้อมูลภายในการ์ด */}
        <div className="flex flex-col gap-2 mt-2">
          {/* ชื่อวัด */}
          <h2 className="font-bold text-xl">{temple?.name}</h2>

          {/* ที่อยู่ */}
          <h2 className="flex gap-2 text-sm text-gray-400 items-center">
            <MapPin className="h-4 w-4" />
            {temple?.address}
          </h2>

          {/* รายละเอียดเพิ่มเติม */}
          <p className="text-gray-500 text-sm">
            {viewmore ? temple.description : temple?.description.slice(0, 90)}
            <span
              onClick={() => setViewmore(!viewmore)}
              className="text-blue-500 cursor-pointer ml-1"
            >
              {viewmore ? "view less" : "view more"}
            </span>
          </p>

          {/* ปุ่มแสดงรายละเอียดเพิ่มเติม */}
          <Link href={`/place/${temple?.id}`} className="w-full">
            <Button size="sm">View Detail</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MarkerListingItem;
