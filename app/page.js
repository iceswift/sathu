"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import ListingMapView from "./_components/ListingMapView";
import { supabase } from '@/utils/supabase/client';
import { useEffect, useState } from "react";
import Card from "./_components/Card";

export default function Home() {
  const [temples, setTemples] = useState([]);

  useEffect(() => {
    async function getData() {
      const { data, error } = await supabase.from('listing').select();
      setTemples(data)
    }

    getData();
  }, [])

   return (
     <div className="max-w-96">
      {temples.map(temple => <Card key={temple.id} temple={temple}  />)}
     </div>
   );
}

