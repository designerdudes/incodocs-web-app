import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Heading from '@/components/ui/heading'
import Link from 'next/link'
import React from 'react'

function page() {
    return (
        <main className="flex h-full flex-col p-20">
            <div>
                <Heading className="text-4xl" title="Welcome, To Inventory Management" />
            </div>

            <div className="flex flex-row gap-4 mt-10">
                <Link href="./rawmaterial" passHref>
                    <div className="cursor-pointer">
                        <Card>
                            <CardHeader>
                                <CardTitle>Raw Material Inventory</CardTitle>
                                <CardDescription>Raw Material Inventory Management system</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Raw Material Inventory Content</p>
                            </CardContent>
                        </Card>
                    </div>
                </Link>

                <Link href="./finishedmaterial" passHref>
                    <div className="cursor-pointer">
                        <Card>
                            <CardHeader>
                                <CardTitle>Finished Material Inventory</CardTitle>
                                <CardDescription>This is the Finished Material Inventory Management</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Finished Material Inventory Content</p>
                            </CardContent>
                        </Card>
                    </div>
                </Link>
            </div>
        </main>
    )
}

export default page