import React from "react";

type Props = {children: React.ReactNode}

const Layout = ({children}: Props) => {
  return (
    <div className="h-full flex items-center justify-center">
      <main className="w-full max-w-md">
        {children}
      </main>
    </div>
  )
}

export default Layout