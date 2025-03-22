import { ReactNode } from "react";
import { Home } from "lucide-react";
import AuthPreview from "@/components/auth/auth-preview";
import AuthFooter from "@/components/auth/auth-footer";

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex min-h-screen">
            {/* Home Icon */}
            <a 
                href="/" 
                className="absolute top-6 left-6 z-10 p-2 rounded-full hover:bg-slate-800/50 transition-colors"
            >
                <Home className="w-6 h-6 text-black dark:text-white" />
            </a>

            {/* Left side - Auth Form */}
            <div className="w-full lg:w-1/2 flex flex-col min-h-screen">
                {/* Center content */}
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        {/* Auth card */}
                        <div className="rounded-xl border border-zinc-200 bg-black dark:bg-white p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)]">
                            {children}
                        </div>
                    </div>
                </div>
                
                {/* Footer at bottom */}
                <div className="p-6">
                    <AuthFooter />
                </div>
            </div>

            <AuthPreview />
        </div>
    );
};

export default Layout;