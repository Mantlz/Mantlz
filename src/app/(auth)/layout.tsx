import { ReactNode } from "react";

import Navbar from "@/components/global/landing/navbar";

const Layout = ({ children}: { children: ReactNode}) => {
    return (
        <>
         <Navbar />
        <div className="min-h-screen flex flex-col">
           
            <main className="flex-1 flex items-center justify-center px-4 py-8 mt-16">
                <div className="w-full max-w-6xl">
                    {children}
                </div>
            </main>
        </div>
        </>
    )
}
export default Layout