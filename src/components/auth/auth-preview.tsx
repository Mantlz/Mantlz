export default function AuthPreview() {
    return (
        <div className="hidden lg:block lg:w-1/2 fixed right-0 top-0 bottom-0  p-8">
            {/* Container with height constraint and centering */}
            <div className="bg-zinc-900 h-[calc(100vh-4rem)] rounded-2xl flex items-center">
                {/* Content container */}
                <div className="w-full px-8">
                    {/* Preview Content */}
                    <div className="space-y-6 max-w-xl mx-auto">
                        <div className="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700">
                            <h2 className="text-2xl font-semibold text-white mb-2">Transform Data into Cool Insights</h2>
                            <p className="text-slate-300">
                                Make informed decisions with our powerful analytics tools. Harness the power of data to drive your business forward.
                            </p>
                        </div>

                        {/* Analytics Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-800/50 rounded-xl p-4 backdrop-blur-sm border border-slate-700">
                                <div className="text-sm text-slate-400">Sales Target</div>
                                <div className="text-2xl font-semibold text-white">3,415</div>
                                <div className="text-sm text-green-400">+20% from last month</div>
                            </div>
                            
                            <div className="bg-slate-800/50 rounded-xl p-4 backdrop-blur-sm border border-slate-700">
                                <div className="text-sm text-slate-400">Conversion Rate</div>
                                <div className="text-2xl font-semibold text-white">75.3%</div>
                                <div className="text-sm text-green-400">+2.4% increase</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 