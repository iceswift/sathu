'use client'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/utils/supabase/client';
import React, { useEffect, useState } from 'react'
import Card from '@/app/_components/Card';

export default function SearchPage() {
    const searchParams = useSearchParams()
    const search = searchParams.get('name')
    const [temples, setTemples] = useState([])

    useEffect(() => {
        async function getTemples() {
            const { data, error } = await supabase
                .from('listing')
                .select()
                .ilike('name', `%${search}%`);
            if (error) {
                console.error('Error fetching listing:', error);
                return;
            }
            setTemples(data);
        }
        getTemples();
    }, [])

    return (
<div className="mt-28 p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {temples.map((temple) => (
    <div key={temple.id} className="max-w-sm mx-auto">
      <Card temple={temple} />
    </div>
  ))}
</div>

  )
}
