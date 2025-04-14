"use client"

import { SignIn } from "@clerk/nextjs"
import { useSearchParams } from "next/navigation"
import { dark } from "@clerk/themes";

export default function Page() {

  
  return (
    <div className="flex text-center justify-center">
      <SignIn 
        fallbackRedirectUrl="/welcome-back" 
        forceRedirectUrl="/welcome-back" 
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: "#2a2a2a",
            colorBackground: "#000000",
            colorInputBackground: "#1a1a1a",
            colorText: "#ffffff",
            colorInputText: "#ffffff",
            borderRadius: "0.2rem",
          },
          elements: {
            card: "shadow-md border border-zinc-950 rounded-lg text-white",
            formButtonPrimary: "bg-white hover:bg-gray-200 text-black text-sm normal-case font-semibold rounded-none shadow-sm",
            headerTitle: "text-2xl font-semibold font-sans text-white",
            headerSubtitle: "text-gray-400 font-sans",
            socialButtonsBlockButton: "border border-zinc-600 hover:bg-gray-800 font-sans rounded-lg text-white",
            footerActionLink: "text-gray-300 hover:text-white font-semibold"
          }
        }}
      />
    </div>
  )
}