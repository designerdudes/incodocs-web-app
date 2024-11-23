"use client"
import { fetchData } from "@/axiosUtility/api";
import { GetOrganisationDetaisForm } from "@/components/forms/GetOrganisationDetailsForm";
import Heading from "@/components/ui/heading";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default function Home() {
  const [currentUserData, setCurrentUserData] = useState(null as any)
  const globalModal = useGlobalModal()
  const getCurrentUserData = async () => {
    try {
      const res = await fetchData('/user/currentUser')
      setCurrentUserData(res)
      console.log('User data fetched successfully', res)
    } catch (error) {
      console.error('Error fetching user data', error)

    }
  }

  useEffect(() => {
    getCurrentUserData()
  }, [])


  useEffect(() => {
    if (currentUserData?.owner.length === 0) {
      // Remove the unnecessary return statement here
      globalModal.title = 'Add Organization Details'
      globalModal.description = 'Please add your organization details to continue'
      globalModal.isDismissable = false
      globalModal.children = <GetOrganisationDetaisForm gap={2} />
      globalModal.onOpen()
    }
  }, [currentUserData])



  return (
    <main className="flex h-full flex-col p-20">
      <div>
        <Heading className="text-4xl" title="Welcome, To IncoDocs" />
        <p className="text-lg mt-4">Efficiently manage your factory operations and streamline your documentation processes.

        </p>
      </div>

      <div className="flex flex-row gap-4 mt-10">
        <Link href="/factorymanagement" passHref>
          <div className="cursor-pointer">
            <Card>
              <CardHeader>
                <CardTitle>Factory Management </CardTitle>
                <CardDescription>Your complete solution for handling inventory, tracking production, and optimizing operations.

                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Monitor raw materials, manage blocks and slabs, and track production phases with real-time insights.</p>
              </CardContent>
            </Card>
          </div>
        </Link>

        <Link href="/documentation" passHref>
          <div className="cursor-pointer">
            <Card>
              <CardHeader>
                <CardTitle>Documentation</CardTitle>
                <CardDescription>Simplify and organize your business documentation with ease.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Generate, store, and access critical documents such as invoices, export papers, and shipment details.</p>
              </CardContent>
            </Card>
          </div>
        </Link>

        <Link href="/accounts/dashboard" passHref>
          <div className="cursor-pointer">
            <Card>
              <CardHeader>
                <CardTitle>Integration</CardTitle>
                <CardDescription>Seamlessly connect with other tools and systems for a unified workflow. </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Integrate accounting software, shipping services, and more to enhance productivity.</p>
              </CardContent>
            </Card>
          </div>
        </Link>
      </div>
    </main>
  );

}
