import Footer from "@/components/global/landing/footer";
import {Navbar} from "@/components/global/landing/navbar";
import { Container } from "@/components/global/landing/container";
import React from "react";

type Props = {children: React.ReactNode}

const Layout = ({children}: Props) => {
  return (
    <div className=" bg-white flex flex-col dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors duration-300">
        <Container>

      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>
        </Container>
      <Footer />
    </div>
  )
}

export default Layout