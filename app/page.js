"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // นำเข้า Button จาก Shadcn
import Card from "./_components/Card";
import { supabase } from "@/utils/supabase/client";

export default function Home() {
  const [temples, setTemples] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบัน
  const itemsPerPage = 8; // จำนวนรายการต่อหน้า

  useEffect(() => {
    async function getData() {
      const { data, error } = await supabase.from("listing").select();
      setTemples(data);
    }
    getData();
  }, []);

  const totalPages = Math.ceil(temples.filter((t) => t.active).length / itemsPerPage);

  const currentItems = temples
    .filter((temple) => temple.active) 
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="mt-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-full">
        {currentItems.map((temple) => (
          <Card key={temple.id} temple={temple} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center mb-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex justify-center items-center space-x-2">
      {/* ปุ่ม Previous */}
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      {/* หมายเลขหน้า */}
      {pages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {/* ปุ่ม Next */}
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}
