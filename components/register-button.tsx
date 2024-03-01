"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export const DashboardButton = () => {
    const { user } = useUser();
    return (
        <Link href="/dashboard">
            <Button variant="outline" className="md:text-lg p-4 md:p-6 font-normal">
                {user ? "Ir al Tablero" : "Regístrate gratis"}
            </Button>
        </Link>
    );
}