import React from "react";

type Props = {children: React.ReactNode}

// export const metadata = constructMetadata();


const Layout = ({children}: Props) => {
  return (
    <main className="h-screen w-screen flex items-center bg-zinc-800 justify-center p-6">
      <div className="w-full max-w-md">
        {children}
      </div>
    </main>
  )
}

export default Layout