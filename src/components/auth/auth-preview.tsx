export default function AuthPreview() {
    return (
      <div className="hidden lg:block lg:w-1/2 fixed right-0 top-0 bottom-0 p-8">
        {/* Container with height constraint and centering */}
        <div className="bg-zinc-900 h-[calc(100vh-4rem)] rounded-2xl flex items-center overflow-hidden relative">
          {/* Enhanced background with more subtle gradients */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-zinc-950"></div>
            <div className="absolute inset-0 bg-gradient-radial from-violet-500/10 to-transparent opacity-40"></div>
            <div className="absolute -top-[30%] -right-[20%] w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-3xl"></div>
            <div className="absolute top-[60%] -left-[10%] w-[400px] h-[400px] rounded-full bg-violet-500/10 blur-3xl"></div>
            <div className="absolute top-[30%] left-[50%] w-[300px] h-[300px] rounded-full bg-violet-400/5 blur-2xl"></div>
          </div>
  
          {/* Improved watermark with better spacing and opacity */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
            <div
              className="absolute rotate-[-45deg] origin-center"
              style={{
                width: "200%",
                height: "60px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="w-full text-center overflow-visible whitespace-nowrap">
                {Array(20)
                  .fill(0)
                  .map((_, i) => (
                    <span
                      key={i}
                      className="inline-block text-[80px] font-black text-white/[0.02] tracking-tighter px-2 select-none"
                      style={{ letterSpacing: "-0.05em" }}
                    >
                      mantlz
                    </span>
                  ))}
              </div>
            </div>
          </div>
  
          {/* Main content area with improved card layout and animations */}
          <div className="absolute inset-0 z-10 py-6 px-4 md:py-8 md:px-10 flex items-center">
            <div className="relative w-full max-w-md mx-auto">
              <div className="flex flex-col space-y-5 relative z-10">
                {/* Form analytics card - with improved styling */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10 shadow-[0_10px_25px_rgba(0,0,0,0.3)] transform rotate-[-1deg] translate-x-2 hover:translate-y-[-8px] hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)] transition-all duration-500">
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-xs font-medium text-white flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 mr-1.5 text-zinc-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      Feedback Form
                    </h3>
                    <div className="text-xs px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full font-medium">
                      Active
                    </div>
                  </div>
  
                  {/* Analytics Stats with improved contrast */}
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                      <div className="text-xs text-slate-300 mb-0.5">Submissions</div>
                      <div className="text-lg font-semibold text-white">20</div>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                      <div className="text-xs text-slate-300 mb-0.5">Last 24h</div>
                      <div className="text-lg font-semibold text-white">7</div>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                      <div className="text-xs text-slate-300 mb-0.5">Completion</div>
                      <div className="text-lg font-semibold text-white">91%</div>
                    </div>
                  </div>
                </div>
  
                {/* API Documentation card with improved code display */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10 shadow-[0_12px_28px_rgba(0,0,0,0.35)] transform rotate-[0.7deg] -translate-x-1 hover:translate-y-[-8px] hover:shadow-[0_18px_35px_rgba(0,0,0,0.45)] transition-all duration-500">
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-xs font-medium text-white flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 mr-1.5 text-zinc-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                      API Endpoints
                    </h3>
                    <div className="text-[10px] px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded-full font-medium">
                      v1
                    </div>
                  </div>
  
                  <div className="bg-zinc-900/70 rounded-lg p-2.5 mb-2.5 text-xs font-mono border border-white/5">
                    <div className="flex items-center text-green-400 mb-1.5">
                      <span className="text-white/70 mr-2 font-semibold">GET</span>
                      <span>/api/v1/forms</span>
                    </div>
                    <div className="flex items-center text-violet-400 mb-1.5">
                      <span className="text-white/70 mr-2 font-semibold">POST</span>
                      <span>/api/v1/forms/submit</span>
                    </div>
                    <div className="flex items-center text-yellow-400">
                      <span className="text-white/70 mr-2 font-semibold">GET</span>
                      <span>/api/v1/forms/{`{formId}`}</span>
                    </div>
                  </div>
  
                  <div className="text-[10px] text-white/80 leading-relaxed">
                    Create and manage forms with our REST API. Collect data, track submissions, and integrate with your
                    applications.
                  </div>
  
                  <div className="mt-2.5 flex justify-end">
                    <button className="text-[10px] px-3 py-1.5 bg-zinc-900 hover:bg-zinc-950 text-white rounded-md transition-colors shadow-lg font-medium">
                      View Documentation
                    </button>
                  </div>
                </div>
  
                {/* Usage card with improved progress bars */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.38)] transform rotate-[1deg] translate-x-1 hover:translate-y-[-8px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-500">
                  <div className="p-3.5 flex flex-row items-start justify-between">
                    <div>
                      <h3 className="text-xs font-medium text-white flex items-center">
                        Usage Information
                        <span className="ml-2 text-[10px] px-2 py-0.5 bg-zinc-900 hover:bg-zinc-950 text-white rounded-full font-medium">
                          PRO
                        </span>
                      </h3>
                      <p className="text-[10px] text-white/80 mt-0.5">Resets on April 15, 2025</p>
                    </div>
                    <button className="text-[10px] flex items-center text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Refresh
                    </button>
                  </div>
  
                  <div className="px-3.5 pb-3.5">
                    <div className="bg-white/5 p-2.5 rounded-lg mb-2.5 border border-white/5">
                      <div className="flex justify-between mb-1.5">
                        <div className="text-[10px] text-white/90 font-medium">Forms</div>
                        <div className="text-[10px] text-white/90 font-medium">32/50</div>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-900 rounded-full" style={{ width: "64%" }}></div>
                      </div>
                    </div>
  
                    <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                      <div className="flex justify-between mb-1.5">
                        <div className="text-[10px] text-white/90 font-medium">Submissions</div>
                        <div className="text-[10px] text-white/90 font-medium">1,457/5,000</div>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-900 rounded-full" style={{ width: "29%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
  
                {/* Waitlist form card with improved input styling */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10 shadow-[0_14px_28px_rgba(0,0,0,0.4)] transform rotate-[-0.5deg] -translate-x-2 hover:translate-y-[-8px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-500">
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-xs font-medium text-white">Waitlist Registration</h3>
                    <div className="text-[10px] px-2 py-0.5 bg-zinc-900 hover:bg-zinc-950 text-white rounded-full font-medium">
                      87 joined
                    </div>
                  </div>
  
                  <p className="text-[10px] text-white/80 mb-2.5 leading-relaxed">
                    Join our waitlist to get early access to our platform.
                  </p>
  
                  <div className="bg-white/5 rounded-lg p-2.5 mb-2.5 border border-white/5">
                    <label className="block text-[10px] text-slate-300 mb-1.5 font-medium">Email</label>
                    <input
                      type="email"
                      disabled
                      className="w-full bg-white/10 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-zinc-900/50 focus:border-zinc-900/50 transition-all"
                      placeholder="contact@mantlz.com"
                    />
                  </div>
  
                  <button className="w-full py-2 bg-zinc-900 hover:bg-zinc-950 text-xs text-white rounded-lg transition-colors shadow-lg font-medium">
                    Join Waitlist
                  </button>
                </div>
              </div>
  
              {/* Enhanced floating "Powered by" badge */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 z-20">
                <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-zinc-900 to-zinc-950 rounded-full shadow-lg border border-zinc-500/30">
                  <span className="text-[10px] text-white/90 font-medium">Powered by</span>
                  <span className="text-[11px] text-white font-bold ml-1">mantlz</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  