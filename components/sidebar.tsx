import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { useUser } from "@clerk/nextjs";

const routes: { title: string; href: string}[] = [
  {
    title: "Pizarra Online",
    href: "/pizarra-online",
  },
  {
    title: "Mapa Conceptual",
    href: "/mapa-conceptual",
  },
  {
    title: "Diagrama de Flujo",
    href: "/diagrama-de-flujo",
  },
  {
    title: "Mapeo de procesos",
    href: "/mapas-de-procesos",
  },
  {
    title: "Gestión de producto 🚧",
    href: "/gestion-producto",
  },
  {
    title: "Equipos de Ingeniería 🚧",
    href: "/equipos-de-ingenieria",
  },
  {
    title: "Equipos de IT 🚧",
    href: "/equipos-de-it",
  },
  {
    title: "Wireframe",
    href: "/wireframe",
  },
  {
    title: "Marketing 🚧",
    href: "/marketing",
  },
  {
    title: "Mapas mentales",
    href: "/mapa-mental-online",
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

const Sidebar = () => {
  const { user } = useUser();
  return ( 
      <div className="space-y-4 py-4 flex flex-col h-full bg-[#FFF] text-black overflow-y-auto">
          <div className="px-3 flex-1">
              <div className="border-top p-3 font-medium flex items-center">
                  <Image
                      className="mr-2"
                      width={40}
                      height={40}
                      alt="Logo"
                      src="/logo.svg"    
                      loading="eager"
                  />
                  <h1 className="text-2xl text-[#38322C] font-roobert">
                      Sketchlie
                  </h1>
              </div>
              <div className="space-y-1">
                  {routes.map((route) => (
                      <Link
                          href={route.href}
                          key={route.href}
                          className=
                              "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:underline hover:bg-zinc-400/10 rounded-lg transition text-[#2B2B2C] mt-4"
                      >
                          <div className="flex items-center flex-1">
                              {route.title}
                          </div>
                      </Link>
                  ))}
              </div>
          </div>
          <Link href="/dashboard">
              <Button variant="outline" className="mx-5 text-lg w-[90%]">
                  {user ? "Ir al Tablero" : "Regístrate gratis"}
              </Button>
          </Link>
      </div>
   );
}
 
export default Sidebar;