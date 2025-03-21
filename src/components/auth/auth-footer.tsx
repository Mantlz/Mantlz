export default function AuthFooter() {
    return (
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-white">
            {/* Copyright on left */}
            <p className="">
                © 2024 Mantle Inc. All rights reserved.
            </p>

            {/* Links on right */}
            <div className="flex items-center space-x-4">
                <a href="/privacy" className="hover:text-blue-500">Privacy Policy</a>
                <span className="text-black  dark:text-white">•</span>
                <a href="/terms" className="hover:text-blue-500 ">Term & Condition</a>
            </div>
        </div>
    );
} 