import React from "react";

type Props = {children: React.ReactNode}

const Layout = ({children}: Props) => {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <main className="w-full max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  )
}

export default Layout