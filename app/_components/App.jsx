import React, { useState } from "react";
import Header from "./Header";
import Card from "./Card";

function App() {
    const [filter, setFilter] = useState(""); // จัดเก็บค่าที่เลือกจาก Filter

    function handleFilterChange(selectedFilter) {
        setFilter(selectedFilter); // อัพเดทค่าที่เลือก
    }

    return (
        <div>
            {/* Header Component ส่งฟังก์ชัน handleFilterChange */}
            <Header onFilterChange={handleFilterChange} />

            {/* Card Component ส่งค่า filter ไปเพื่อกรองข้อมูล */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Card filter={filter} />
            </div>
        </div>
    );
}

export default App;
