import { NAME } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const routes: { title: string; href: string}[] = [
  {
    title: "Gestión de producto 🚧",
    href: "/gestion-producto",
  },
  {
    title: "Pizarra Online",
    href: "/pizarra-online",
  },
  {
    title: "Equipos de Ingeniería 🚧",
    href: "/equipos-de-ingenieria",
  },
  {
    title: "Mapa Conceptual 🚧",
    href: "/mapa-conceptual",
  },
  {
    title: "Equipos de IT 🚧",
    href: "/equipos-de-it",
  },
  {
    title: "Wireframes 🚧",
    href: "/wireframes",
  },
  {
    title: "Marketing 🚧",
    href: "/marketing",
  },
  {
    title: "Mapas mentales 🚧",
    href: "/mapas-mentales",
  },
  {
    title: "Agencias y Consultorías 🚧",
    href: "/agencias-consultorías",
  },
  {
    title: "Diseño 🚧",
    href: "/diseno",
  },
  {
    title: "Ventas 🚧",
    href: "/ventas",
  },
  {
    title: "Lluvia de Ideas 🚧",
    href: "/lluvia-de-ideas",
  },
]

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
                                {route.title}
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