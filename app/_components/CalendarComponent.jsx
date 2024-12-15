'use client';

import React, { useEffect, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Main styles for DateRangePicker
import 'react-date-range/dist/theme/default.css'; // Default theme for DateRangePicker
import { supabase } from '@/utils/supabase/client'; // Import Supabase Client
import { ToastContainer, toast } from 'react-toastify';
import { eachDayOfInterval } from "date-fns";
import 'react-toastify/dist/ReactToastify.css';

export default function CalendarComponent({ userEmail, listing_id }) {
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });
  const [blackoutDates, setBlackoutDates] = useState([])
  console.log(blackoutDates)
  useEffect(() => {
    async function getData() {
        const { data, error } = await supabase
          .from('Booking')
          .select()
          .eq('listing_id', listing_id);
        if (error) console.log(error)
        if (data) {
          const disabledRanges = data.map(d => ({ start: new Date(d.start), end: new Date(d.end) }))
          const disabledDates = [];
          disabledRanges.forEach((range) => {
            const rangeDates = eachDayOfInterval({ start: range.start, end: range.end });
            disabledDates.push(...rangeDates);
          });
          setBlackoutDates(disabledDates)
        }
    }
    getData()
  }, [])

  // Handle date selection from the calendar
  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
  };

  // Function to handle booking
  const handleBooking = async () => {
    try {
      const { startDate, endDate } = selectionRange;
      // Check if userEmail is provided
      if (!userEmail) {
        toast.error('User email is required to make a booking.');
        return;
      }

      // Check if startDate and endDate are valid
      if (!startDate || !endDate) {
        toast.error('Please select a valid date range.');
        return;
      }

      const startFormattedDate = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(startDate).replace(/\//g, '-');
      const endFormattedDate = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(endDate).replace(/\//g, '-');
      
      // Insert booking data into the Supabase 'Booking' table
      const { data, error } = await supabase.from('Booking').insert([
        {
          start: startFormattedDate, // Format start date as 'YYYY-MM-DD'
          end: endFormattedDate, // Format end date as 'YYYY-MM-DD'
          listing_id,
          user_email: userEmail, // Pass user email to the database
        },
      ]);

      // Handle errors during the insert operation
      if (error) {
        console.log('Error creating booking:', error);
        toast.error(`Failed to create booking: ${error.message || 'Unknown error'}`);
        return;
      }

      // Log success and show a success toast
      console.log('Booking created successfully:', data);
      toast.success('Booking created successfully!');
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred.');
    }
  };

  return (
    <div className="p-4">
      {/* Calendar Component */}
      <DateRangePicker
        ranges={[selectionRange]}
        onChange={handleSelect}
        rangeColors={['#000000']}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        editableDateInputs={true}
        months={1}
        direction="vertical"
        disabledDates={blackoutDates}
        staticRanges={[]} // Remove predefined date ranges
        inputRanges={[]} // Remove input fields for custom ranges
        minDate={new Date()}
      />
      {/* Booking Button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleBooking}
          className="bg-black text-white py-2 px-6 rounded-lg shadow-md hover:bg-gray-800 transition-colors duration-300"
        >
          Make a Reservation
        </button>
      </div>
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
