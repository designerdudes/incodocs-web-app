"use client"
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 max-w-lg">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Oops! Page Lost in Transit</h2>
        <p className="text-gray-600 mb-8">
          The page you&apos;re looking for seems to have been misplaced on the factory floor. 
          Don&apos;t worry, our team is searching the warehouse for it!
        </p>

        {/* Conveyor Belt Animation */}
        <div className="relative w-full h-24 bg-gray-300 rounded-lg overflow-hidden mb-8">
          <div className="flex space-x-4 absolute top-0 left-0 h-full animate-conveyor">
            <div className="w-32 h-16 bg-blue-500 rounded-md mt-4"></div>
            <div className="w-32 h-16 bg-green-500 rounded-md mt-4"></div>
            <div className="w-32 h-16 bg-red-500 rounded-md mt-4"></div>
            <div className="w-32 h-16 bg-yellow-500 rounded-md mt-4"></div>
            <div className="w-32 h-16 bg-blue-500 rounded-md mt-4"></div>
            <div className="w-32 h-16 bg-green-500 rounded-md mt-4"></div>
            <div className="w-32 h-16 bg-red-500 rounded-md mt-4"></div>
            <div className="w-32 h-16 bg-yellow-500 rounded-md mt-4"></div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">Try this options to get back on track:</p>
          <div className="flex justify-center space-x-4">
            <Link href="/dashboard">
            <Button>
              Back to Dashboard
            </Button>
            </Link>
          
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes conveyor {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-conveyor {
          animation: conveyor 10s linear infinite;
        }
      `}</style>
    </div>
  );
}