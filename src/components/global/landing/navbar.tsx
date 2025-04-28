"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  ChevronRight,
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
            <Button size="sm" className="flex items-center gap-1">
              Dashboard
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* Use user object from useUser(), which should be available if isSignedIn is true */}
              <Avatar className="h-8 w-8 cursor-pointer bg-white rounded-full ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
                <AvatarFallback>
                  {user?.firstName?.[0] || user?.lastName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
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
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
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
      <Link href="/signin" className="flex items-center text-sm font-medium">
        Sign in <ChevronRight className="h-4 w-4 ml-1" />
      </Link>
    );
  };

  return (
    <nav className="flex items-center justify-between pt-10">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <Logo className="h-8 w-8" size={32} />
          <span className="font-semibold text-lg">Mantlz</span>
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
              <MobileNavLink href="/solution">Solution</MobileNavLink>
              <MobileNavLink href="/features">Features</MobileNavLink>
              <MobileNavLink href="/pricing">Pricing</MobileNavLink>
              <MobileNavLink href="/resources">Resources</MobileNavLink>

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
                 <>
                  <DrawerClose asChild>
                    <Link
                      href="/signin"
                      className="flex items-center mt-2 font-medium"
                    >
                      Sign in <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </DrawerClose>
                </>
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
            <NavLink href="/solution">Solution</NavLink>
            <NavLink href="/features">Features</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
            <NavLink href="/resources">Resources</NavLink>
          </div>
          {/* Render Auth Section using the refined logic */}
          <div>{renderAuthSection()}</div>
        </>
      )}
    </nav>
  );
}

// Helper component for Desktop Nav Links
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

function NavLink({ href, children, active }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`text-sm ${
        active ? "font-medium" : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {children}
    </Link>
  );
}

// Helper component for Mobile Nav Links in Drawer
function MobileNavLink({
  href,
  children,
  isActive,
}: {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}) {
  return (
    <DrawerClose asChild>
      <Link
        href={href}
        className={`text-base py-2 ${isActive ? "font-medium" : "text-gray-600"}`}
      >
        {children}
      </Link>
    </DrawerClose>
  );
}
