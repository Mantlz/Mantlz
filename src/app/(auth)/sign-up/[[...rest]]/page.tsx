"use client";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const Page = () => {
  return (
    <div className="flex text-center justify-center">
      <SignUp 
        fallbackRedirectUrl="/welcome" 
        forceRedirectUrl="/welcome" 
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
            headerSubtitle: "text-gray-200 font-sans",
            socialButtonsBlockButton: "border border-zinc-200 hover:bg-gray-600 font-sans rounded-lg text-white",
            footerActionLink: "text-white hover:text-white font-semibold"
          }
        }}
      />
    </div>
  );
};

export default Page;
