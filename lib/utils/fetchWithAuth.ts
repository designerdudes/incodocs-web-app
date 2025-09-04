"use server";

import { cookies } from "next/headers";

export async function fetchWithAuth<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    // Automatically get token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get("AccessToken")?.value;

    if (!token) {
      throw new Error("No access token found. Please login again.");
    }

    const res = await fetch(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}), // allow override
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: "no-store", // ensures fresh data in Next.js server components
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Request failed: ${res.status} ${res.statusText} - ${errorText}`
      );
    }

    if (res.status === 204) {
      return null as T;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error("fetchWithAuth error:", error);
    throw error;
  }
}
