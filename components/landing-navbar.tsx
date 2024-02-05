"use client";

import { NAME, cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"
import MobileSidebar from "./mobile-sidebar";
  

export const LandingNavbar = () => {
    const Name = NAME;
    return (
        <nav className="py-4 bg-[#FFFFFF] border">
            <div className="flex items-center justify-between lg:mx-[15%] mx-[5%]">
                <div className="flex items-center">
                    <main>
                        <MobileSidebar />
                    </main>
                    <Link href="/dashboard" className="flex items-center mr-3">
                        <div className="relative h-12 w-12 mr-4">
                            <Image
                                fill
                                alt="Logo"
                                src="/logo.svg"    
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-[#38322C] font-roobert">
                            {Name}
                        </h1>
                    </Link>
                    <NavigationMenu className="hidden xl:flex xl:flex-col">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>About Us</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                hola
                                <NavigationMenuLink href="/dashboard">Solutions</NavigationMenuLink>
                            </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                hola
                                <NavigationMenuLink href="/dashboard">Link</NavigationMenuLink>
                            </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Pricing</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                hola
                                <NavigationMenuLink href="/dashboard">Link</NavigationMenuLink>
                            </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                hola
                                <NavigationMenuLink href="/dashboard">Link</NavigationMenuLink>
                            </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <div className="hidden sm:flex items-center gap-x-2">
                    <Link href={"/dashboard"}>
                        <Button variant="outline" className="rounded-lg">
                            Sign up free
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}

