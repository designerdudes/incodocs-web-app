"use client"
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOutIcon, Settings, User } from 'lucide-react'
import Heading from './ui/heading'
import { useRouter } from 'next/navigation'
import { BrandName } from '@/lib/constants'
import LogoComponent from './logo'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

const Topbar = ({ userData }: { userData: { name: string; email: string } }) => {
    const router = useRouter()

    const logout = () => {
        try {
            // Clear all storage
            localStorage.clear();
            sessionStorage.clear();

            // Clear frontend cookies
            Cookies.remove('AccessToken', { path: '/' });
            Cookies.remove('AccessToken', { path: '/', sameSite: 'strict' });
            Cookies.remove('AccessToken', { path: '/', sameSite: 'lax' });
            Cookies.remove('AccessToken');
            const cookieNames = ['token', 'authToken', 'jwt'];
            cookieNames.forEach(name => {
                Cookies.remove(name, { path: '/' });
                Cookies.remove(name, { path: '/', sameSite: 'strict' });
                Cookies.remove(name, { path: '/', sameSite: 'lax' });
                Cookies.remove(name);
                document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
            });

            // Show success toast
            toast.success('Logout successful');

            // Redirect
            router.push('/login');
            setTimeout(() => {
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login?logout=true';
                }
            }, 500);
        } catch (error) {
            toast.error('Failed to log out. Please try again.');
        }
    }

    return (
        <div className="flex bg-muted rounded-md p-3 px-12 mb-2 justify-between items-center sticky top-0 z-50">
            <div className='flex items-center gap-2'>
                <LogoComponent width={60} height={40} className='w-8 h-8 object-contain' />
                <Heading title={BrandName} className='text-xl' />
            </div>
            <div className='flex items-center gap-2'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className='w-8 h-8 bg-secondary'>
                            <AvatarFallback className='bg-secondary text-sm'>
                                {userData.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full" side='bottom'>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuGroup>
                            <DropdownMenuItem className='flex items-center gap-2'>
                                <Avatar className='w-8 h-8'>
                                    <AvatarImage src="" alt="@shadcn" />
                                    <AvatarFallback className='bg-secondary text-sm'>
                                        {userData.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className='font-semibold'>{userData.name}</p>
                                    <p className='text-xs text-gray-500'>{userData.email}</p>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        {/* <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup> */}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={logout}>
                            <LogOutIcon className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default Topbar