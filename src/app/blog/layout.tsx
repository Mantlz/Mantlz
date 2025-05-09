import Footer from "@/components/global/landing/footer";
import {Navbar} from "@/components/global/landing/navbar";
import { Container } from "@/components/global/landing/container";
import React from "react";

type Props = {children: React.ReactNode}

const Layout = ({children}: Props) => {
  return (
    <div className="min-h-screen dark:text-white dark:bg-zinc-950 transition-colors duration-300">
      <Container>
        <Navbar />
      </Container>
      
      <main className="flex-grow py-16">
        <Container>
          {children}
        </Container>
      </main>

      <Footer />
    </div>
  )
}

export default Layout