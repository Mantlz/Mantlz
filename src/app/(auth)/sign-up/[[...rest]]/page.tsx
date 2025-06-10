"use client";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const Page = () => {
  return (
    <main className="h-screen w-screen flex items-center bg-zinc-800 justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex text-center justify-center">
          <SignUp 
            fallbackRedirectUrl="/welcome" 
            forceRedirectUrl="/welcome" 
            appearance={{
              baseTheme: dark,
              variables: {
                colorPrimary: "#3f3f46",
                colorBackground: "#27272a",
                colorInputBackground: "#3f3f46",
                colorText: "#ffffff",
                colorInputText: "#ffffff",
                borderRadius: "0.5rem",
              },
              elements: {
                card: "shadow-lg border border-zinc-700 rounded-xl text-white",
                formButtonPrimary: "bg-zinc-200 hover:bg-zinc-300 text-zinc-900 text-sm normal-case font-medium rounded-lg shadow-sm transition-colors",
                headerTitle: "text-2xl font-semibold font-sans text-white",
                headerSubtitle: "text-zinc-400 font-sans",
                socialButtonsBlockButton: "border border-zinc-700 hover:bg-zinc-700 font-sans rounded-lg text-white transition-colors",
                footerActionLink: "text-zinc-400 hover:text-white font-medium transition-colors"
              }
            }}
          />
        </div>
      </div>
    </main>
  );
};

export default Page;
