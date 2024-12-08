"use client"

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { SignOutButton, UserButton, useUser } from '@clerk/nextjs'
import Search from "./Search";
import { Input } from "@/components/ui/input"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


function Header() {
    const path = usePathname();
    const { user, isSignedIn } = useUser();

    useEffect(() => {
        console.log(path)

    }, [])
    return (
        <div className='z-10 p-6 px-10 flex justify-between shadow-sm fixed top-0 w-full bg-[#ececec]'>
            <div>
                <Link href={'/'}>
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

            <div className="w=96">
                <Input className="outline-none transition-all" placeholder="Search" />
            </div>


            <div className='flex gap-1 items-center'>

                {isSignedIn ?

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Image src={user?.imageUrl} width={35} height={35} alt='user profile' className='cursor-pointer rounded-full' />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link href={'/user'}>Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>My Listing</DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/add-new-listing">
                                    Board
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <SignOutButton>
                                    Logout
                                </SignOutButton>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    :
                    <Link href={'/sign-in'}>
                        <Button
                            variant="outline"
                            aria-label="Login"
                            as={Link}
                            href="/login"
                        >
                            Login
                        </Button>
                    </Link>
                }
            </div>
        </div>
    )
}

export default Header
