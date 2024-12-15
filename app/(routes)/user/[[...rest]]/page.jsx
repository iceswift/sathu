"use client";
import { UserButton, UserProfile } from "@clerk/nextjs";
import { Building2, Grid } from "lucide-react"; // เอา Mail icon ออก
import React from "react";
import UserListing from "../_components/UserListing";
import DashboardPage from "../_components/DashboardPage";

function User() {
  return (
    <div className="my-6 md:px-10 lg:px-32">
      <h2 className="p-10 font-bold text-2xl mt-6 text-center">Profile</h2>
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <UserProfile routing="hash">
          <UserButton.UserProfilePage
            label="My listing"
            labelIcon={<Building2 className="h-5 w-5" />}
            url="my-listing"
          >
            <UserListing />
          </UserButton.UserProfilePage>
          {/* เอาปุ่ม Contact Link ออก */}
          <UserButton.UserProfilePage
            label="Dashboard"
            labelIcon={<Grid className="h-5 w-5" />} // ใช้ไอคอน Grid
            url="dashboard"
          >
            {/* เนื้อหา Dashboard */}
            <DashboardPage />
          </UserButton.UserProfilePage>
        </UserProfile>
      </div>
    </div>
  );
}

export default User;
