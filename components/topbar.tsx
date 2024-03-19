"use client"
import React from 'react'
import { ModeToggle } from './theme-toggler'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOutIcon, Plus, Settings, User, Users } from 'lucide-react'
import Heading from './ui/heading'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { BrandName } from '@/lib/constants'
import LogoComponent from './logo'

const Topbar = () => {
    const router = useRouter()
    const logout = async () => {
        try {
            const res = await axios.get('/api/auth/logout')
            router.refresh()

        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div className="flex bg-secondary p-3 px-12 mb-2 justify-between items-center sticky top-0 z-50">
            <div className='flex items-center gap-2'>
                <LogoComponent width={60} height={40} className='w-8 h-8 object-contain' />
                <Heading title={BrandName} className='text-xl' />

            </div>
            <div className='flex items-center gap-2'>

                <ModeToggle />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className='w-8 h-8'>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuGroup>
                            <DropdownMenuItem className='flex items-center gap-2'>
                                <Avatar className='w-8 h-8'>
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className='font-semibold'>Mohammed</p>
                                    <p className='text-xs text-gray-500'>mohammed@incodocs.in</p>
                                </div>

                            </DropdownMenuItem>

                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>

                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>

                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem

                            >
                                <Users className="mr-2 h-4 w-4" />
                                <span>Team</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                <span>New Team Member</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onSelect={logout}
                        >
                            <LogOutIcon className="mr-2 h-4 w-4" />
                            <span>Log out</span>

                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </div >
    )
}

export default Topbar
