"use client";

import { NAME } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import MobileSidebar from "./mobile-sidebar";
import { NavigationMenuLanding } from "./navigation-menu";
import { useUser } from "@clerk/clerk-react";

export const LandingNavbar = () => {
    const { user } = useUser();
    const Name = NAME;

    return (
        <nav className="py-4 bg-[#FFFFFF] border">
            <div className="flex items-center justify-between lg:mx-[10%] mx-[5%]">
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
                    <NavigationMenuLanding />
                </div>
                <div className="hidden sm:flex items-center gap-x-2">
                    <Link href={"/dashboard"}>
                        <Button variant="outline" className="rounded-lg">
                            {user ? "Ir a Tablero" : "Regístrate gratis"}
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}