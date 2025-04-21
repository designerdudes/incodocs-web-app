'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import UserData from '../(routes)/[organizationId]/components/UserData';

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
    const res = await fetch('https://incodocs-server.onrender.com/user/currentUser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userData = await res.json();
    console.log('User Data:', userData); // Logs to server console

   
    return <UserData token={token} userData={userData} />;
  } catch (error) {
    console.error('Error fetching user data:', error);
    redirect('/login'); // Redirect on error
  }
}