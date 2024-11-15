"use client"
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { accountingSidebarTabs, BrandName, factoryManagementSidebarTabs, sidebarTabs } from '@/lib/constants';
import { Separator } from './ui/separator';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

function DocumentationSidebar() {
    const [hoveredItem, setHoveredItem] = useState(null);

    const handleMouseEnter = (index: any) => {
        setHoveredItem(index);
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
    };

    const pathname = usePathname()
    const router = useRouter()
    const firstTabs = sidebarTabs.slice(0, 2);
    const restTabs = sidebarTabs.slice(2);
    return (
        <div className='w-64  sticky top-0 h-screen z-50 bg-primary  text-white'>
            <div className='flex items-center justify-start px-4 h-16 bg-primary-dark'>
                <h1 className='text-2xl font-bold'>{BrandName}</h1>
            </div>
            <Separator className='opacity-[0.2] mb-2' />
            <div className='flex flex-col justify-between h-[90%]  gap-4'>
                {/* Render the first two tabs */}
                <div>
                    {firstTabs.map((item: any, index: any) => (
                        <div
                            key={index}
                            className={pathname.includes(item.path) ? `text-secondary-foreground text-white cursor-pointer bg-[#5958cc] py-1 px-4 flex justify-between ${hoveredItem === index ? 'hovered' : ''}` : `text-secondary-foreground text-white hover:bg-[#6d6ce3] py-1 px-4 flex cursor-pointer justify-between ${hoveredItem === index ? 'hovered' : ''}`}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            onClick={
                                () => {
                                    router.push(item.path)
                                }
                            }
                        >
                            <div className='flex items-center gap-1'>
                                <span>{item.icon}</span>
                                <span className='text-sm'>{item.title}</span>
                            </div>
                            {item.showButton &&
                                hoveredItem === index &&
                                <Plus
                                    onClick={
                                        () => {
                                            router.push(item.buttonUrl)
                                        }
                                    }
                                    className='w-6 h-6 p-1 rounded-lg z-50 pointer-events-auto cursor-pointer hover:bg-primary' style={{ opacity: hoveredItem === index ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }} />
                            }
                        </div>
                    ))}
                </div>
                {/* Render the rest of the tabs */}
                <div>
                    {restTabs.map((item, index) => (
                        <div
                            key={index + firstTabs.length}
                            className={`text-secondary-foreground text-white hover:bg-[#6d6ce3] py-1 px-4 flex justify-between ${hoveredItem === index + firstTabs.length ? 'hovered' : ''}`}
                            onMouseEnter={() => handleMouseEnter(index + firstTabs.length)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className='flex items-center gap-1'>
                                <span>{item.icon}</span>
                                <span className='text-sm'>{item.title}</span>
                            </div>
                            {item.showButton &&
                                hoveredItem === index + firstTabs.length &&
                                <Plus className='w-6 h-6 p-1 rounded-lg cursor-pointer hover:bg-primary' style={{ opacity: hoveredItem === index + firstTabs.length ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }} />
                            }
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

function FactoryManagementSidebarTabs() {
    const [hoveredItem, setHoveredItem] = useState(null);

    const handleMouseEnter = (index: any) => {
        setHoveredItem(index);
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
    };

    const pathname = usePathname()
    const router = useRouter()
    const firstTabs = factoryManagementSidebarTabs.slice(0, 3);
    const restTabs = factoryManagementSidebarTabs.slice(3);
    return (
        <div className='w-64  sticky top-0 h-screen z-50 bg-primary  text-white'>
            <div className='flex items-center justify-start px-4 h-16 bg-primary-dark'>
                <Link href={"/dashboard"}>
                    <Button className='variant-Black'>
                        <h1 className='text-2xl font-bold'>{BrandName}</h1>
                    </Button>
                </Link>
            </div>
            <Separator className='opacity-[0.2] mb-2' />
            <div className='flex flex-col justify-between h-[90%]  gap-4'>
                {/* Render the first two tabs */}
                <div>
                    {firstTabs.map((item: any, index: any) => (
                        <div
                            key={index}
                            className={pathname.includes(item.path) ? `text-secondary-foreground text-white cursor-pointer bg-[#5958cc] py-1 px-4 flex justify-between ${hoveredItem === index ? 'hovered' : ''}` : `text-secondary-foreground text-white hover:bg-[#6d6ce3] py-1 px-4 flex cursor-pointer justify-between ${hoveredItem === index ? 'hovered' : ''}`}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            onClick={
                                () => {
                                    router.push(item.path)
                                }
                            }
                        >
                            <div className='flex items-center gap-1'>
                                <span>{item.icon}</span>
                                <span className='text-sm'>{item.title}</span>
                            </div>
                            {item.showButton &&
                                hoveredItem === index &&
                                <Plus
                                    onClick={
                                        () => {
                                            router.push(item.buttonUrl)
                                        }
                                    }
                                    className='w-6 h-6 p-1 rounded-lg z-50 pointer-events-auto cursor-pointer hover:bg-primary' style={{ opacity: hoveredItem === index ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }} />
                            }
                        </div>
                    ))}
                </div>
                {/* Render the rest of the tabs */}
                <div>
                    {restTabs.map((item, index) => (
                        <div
                            key={index + firstTabs.length}
                            className={`text-secondary-foreground text-white hover:bg-[#6d6ce3] py-1 px-4 flex justify-between ${hoveredItem === index + firstTabs.length ? 'hovered' : ''}`}
                            onMouseEnter={() => handleMouseEnter(index + firstTabs.length)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className='flex items-center gap-1'>
                                <span>{item.icon}</span>
                                <span className='text-sm'>{item.title}</span>
                            </div>
                            {item.showButton &&
                                hoveredItem === index + firstTabs.length &&
                                <Plus className='w-6 h-6 p-1 rounded-lg cursor-pointer hover:bg-primary' style={{ opacity: hoveredItem === index + firstTabs.length ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }} />
                            }
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function AccountsSidebarTabs() {
    const [hoveredItem, setHoveredItem] = useState(null);

    const handleMouseEnter = (index: any) => {
        setHoveredItem(index);
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
    };

    const pathname = usePathname()
    const router = useRouter()
    const firstTabs = accountingSidebarTabs.slice(0, 3);
    const restTabs = accountingSidebarTabs.slice(3);
    return (
        <div className='w-64  sticky top-0 h-screen z-50 bg-primary  text-white'>
            <div className='flex items-center justify-start px-4 h-16 bg-primary-dark'>
                <Link href={"/dashboard"}>
                    <Button className='variant-Black'>
                        <h1 className='text-2xl font-bold'>{BrandName}</h1>
                    </Button>
                </Link>
            </div>
            <Separator className='opacity-[0.2] mb-2' />
            <div className='flex flex-col justify-between h-[90%]  gap-4'>
                {/* Render the first two tabs */}
                <div>
                    {firstTabs.map((item: any, index: any) => (
                        <div
                            key={index}
                            className={pathname.includes(item.path) ? `text-secondary-foreground text-white cursor-pointer bg-[#5958cc] py-1 px-4 flex justify-between ${hoveredItem === index ? 'hovered' : ''}` : `text-secondary-foreground text-white hover:bg-[#6d6ce3] py-1 px-4 flex cursor-pointer justify-between ${hoveredItem === index ? 'hovered' : ''}`}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            onClick={
                                () => {
                                    router.push(item.path)
                                }
                            }
                        >
                            <div className='flex items-center gap-1'>
                                <span>{item.icon}</span>
                                <span className='text-sm'>{item.title}</span>
                            </div>
                            {item.showButton &&
                                hoveredItem === index &&
                                <Plus
                                    onClick={
                                        () => {
                                            router.push(item.buttonUrl)
                                        }
                                    }
                                    className='w-6 h-6 p-1 rounded-lg z-50 pointer-events-auto cursor-pointer hover:bg-primary' style={{ opacity: hoveredItem === index ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }} />
                            }
                        </div>
                    ))}
                </div>
                {/* Render the rest of the tabs */}
                <div>
                    {restTabs.map((item, index) => (
                        <div
                            key={index + firstTabs.length}
                            className={`text-secondary-foreground text-white hover:bg-[#6d6ce3] py-1 px-4 flex justify-between ${hoveredItem === index + firstTabs.length ? 'hovered' : ''}`}
                            onMouseEnter={() => handleMouseEnter(index + firstTabs.length)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className='flex items-center gap-1'>
                                <span>{item.icon}</span>
                                <span className='text-sm'>{item.title}</span>
                            </div>
                            {item.showButton &&
                                hoveredItem === index + firstTabs.length &&
                                <Plus className='w-6 h-6 p-1 rounded-lg cursor-pointer hover:bg-primary' style={{ opacity: hoveredItem === index + firstTabs.length ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }} />
                            }
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}



export { DocumentationSidebar, FactoryManagementSidebarTabs, AccountsSidebarTabs };
