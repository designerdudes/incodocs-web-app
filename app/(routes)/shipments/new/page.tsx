import { NewShipmentForm } from '@/components/forms/newShipmentForm'
import React from 'react'

function Page() {
    return (
        <div className='flex h-full flex-col p-20'>
            <h1>Shipments</h1>
            <NewShipmentForm />
        </div>
    )
}

export default Page
