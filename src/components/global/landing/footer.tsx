"use client"
import { TextHoverEffectDemo } from "@/components/global/textHoverEffect"
import { Logo } from "@/components/global/logo"
import { Container } from "./container"
import { StatusButton } from "./status-button"
import { Mail, ExternalLink, Github, Twitter } from "lucide-react"

const Footer = () => {
  return (
    <footer className="relative w-full border-t border-zinc-200 dark:border-zinc-800  text-zinc-600 dark:text-zinc-400 py-16">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-zinc-200/30 dark:bg-zinc-800/20 rounded-full blur-3xl transform translate-y-1/2 -translate-x-1/4 opacity-50"></div>
      </div>
      
      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Logo and description */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2 mb-2">
              <Logo  className="mb-1 "size={24}/>
              <p className="text-xl font-bold text-zinc-800 dark:text-white">Mantlz</p>
            </div>
            <p className="text-sm text-center md:text-left mb-6">The best way to create and manage forms</p>
            <StatusButton />
          </div>

          {/* Quick links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-4">Quick Links</h3>
            <nav className="flex flex-col items-center md:items-start space-y-3">
              <a
                href="mailto:contact@mantlz.com"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors flex items-center group"
              >
                <Mail className="h-4 w-4 mr-2 text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-white transition-colors" />
                contact@mantlz.com
              </a>
              <a
                href="/privacy-policy"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors flex items-center group"
              >
                <ExternalLink className="h-4 w-4 mr-2 text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-white transition-colors" />
                Privacy Policy
              </a>
              <a
                href="/terms-of-service"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors flex items-center group"
              >
                <ExternalLink className="h-4 w-4 mr-2 text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-white transition-colors" />
                Terms of Service
              </a>
              <a
                href="/gdpr"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors flex items-center group"
              >
                <ExternalLink className="h-4 w-4 mr-2 text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-white transition-colors" />
                GDPR
              </a>
            </nav>
          </div>

          {/* Social links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/yvesdalyy"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/artistatbl"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all duration-200"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-500 dark:text-zinc-500">
          <p>&copy; 2024 Mantlz. All rights reserved.</p>
        </div>

        <div className="mt-6 flex justify-center">
          <TextHoverEffectDemo />
        </div>
      </Container>
    </footer>
  )
}

export default Footer

