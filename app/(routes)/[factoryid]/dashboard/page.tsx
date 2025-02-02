import Heading from "@/components/ui/heading";
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cookies } from "next/headers";
import { FiBriefcase, FiFileText, FiSettings } from 'react-icons/fi'; // Importing Icons

interface Props {
  params: {
    factoryid: string;
  }
}

export default async function Home({ params }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get('AccessToken')?.value || "";
  const res = await fetch(`http://localhost:4080/factory/getSingle/${params?.factoryid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  });
  const currentFactoryData = await res.json();
  // console.log('Current Factory Data', currentFactoryData)
  // const getCurrentUserData = async () => {
  //   try {
  //     const res = await fetchData('/user/currentUser')
  //     setCurrentUserData(res)
  //     console.log('User data fetched successfully', res)
  //   } catch (error) {
  //     console.error('Error fetching user data', error)

  //   }
  // }
  // useEffect(() => {
  //   if (currentUserData?.owner.length === 0) {
  //     // Remove the unnecessary return statement here
  //     globalModal.title = 'Add Organization Details'
  //     globalModal.description = 'Please add your organization details to continue'
  //     globalModal.isDismissable = false
  //     globalModal.children = <GetOrganisationDetaisForm gap={2} />
  //     globalModal.onOpen()
  //   }
  // }, [currentUserData])

  return (
    <main className="flex h-full flex-col p-10 bg-gradient-to-r from-gray-100 to-white">
      <div className="text-center mb-10">
        <Heading className="text-4xl font-bold text-gray-800" title="Welcome, To IncoDocs" />
        <p className="text-lg mt-4 text-gray-600">Efficiently manage your factory operations and streamline your documentation processes.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/factorymanagement" passHref>
          <Card className="cursor-pointer hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold text-gray-800">Factory Management</CardTitle>
              <FiBriefcase className="text-3xl text-indigo-500" />
            </CardHeader>
            <CardDescription className="text-gray-600">
              Your complete solution for handling inventory, tracking production, and optimizing operations.
            </CardDescription>
            <CardContent className="text-gray-700">
              Monitor raw materials, manage blocks and slabs, and track production phases with real-time insights.
            </CardContent>
          </Card>
        </Link>
        <Link href="/documentation" passHref>
          <Card className="cursor-pointer hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold text-gray-800">Documentation</CardTitle>
              <FiFileText className="text-3xl text-green-500" />
            </CardHeader>
            <CardDescription className="text-gray-600">
              Simplify and organize your business documentation with ease.
            </CardDescription>
            <CardContent className="text-gray-700">
              Generate, store, and access critical documents such as invoices, export papers, and shipment details.
            </CardContent>
          </Card>
        </Link>
        <Link href="/accounts/dashboard" passHref>
          <Card className="cursor-pointer hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold text-gray-800">Settings</CardTitle>
              <FiSettings className="text-3xl text-yellow-500" />
            </CardHeader>
            <CardDescription className="text-gray-600">
              Customize your preferences and manage account settings.
            </CardDescription>
            <CardContent className="text-gray-700">
              Adjust notification settings, update profile information, and more.
            </CardContent>
          </Card>
        </Link>
      </div>
    </main>
  );
}
