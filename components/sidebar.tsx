import React from 'react'
import { Button } from './ui/button'

function Sidebar() {
    return (
        <div className='w-64 bg-primary h-screen text-white'>
            <div className='flex items-center justify-center h-16 bg-primary-dark'>
                <h1 className='text-2xl font-bold'>Sidebar</h1>
            </div>
            <div className='flex flex-col gap-4'>

                <div className='text-secondary-foreground text-white hover:bg-[#6d6ce3] py-1 px-4'>Home</div>
                <div className='text-secondary-foreground text-white hover:bg-[#6d6ce3] py-1 px-4'>About</div>
                <div className='text-secondary-foreground text-white hover:bg-[#6d6ce3] py-1 px-4'>Services</div>
                <div className='text-secondary-foreground text-white hover:bg-[#6d6ce3] py-1 px-4'>Contact</div>

            </div>

        </div>
    )
}

export default Sidebar
