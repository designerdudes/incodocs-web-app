import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Heading from '@/components/ui/heading'
import Link from 'next/link'
import React from 'react'

function page() {
    return (
        <div className="flex  flex-col p-6">
            <div className="flex justify-between items-center gap-2">
                <div className="flex flex-col ">
                    <Heading className="text-3xl" title="This is Inventory Management Dashboard" />
                    <p className='mt-2'>Effectively oversee your factory&apos;s raw materials and finished goods inventory.</p>
                </div>
                <Link href={`/shipments/new`}>
                    <Button className="bg-primary text-white">New Button (Easily add new lots, blocks, or slabs to streamline your workflow.

                        )</Button>
                </Link>
            </div>
            <div className="flex flex-row gap-4 mt-10 ">
                <Link href="./rawmaterial" passHref>
                    <div className="cursor-pointer">
                        <Card>
                            <CardHeader>
                                <CardTitle>Raw Material Inventory</CardTitle>
                                <CardDescription>Keep track of raw materials entering your factory and ensure efficient resource allocation.


                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Monitor incoming lots, manage block-level details, and maintain accurate stock records. Gain insights into inventory availability and streamline operations for optimal production.

                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </Link>

                <Link href="./finishedmaterial" passHref>
                    <div className="cursor-pointer">
                        <Card>
                            <CardHeader>
                                <CardTitle>Finished Material Inventory</CardTitle>
                                <CardDescription>Organize and manage your finished materials post-production for better accountability.

                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Track slabs and polished materials ready for sale or export. Easily access metrics like dimensions, square footage, and inventory valuation.

                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </Link>
                <Link href="./lotmanagement" passHref>
                    <div className="cursor-pointer">
                        <Card>
                            <CardHeader>
                                <CardTitle>Lot Management Page</CardTitle>
                                <CardDescription>Simplify the process of organizing and managing lots of raw materials efficiently.

                                    .</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Record lot details, track block-level activities, and maintain a clear history of material flow through the production cycle. Ensure every lot&apos;s progress is documented with transparency and accuracy.

                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </Link>
            </div>
        </div>

    )
}

export default page