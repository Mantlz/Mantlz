import React from "react";

type Props = {children: React.ReactNode}

const Layout = ({children}: Props) => {
  return (

      <main className="h-screen w-screen flex items-center bg-gradient-to-br from-zinc-950 via-zinc-500 to-zinc-950 justify-center p-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>


  )
}

export default Layout