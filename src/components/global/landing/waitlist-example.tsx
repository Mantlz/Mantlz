"use client"
import { WaitlistForm } from '@mantlz/nextjs';
// import { useState } from 'react';

export function WaitlistExample() {
  // const [email, setEmail] = useState('');
  // const [submitted, setSubmitted] = useState(false);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setSubmitted(true);
  //   setTimeout(() => setSubmitted(false), 3000);
  // };

  return (
    <div className="animate-float -rotate-12">
      {/* <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl p-4 border border-zinc-200 dark:border-zinc-700 max-w-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Waitlist Form Example</span>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">Get early access</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
              Join the waitlist to get early access to the platform.
            </p>
          </div>
          
          {submitted ? (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-md text-sm">
              Thanks for joining! We'll be in touch soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-sm text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors cursor-pointer"
              >
                Join Waitlist
              </button>
            </form>
          )}
          
          <div className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
            <span className="font-medium">1,234</span> people have joined
          </div>
        </div> */}

        <WaitlistForm
        formId="cma2jhe2n0001o7raoveu0bcv"
        showUsersJoined={true}
        theme="neobrutalism"

        />


      {/* </div> */}
    </div>
  );
} 