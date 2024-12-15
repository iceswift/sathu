'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';


const DashboardPage = () => {
  const [bookings, setBookings] = useState([]); // เก็บข้อมูลการจอง
  const [loading, setLoading] = useState(false); // สถานะโหลดข้อมูล

  // ดึงข้อมูลการจองจาก Supabase
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("Booking") // ตาราง Booking
      .select()

    if (error) {
      console.log('Error fetching bookings:', error);
    }
    if (data) {
      const finalData = await Promise.all(data.map(async book => {
        const { data, error } = await supabase
          .from("listing")
          .select()
          .eq("id", book.listing_id)
        return { ...book, listing: data[0] }
      }))
      const finalDataSorted = finalData.sort((a, b) => a.id - b.id)
      console.log("Fetched bookings:", finalDataSorted);
      setBookings(finalDataSorted)
    }
    setLoading(false);
  };


  const updateStatus = async (id, status) => {
    try {
      console.log("Updating status for ID:", id, "to:", status); // ดีบักค่าที่ส่งไป

      const updatedValue = {
        active: status, // เปลี่ยนสถานะตามที่ผู้ใช้คลิก
      };

      const { data, error } = await supabase
        .from("Booking") // ตาราง Booking
        .update(updatedValue) // อัปเดตฟิลด์ `active` ด้วยค่าที่ปรับ
        .eq('id', id) // ระบุแถวที่ต้องการอัปเดต
        .select(); // ดึงข้อมูลที่อัปเดตกลับมา

      if (error) {
        throw new Error(error.message);
      }

      const { data: listingData, error: listingErr } = await supabase
        .from("listing")
        .select()
        .eq("id", data[0].listing_id)

      const updatedBooking = { ...data[0], listing: listingData[0] }
      const updatedBookings = bookings.map(booking => booking.id == updatedBooking.id ? updatedBooking : booking)
      setBookings(updatedBookings)
      toast(`Status updated successfully for ID: ${id}`)
    } catch (error) {
      console.log('Error updating status:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard - Booking Management</h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="animate-bounce">
            <img
              src="/logo_mobile.png"
              alt="Logo"
              className="h-20 w-19"
            />
          </div>
          <p className="mt-4 text-lg font-bold text-black-500">Loading...</p>
        </div>

      ) : (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Place Name</th>
              <th className="border p-2">Start Date</th>
              <th className="border p-2">End Date</th>
              <th className="border p-2">User Email</th>
              <th className="border p-2">Active</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-100">
                <td className="border p-2">{booking.listing ? booking.listing.name : 'N/A'}</td>
                <td className="border p-2">{booking.start || 'N/A'}</td>
                <td className="border p-2">{booking.end || 'N/A'}</td>
                <td className="border p-2">{booking.user_email}</td>
                <td className="border p-2 text-center">
                  {booking.active ? 'Yes' : 'No'}
                </td>
                <td className="border p-2 flex gap-2 justify-center">
                  {booking.active ? (
                    <Button
                      size="sm"
                      onClick={() => updateStatus(booking.id, false)}
                      className="bg-red-500 text-white hover:bg-red-600"
                    >
                      Disagree
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => updateStatus(booking.id, true)}
                      className="bg-green-500 text-white hover:bg-green-600"
                    >
                      Agree
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DashboardPage;