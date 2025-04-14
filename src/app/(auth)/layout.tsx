import React from "react";

type Props = {children: React.ReactNode}

const Layout = ({children}: Props) => {
  return (

      <main className="h-screen w-screen flex items-center bg-gradient-to-br from-zinc-800 via-zinc-200 to-zinc-800 justify-center p-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>


  )
}

export default Layout