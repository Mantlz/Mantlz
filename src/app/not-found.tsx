import React from 'react';
import Footer from '@/components/global/landing/footer'
import { Navbar } from '@/components/global/landing/navbar'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
<>
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-white dark:bg-zinc-950 h-screen ">
        <div className="text-center px-4 py-10">
          <AlertCircle className="mx-auto text-red-500 w-16 h-16 mb-6" />
          <h1 className="text-4xl font-bold dark:text-gray-300  mb-4">Oops! Page Not Found</h1>
          <p className=" dark:text-gray-300 mb-8">The page you&apos;re looking for seems to have wandered off. Don&apos;t worry, it happens to the best of us!</p>
          <Link href="/" className="inline-block bg-zinc-800  text-white dark:bg-white dark:text-black  font-semibold px-6 py-3 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
            Return to Home
          </Link>
        </div>
      </main>
      <Footer />
</>

  )
}