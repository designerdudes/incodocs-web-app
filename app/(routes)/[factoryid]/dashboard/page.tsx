import Heading from "@/components/ui/heading";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cookies } from "next/headers";
import { FiBriefcase, FiFileText, FiSettings } from "react-icons/fi"; // Importing Icons

interface Props {
  params: {
    factoryid: string;
  };
}

export default async function Home({ params }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";
  const res = await fetch(
    `https://incodocs-server.onrender.com/factory/getSingle/${params?.factoryid}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );
  const currentFactoryData = await res.json();

  return (
    <main className="flex h-full flex-col p-10 bg-gradient-to-r from-gray-100 to-white">
      <div className="text-center mb-10">
        <Heading
          className="text-4xl font-bold text-gray-800"
          title="Welcome, To IncoDocs"
        />
        <p className="text-lg mt-4 text-gray-600">
          Efficiently manage your factory operations and streamline your
          documentation processes.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link href={`/${params.factoryid}/factorymanagement`} passHref>
          <Card className="bg-white dark:bg-card h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                Factory Management
              </CardTitle>
              <FiBriefcase className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3 flex-grow">
              <CardDescription className="text-base text-gray-600">
                Your complete solution for handling inventory, tracking
                production, and optimizing operations.
              </CardDescription>
              <p className="text-sm text-gray-700">
                Monitor raw materials, manage blocks and slabs, and track
                production phases with real-time insights.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/documentation/dashboard" passHref>
          <Card className="bg-white dark:bg-card h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                Documentation
              </CardTitle>
              <FiFileText className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3 flex-grow">
              <CardDescription className="text-base text-gray-600">
                Simplify and organize your business documentation with ease.
              </CardDescription>
              <p className="text-sm text-gray-700">
                Generate, store, and access critical documents such as invoices,
                export papers, and shipment details.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/settings" passHref>
          <Card className="bg-white dark:bg-card h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Settings</CardTitle>
              <FiSettings className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3 flex-grow">
              <CardDescription className="text-base text-gray-600">
                Customize your preferences and manage account settings.
              </CardDescription>
              <p className="text-sm text-gray-700">
                Adjust notification settings, update profile information, and
                more.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </main>
  );
}
