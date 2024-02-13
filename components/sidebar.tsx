import { NAME } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const routes = [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Conversation",
        href: "/conversation",
    },
    {
        label: "Image Generation",
        href: "/image",
    },
    {
        label: "Video Generation",
        href: "/video",
    },
    {
        label: "Music Generation",
        href: "/music",
    },
    {
        label: "Code Generation",
        href: "/code",
    },
    {
        label: "Settings",
        href: "/settings",
    },
];

const Sidebar = ({
}) => {
    const Name = NAME;
    return ( 
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#FFF] text-black">
            <div className="p-3 py-2 flex-1">
                <div className="border-top p-3 font-medium flex items-center">
                    <Image
                        className="mr-2"
                        width={40}
                        height={40}
                        alt="Logo"
                        src="/logo.svg"    
                    />
                    <h1 className="text-2xl text-[#38322C] font-roobert">
                        {Name}
                    </h1>
                </div>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            href={route.href}
                            key={route.href}
                            className=
                                "text-md group flex p-3 w-full justify-start font-medium cursor-pointer hover:underline hover:bg-zinc-400/10 rounded-lg transition text-[#2B2B2C] mt-8"
                        >
                            <div className="flex items-center flex-1">
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <Link href="/dashboard">
                <Button variant="outline" className="m-5 text-lg py-5 w-[90%]">
                    Regístrate gratis
                </Button>
            </Link>
        </div>
     );
}
 
export default Sidebar;