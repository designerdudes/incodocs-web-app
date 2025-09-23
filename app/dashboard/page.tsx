'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
// import MainDashboardComponent from '../(routes)/[organizationId]/components/MainDashboardComponent';
import UserData from '../(routes)/[organizationId]/components/UserData';
import MainDashboardComponent from '../(routes)/[organizationId]/components/MainDashboardComponent';
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

export default async function Page() {
  // Get the access token from cookies
  const cookieStore = cookies();
  const token = cookieStore.get('AccessToken')?.value;

  // Redirect to login if no token
  if (!token) {
    redirect('/login');
  }

  // Fetch user data
  try {
    const res = await fetchWithAuth<any>("/user/currentUser");

    const userData = res;

    return <MainDashboardComponent token={token} userData={userData} />;
  } catch (error) {
    console.error('Error fetching user data:', error);
    redirect('/login'); // Redirect on error
  }
}