import Footer from "@/components/global/landing/footer";
import Navbar from "@/components/global/landing/navbar";
import React from "react";

type Props = {children: React.ReactNode}

const Layout = ({children}: Props) => {
  return (
    <div className="dark:text-white bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow mt-32 mb-4 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Layout