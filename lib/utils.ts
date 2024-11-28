import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
  }).format(amount)
}
// A utility function to capitalize text
export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).replace(/-/g, " ");
}