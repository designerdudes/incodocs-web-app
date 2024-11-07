"use client"
import { fetchData } from "@/axiosUtility/api";
import { GetOrganisationDetaisForm } from "@/components/forms/GetOrganisationDetailsForm";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default function Home() {
  const [currentUserData, setCurrentUserData] = useState(null as any)
  const globalModal = useGlobalModal()
  const getCurrentUserData = async () => {
    try {
      const res = await fetchData('user/currentUser')
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
      </div>

      <div className="flex flex-row gap-4 mt-10">
        <Link href="/factorymanagement/dashboard" passHref>
          <div className="cursor-pointer">
            <Card>
              <CardHeader>
                <CardTitle>Factory Management System</CardTitle>
                <CardDescription>This is the Factory Management system</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Factory Management Content</p>
              </CardContent>
            </Card>
          </div>
        </Link>

        <Link href="/documentation/dashboard" passHref>
          <div className="cursor-pointer">
            <Card>
              <CardHeader>
                <CardTitle>Shipment Management System</CardTitle>
                <CardDescription>This is the Shipment Management system</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Shipment Content</p>
              </CardContent>
            </Card>
          </div>
        </Link>

        <Link href="/accounts/dashboard" passHref>
          <div className="cursor-pointer">
            <Card>
              <CardHeader>
                <CardTitle>Account Management System</CardTitle>
                <CardDescription>This is the Account Management system</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Account Content</p>
              </CardContent>
            </Card>
          </div>
        </Link>
      </div>
    </main>
  );

}
