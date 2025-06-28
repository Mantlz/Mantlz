"use client";
import { Mantlz } from "@mantlz/nextjs";

export default function CustomerFeedbackPage() {
  return (
    <div className="min-h-screen w-full  flex items-center justify-center py-8 px-4">
      <div className="flex flex-row items-center justify-center gap-4 flex-wrap">
        <Mantlz
          formId="cmcf2mb690001o7ro57d031kj"
          theme="neobrutalism"
          showUsersJoined={true}
          usersJoinedCount={100000}
          usersJoinedLabel="Users already joined"
         // redirectUrl="https://example.com"
          // appearance={{
          //   baseTheme: "light",
          //   variables: {
          //     colorText: "#6b21a8",
          //     fontWeight: "600",
          //     colorPrimary: "#8b5cf6",
          //     colorBackground: "#faf5ff p-2",
          //     colorInputBackground: "#ffffff p-2",
          //     colorInputText: "#581c87",
          //     colorError: "#dc2626",
          //     colorSuccess: "#059669",
          //     borderRadius: "12px",
          //     fontFamily: "Inter, system-ui, sans-serif",
          //     fontSize: "14px",
          //   },
          //   elements: {
          //     card: "shadow-xl border border-purple-500 bg-gradient-to-br from-purple-500  to-violet-500 p-2",
          //     formTitle:
          //       "text-3xl font-bold text-purple-900 mb-3 bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent",
          //     //formDescription: 'text-purple-700 mb-6 leading-relaxed',
          //     formLabel:
          //       "text-purple-800 font-semibold mb-2 text-sm uppercase tracking-wide",
          //     formInput:
          //       "border-purple-300 focus:border-purple-500 focus:ring-purple-500 focus:ring-2 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm",
          //     formButton:
          //       "bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 hover:from-purple-600 hover:via-violet-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-purple-500/25",
          //     usersJoined:
          //       "text-purple-700 font-bold bg-gradient-to-r from-purple-500 to-violet-900 px-2 py-1 rounded-lg inline-block shadow-sm border border-purple-200",
          //   },
          // }}
        />

        <Mantlz
          formId="cmccb5j5s0007o7fkgkb2d6fw"
          theme="neobrutalism"
          showUsersJoined={true}
          usersJoinedCount={100000}
          usersJoinedLabel="Users already joined"
          // redirectUrl="https://example.com"
        />

        <Mantlz
          formId="cmccb5j5s0007o7fkgkb2d6fw"
          showUsersJoined={true}
          usersJoinedCount={100000}
          usersJoinedLabel="Users already joined"
          theme="default"
        />

        <Mantlz
          formId="cmccb5j5s0007o7fkgkb2d6fw"
          showUsersJoined={true}
          usersJoinedCount={100000}
          usersJoinedLabel="Users already joined"
          theme="simple"
        />

        <Mantlz
          formId="cmccb5j5s0007o7fkgkb2d6fw"
          showUsersJoined={true}
          usersJoinedCount={100000}
          usersJoinedLabel="Users already joined"
          theme="modern"
        />
      </div>
    </div>
  );
}
