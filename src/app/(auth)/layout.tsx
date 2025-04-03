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
                className="absolute top-6 left-6 z-10 p-1 rounded-md cursor-pointer hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors"
            >
                <p className="text-lg font-bold text-zinc-900 tracking-tighter dark:text-zinc-100 ">Mantlz</p>
            </a>

            <div className="w-full lg:w-1/2 flex flex-col min-h-screen">

                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        <div>
                            {children}
                        </div>
                    </div>
                </div>
                
    
                <div className="p-6">
                    <AuthFooter />
                </div>
            </div>

            <AuthPreview />
        </div>
    );
};

export default Layout;