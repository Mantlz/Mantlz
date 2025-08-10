"use client";
import { TextHoverEffectDemo } from "@/components/global/textHoverEffect";
import Image from "next/image";
import { Container } from "./container";
import { StatusButton } from "./status-button";
import { Mail, ExternalLink, Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative w-full border-t border-gray-200/50 dark:border-zinc-700/50 backdrop-blur-sm text-zinc-500 dark:text-zinc-400 py-16">
      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Logo and description */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2 mb-2 p-2 rounded-xl bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-zinc-800/80 dark:to-zinc-900/80 border border-gray-200/30 dark:border-zinc-700/30">
              <Image 
                src="/logo.png" 
                alt="Mantlz Logo" 
                width={24} 
                height={24} 
                className="mb-0.5" 
              />
              <p className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                Mantlz
              </p>
            </div>
            <p className="text-sm text-center md:text-left mb-6 text-gray-600 dark:text-zinc-500 leading-relaxed">
              The best way to create and manage forms
            </p>
            <StatusButton />
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-6">
              Quick Links
            </h3>
            <nav className="flex flex-col items-center md:items-start space-y-4">
              <a
                href="mailto:contact@mantlz.com"
                className="text-gray-600 hover:text-gray-900 dark:text-zinc-500 dark:hover:text-white transition-all duration-200 flex items-center group p-2 rounded-lg hover:bg-gradient-to-r hover:from-gray-100/50 hover:to-white/50 dark:hover:from-zinc-800/50 dark:hover:to-zinc-700/50"
              >
                <Mail className="h-4 w-4 mr-3 text-zinc-500 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
                <span className="font-medium">contact@mantlz.com</span>
              </a>
              <a
                href="/privacy-policy"
                className="text-gray-600 hover:text-gray-900 dark:text-zinc-500 dark:hover:text-white transition-all duration-200 flex items-center group p-2 rounded-lg hover:bg-gradient-to-r hover:from-gray-100/50 hover:to-white/50 dark:hover:from-zinc-800/50 dark:hover:to-zinc-700/50"
              >
                <ExternalLink className="h-4 w-4 mr-3 text-zinc-500 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
                <span className="font-medium">Privacy Policy</span>
              </a>
              <a
                href="/terms-of-service"
                className="text-gray-600 hover:text-gray-900 dark:text-zinc-500 dark:hover:text-white transition-all duration-200 flex items-center group p-2 rounded-lg hover:bg-gradient-to-r hover:from-gray-100/50 hover:to-white/50 dark:hover:from-zinc-800/50 dark:hover:to-zinc-700/50"
              >
                <ExternalLink className="h-4 w-4 mr-3 text-zinc-500 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
                <span className="font-medium">Terms of Service</span>
              </a>
              <a
                href="/gdpr"
                className="text-gray-600 hover:text-gray-900 dark:text-zinc-500 dark:hover:text-white transition-all duration-200 flex items-center group p-2 rounded-lg hover:bg-gradient-to-r hover:from-gray-100/50 hover:to-white/50 dark:hover:from-zinc-800/50 dark:hover:to-zinc-700/50"
              >
                <ExternalLink className="h-4 w-4 mr-3 text-zinc-500 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
                <span className="font-medium">GDPR</span>
              </a>
            </nav>
          </div>

          {/* Social links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-6">
              Connect
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/yvesdalyy"
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-zinc-800/80 dark:to-zinc-900/80 hover:from-orange-50 hover:to-orange-100 dark:hover:from-orange-900/20 dark:hover:to-orange-800/20 border border-gray-200/50 dark:border-zinc-700/50 hover:border-orange-300/50 dark:hover:border-orange-600/50 text-gray-600 hover:text-orange-600 dark:text-zinc-500 dark:hover:text-orange-400 transition-all duration-200 shadow-sm hover:shadow-md group"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://github.com/artistatbl"
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-zinc-800/80 dark:to-zinc-900/80 hover:from-orange-50 hover:to-orange-100 dark:hover:from-orange-900/20 dark:hover:to-orange-800/20 border border-gray-200/50 dark:border-zinc-700/50 hover:border-orange-300/50 dark:hover:border-orange-600/50 text-gray-600 hover:text-orange-600 dark:text-zinc-500 dark:hover:text-orange-400 transition-all duration-200 shadow-sm hover:shadow-md group"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200/50 dark:border-zinc-700/50 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-500 font-medium">
            &copy; 2024 Mantlz. All rights reserved.
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <TextHoverEffectDemo />
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
