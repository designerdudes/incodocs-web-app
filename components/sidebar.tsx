"use client"
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { BrandName } from '@/lib/constants';
import { Separator } from './ui/separator';

function Sidebar() {
    const [hoveredItem, setHoveredItem] = useState(null);

    const handleMouseEnter = (index: any) => {
        setHoveredItem(index);
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
    };

    const menuItems = [
        "Home",
        "About",
        "Services",
        "Contact"
    ];

    return (
        <div className='w-64 bg-primary h-screen text-white'>
            <div className='flex items-center justify-start px-4 h-16 bg-primary-dark'>
                <h1 className='text-2xl font-bold'>{BrandName}</h1>
            </div>
            <Separator className='opacity-[0.2] mb-2' />
            <div className='flex flex-col gap-4'>
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className={`text-secondary-foreground text-white hover:bg-[#6d6ce3] py-1 px-4 flex justify-between ${hoveredItem === index ? 'hovered' : ''}`}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <span>{item}</span>
                        {hoveredItem === index &&
                            <Plus className='w-6 h-6 p-1 rounded-lg cursor-pointer hover:bg-primary' style={{ opacity: hoveredItem === index ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }} />
                        }
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Sidebar;
