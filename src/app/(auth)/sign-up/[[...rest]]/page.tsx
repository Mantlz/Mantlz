"use client"

import { SignUp } from "@clerk/nextjs"

const Page = () => {
  return (

    <div className="flex text-center justify-center">

      <SignUp fallbackRedirectUrl="/welcome" forceRedirectUrl="/welcome" />
    </div>
   
  )
}

export default Page 