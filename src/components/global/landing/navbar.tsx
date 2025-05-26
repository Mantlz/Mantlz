"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  User,
  LogOut,

}
 from "lucide-react";
import {
  useUser,

  useClerk,
  useAuth,
} from "@clerk/nextjs";
import { Logo } from "@/components/global/logo";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMediaQuery } from "@/hooks/user-media-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export function Navbar() {
  const { user } = useUser(); // Use for user details when available
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth(); // Use for primary auth state

  const { signOut, openUserProfile } = useClerk();
  const { isMobile } = useMediaQuery();
  const [open, setOpen] = useState(false);
  // Removed 'mounted' and 'hasClerkCookie'

  // Close drawer when switching from mobile to desktop
  useEffect(() => {
    if (!isMobile && open) {
      setOpen(false);
    }
  }, [isMobile, open]);

  // Render the appropriate auth section
  const renderAuthSection = () => {
    // If auth state is not yet loaded
    // During this phase, we don't know definitively if the user
    // will be signed in or out after hydration.
    // The skeleton is appropriate *only* if we anticipate a user
    // might be signed in (which is the typical hydration scenario
    // where you see the flicker).
    // If Clerk finishes loading and the user is NOT signed in,
    // we immediately show the "Sign In" button below.
    if (!isAuthLoaded) {
      // Show skeleton only while Clerk is loading initially.
      // This placeholder bridges the gap until Clerk determines
      // if the user is signed in or out.
       return (
        <div className="flex items-center space-x-4">
          {/* Dashboard button placeholder */}
          <Skeleton className="h-9 w-24" />
          {/* Avatar placeholder */}
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      );
    }

    // If auth state is loaded AND user is signed in
    if (isSignedIn) {
      return (
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="flex items-center text-sm font-medium"
          >
            <Button 
              size="sm" 
              className="bg-orange-900 hover:bg-orange-800 dark:bg-orange-950 dark:hover:bg-orange-900 text-white border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-200 text-sm "
            >
              Dashboard
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* Use user object from useUser(), which should be available if isSignedIn is true */}
              <Avatar className="h-8 w-8 cursor-pointer bg-white rounded-full ring-2 ring-zinc-500 dark:ring-zinc-950 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2">
                <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
                <AvatarFallback>
                  {user?.firstName?.[0] || user?.lastName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2 p-2 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-start gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
                  <AvatarFallback>
                    {user?.firstName?.[0] || user?.lastName?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.fullName || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => openUserProfile()}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Manage Account</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut()}
                
                className="cursor-pointer bg-orange-900 hover:bg-orange-800 text-white dark:bg-orange-950 dark:hover:bg-orange-900"
              >
                <LogOut className="mr-2 h-4 w-4 text-white" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }

    // If auth state is loaded AND user is NOT signed in
    // This is the state reached after the initial loading phase (!isAuthLoaded)
    // if no session was found, or if the user explicitly signed out.
    return (
      <div className="flex items-center gap-4">
        <Link href="/sign-in" className="text-sm font-medium text-zinc-950 hover:text-zinc-700 dark:text-white dark:hover:text-zinc-300">
          Sign in
        </Link>
        <Link href="/sign-up">
          <Button size="sm" 
          className="flex items-center gap-1 bg-orange-900 hover:bg-orange-800 dark:bg-orange-950 dark:hover:bg-orange-900 text-white border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-200 text-sm ">
            Sign up 
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <nav className="flex items-center justify-between pt-10">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <Logo className="h-8 w-8" size={32} />
          <span className="font-light text-lg">Mantlz</span>
        </Link>
      </div>

      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-4">
            <div className="flex flex-col space-y-4 mt-2">
              <MobileNavLink href="/" isActive>
                Home
              </MobileNavLink>
              <MobileNavLink href="#features">Features</MobileNavLink>
              <MobileNavLink href="#pricing">Pricing</MobileNavLink>
              <MobileNavLink href="#faq">FAQ</MobileNavLink>
              <MobileNavLink href="https://doc.mantlz.app" target="_blank">
                Docs
              </MobileNavLink>
              <MobileNavLink href="https://mantlz.featurebase.app/changelog" target="_blank">
                Changelog
              </MobileNavLink>

             {/* Mobile Drawer Auth Content based on auth state */}
              {!isAuthLoaded ? (
                 // Show skeleton placeholders while loading in mobile drawer
                 <div className="flex flex-col space-y-2 mt-2">
                    <Skeleton className="h-6 w-full" /> {/* Dashboard link */}
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center">
                           <Skeleton className="h-8 w-8 rounded-full mr-2" />
                           <Skeleton className="h-5 w-20" />
                        </div>
                        <Skeleton className="h-8 w-20" /> {/* Sign out button */}
                    </div>
                 </div>
              ) : isSignedIn ? (
                 // Render SignedIn content if auth is loaded and user is in
                 <>
                   <MobileNavLink href="/dashboard">Dashboard</MobileNavLink>
                    <div className="pt-2 flex items-center justify-between">
                      <div className="flex items-center">
                         {/* Use user object from useUser() */}
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
                          <AvatarFallback>
                            {user?.firstName?.[0] || user?.lastName?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {user?.fullName || "User"}
                        </span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => signOut()}
                      >
                        Sign out
                      </Button>
                    </div>
                 </>
              ) : (
                 // Render SignedOut content if auth is loaded and user is out
                 <div className="flex flex-col space-y-3 mt-2">
                   <DrawerClose asChild>
                     <Link href="/sign-in" className="text-base py-2 text-gray-600 dark:text-gray-400">
                       Sign in
                     </Link>
                   </DrawerClose>
                   <DrawerClose asChild>
                     <Link href="/sign-up">
                       <Button size="sm" 
                       className="w-full flex items-center justify-center gap-1 dark:text-white bg-orange-900 hover:bg-orange-800 dark:bg-orange-950 dark:hover:bg-orange-900 text-white border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-200 text-sm ">
                         Sign up 
                       </Button>
                     </Link>
                   </DrawerClose>
                 </div>
              )}

            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        // Desktop Navigation
        <>
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/" active>
              Home
            </NavLink>
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#faq">FAQ</NavLink>
            <NavLink href="https://doc.mantlz.app" target="_blank">Docs</NavLink>
            <NavLink href="https://mantlz.featurebase.app" target="_blank">Changelog</NavLink>
          </div>
          {/* Render Auth Section using the refined logic */}
          <div>{renderAuthSection()}</div>
        </>
      )}
    </nav>
  );
}

// Helper component for Desktop Nav Links
interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

function NavLink({ href, children, active, target, ...props }: NavLinkProps) {
  return (
    <Link
      href={href}
      target={target}
      className={`text-sm font-medium transition-colors hover:text-orange-900 dark:hover:text-orange-800 ${
        active
          ? "text-orange-900 dark:text-orange-900"
          : "text-zinc-600 dark:text-zinc-400"
      }`}
      {...props}
    >
      {children}
    </Link>
  );
}

// Helper component for Mobile Nav Links in Drawer
interface MobileNavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}

function MobileNavLink({
  href,
  children,
  isActive,
  target,
  ...props
}: MobileNavLinkProps) {
  return (
    <DrawerClose asChild>
      <Link
        href={href}
        target={target}
        className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
            : "text-zinc-600 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400"
        }`}
        {...props}
      >
        {children}
      </Link>
    </DrawerClose>
  );
}
