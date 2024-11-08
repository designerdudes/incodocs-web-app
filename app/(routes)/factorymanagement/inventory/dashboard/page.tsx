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
                <Link href="/factorymanagement/dashboard" passHref>
                    <div className="cursor-pointer">
                        <Card>
                            <CardHeader>
                                <CardTitle>Raw Material data</CardTitle>
                                <CardDescription>Raw Material data Management system</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Raw Material data Content</p>
                            </CardContent>
                        </Card>
                    </div>
                </Link>

                <Link href="/documentation/dashboard" passHref>
                    <div className="cursor-pointer">
                        <Card>
                            <CardHeader>
                                <CardTitle>Finished Material data</CardTitle>
                                <CardDescription>This is the Finished Material data Management system</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Finished Material data</p>
                            </CardContent>
                        </Card>
                    </div>
                </Link>
            </div>
        </main>
    )
}

export default page