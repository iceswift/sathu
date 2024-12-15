"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

function ContactLinkForm() {
  const { user } = useUser(); // ดึงข้อมูลผู้ใช้
  const [formData, setFormData] = useState({
    Line: "",
    Messenger   : "",
    Instagram   : "",
    Facebook    : "",
    Discord     : "",
    Phone       : "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // เพิ่ม createdBy ลงในข้อมูล
    const finalData = {
      ...formData,
      createdBy: user?.primaryEmailAddress?.emailAddress || "Unknown", // ใช้อีเมลผู้ใช้ หรือกำหนดค่าเริ่มต้น
    };

    try {
      const { data, error } = await supabase.from("ContactLink").insert([finalData]);

      if (error) {
        console.error("Error inserting data:", error);
        toast.error("Error saving contact links. Please try again.");
        return;
      }

      toast.success("Contact links saved successfully!");
      setFormData({
        Line: "",
        Messenger: "",
        Instagram: "",
        Facebook: "",
        Discord: "",
        Phone: "",
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-8 py-6">
      <h2 className="text-xl font-bold mb-4">Submit Your Contact Links</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="Line">Line</label>
          <Input
            type="text"
            id="Line"
            name="Line"
            placeholder="Enter your Line ID"
            value={formData.Line}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="Messenger">Messenger</label>
          <Input
            type="text"
            id="Messenger"
            name="Messenger"
            placeholder="Enter your Messenger link"
            value={formData.Messenger}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="Instagram">Instagram</label>
          <Input
            type="text"
            id="Instagram"
            name="Instagram"
            placeholder="Enter your Instagram username"
            value={formData.Instagram}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="Facebook">Facebook</label>
          <Input
            type="text"
            id="Facebook"
            name="Facebook"
            placeholder="Enter your Facebook profile link"
            value={formData.Facebook}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="Discord">Discord</label>
          <Input
            type="text"
            id="Discord"
            name="Discord"
            placeholder="Enter your Discord ID"
            value={formData.Discord}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="Phone">Phone</label>
          <Input
            type="text"
            id="Phone"
            name="Phone"
            placeholder="Enter your phone number"
            value={formData.Phone}
            onChange={handleChange}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}

export default ContactLinkForm;
