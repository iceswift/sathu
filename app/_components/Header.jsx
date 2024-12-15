"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function Header() {
    const router = useRouter();
    const path = usePathname();
    const { user, isSignedIn } = useUser();
    const [search, setSearch] = useState(""); // Keep text in search box
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Control Dropdown Filter

    useEffect(() => {
        console.log(path);
    }, []);

    function handleOnSubmit(e) {
        e.preventDefault();
        router.push(`/search?name=${search}`); // Go to search page
    }

    function handleClearSearch() {
        setSearch(""); // Clear text in search box
        router.push("/"); // Come Back to Home
    }

    function handleFilterClick() {
        setIsDropdownOpen((prev) => !prev); // Toggle Dropdown
    }

    function handleFilterSelect(item) {
        alert(`Selected Filter: ${item}`); // Show Alert to choose
        setIsDropdownOpen(false); // Close Dropdown
    }

    return (
        <form onSubmit={handleOnSubmit}>
            <div className="z-10 p-2 px-10 flex justify-between shadow-sm fixed top-0 w-full bg-[#ececec]">
                <div>
                    <Link href={"/"}>
                        <Image
                            src="/logo_mobile.png"
                            width={120}
                            height={40}
                            alt="Logo"
                            className="block sm:hidden w-[40px] h-[50px]"
                        />
                        <Image
                            src="/logo_desktop.png"
                            width={150}
                            height={40}
                            alt="Logo for desktop"
                            className="hidden sm:block w-[150px] h-auto"
                        />
                    </Link>
                </div>

                {/* Search Box */}
                <div className="relative w-full max-w-xs sm:max-w-sm mx-auto px-4 sm:px-6 flex items-center">
                    {/* X Icon */}
                    <div className="absolute left-10">
                        {search ? (
                            <FaTimes
                                onClick={handleClearSearch}
                                className="text-gray-500 cursor-pointer text-sm sm:text-base md:text-lg"
                            />
                        ) : (
                            <FaSearch className="text-gray-500 text-sm sm:text-base md:text-lg" />
                        )}
                    </div>

                    {/* Search Box */}
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={`w-full outline-none transition-all ${
                            search ? "pl-10 pr-10" : "pl-10 pr-12"
                        } py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 sm:py-3 sm:pl-12 sm:pr-14`}
                        placeholder="Search"
                    />

                    {/* Filter Icon and Dropdown */}
                    {!search && (
                        <div className="relative">
                            {/*Filter Icon */}
                            <FaFilter
                                onClick={handleFilterClick}
                                className="absolute right-5 top-[-7px] text-gray-500 text-sm sm:text-base md:text-lg cursor-pointer"
                            />

                            {/* Dropdown Popup */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-6 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                    <div className="py-2">
                                        <div className="px-4 py-2 font-bold text-gray-700 border-b">
                                            Filters
                                        </div>
                                        {["Buddhism", "Christianity", "Islam", "Sikhism", "Judaism"].map(
                                            (item, index) => (
                                                <button
                                                    key={index}
                                                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                                    onClick={() => handleFilterSelect(item)}
                                                >
                                                    {item}
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* User Profile */}
                <div className="flex gap-1 items-center">
                    {isSignedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Image
                                    src={user?.imageUrl}
                                    width={35}
                                    height={35}
                                    alt="user profile"
                                    className="cursor-pointer rounded-full"
                                />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link href={"/user"}>Profile</Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem>
                                    <SignOutButton>Logout</SignOutButton>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href={"/sign-in"}>
                            <Button
                                variant="outline"
                                aria-label="Login"
                                as={Link}
                                href="/login"
                            >
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </form>
    );
}

export default Header;
