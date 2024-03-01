"use client";

import Link from "next/link"
import { Button } from "./ui/button"
import { useUser } from "@clerk/nextjs";

interface BlogStructureProps {
    title: string;
    description: string;
}

export const BlogStructure = ({
    title,
    description
}: BlogStructureProps) => {
    const { user } = useUser();
    
    return (
        <div className="text-[#1c1c1e] font-normal pt-28 space-y-5 lg:mx-[25%] md:mx-[15%] mx-[5%]">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 text-center">
                <h1>
                    {title}
                </h1>
            </div>
            <div className="text-sm md:text-xl font-normal text-zinc-800 mx-auto text-center">
                {description}
            </div>
            <div className="text-center ">
                <Link href={"/dashboard"}>
                    <Button variant="outline" className="md:text-lg p-4 md:p-6 font-normal">
                        {user ? "Ir al Tablero" : "Regístrate gratis"}
                    </Button>
                </Link>
            </div>
            <div className="text-zinc-400 text-xs md:text-sm font-normal text-center">
                No se requiere tarjeta de crédito
            </div>
        </div>
    )
}