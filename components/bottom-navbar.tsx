"use client";

import Link from "next/link";
import { Button } from "./ui/button";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import { LogoSlider } from "./logo-slider";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

const components: { title: string; href: string}[] = [
    {
      title: "Pizarra Online",
      href: "/pizarra-online",
    },
    {
      title: "Diagrama de Flujo",
      href: "/diagrama-de-flujo",
    },
    {
      title: "Mapa Conceptual",
      href: "/mapa-conceptual",
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

export const BotNavbar = () => {
    const { user } = useUser();

    return (
        <footer className="bg-[#1C1C1E] text-white">
            <div className="py-10">
                <div className="text-center mt-10 mx-[5%] lg:mx-[30%]">
                    <h1 className="lg:text-5xl mb-8 md:text-4xl text-xl">
                        Únete a los 1000+ de usuarios de Sketchlie hoy mismo.
                    </h1>
                    <p>
                        Sé parte de la comunidad que impulsa la innovación y la colaboración con Sketchlie. Regístrate ahora con tu correo electrónico laboral y comienza a transformar tus ideas en realidad.
                    </p>
                    <Link href={"/dashboard"}>
                      <Button variant="outline" className="mt-10">
                          {user ? "Ir al Tablero" : "Regístrate gratis"}
                      </Button>
                  </Link>
                </div>
                <LogoSlider />
                <Accordion type="single" collapsible className="lg:mx-[10%] sm:mx-[5%] mx-0 text-lg">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Producto</AccordionTrigger>
                        <AccordionContent>
                            <Link 
                                className="p-3 text-lg hover:underline ml-5"
                                href="/product-overview">
                                Descripción de Sketchlie
                            </Link>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Soluciones</AccordionTrigger>
                        <AccordionContent>
                        <ul className="flex flex-col">
                            {components.map((component) => (
                                <Link
                                    className="p-3 text-lg hover:underline ml-5"
                                    key={component.title}
                                    title={component.title}
                                    href={component.href}
                                >
                                    {component.title}
                                </Link>
                            ))}
                        </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <div className="py-4 text-lg border-b font-medium">
                        <Link
                            className="py-5 text-lg hover:underline ml-5"
                            href="/blog"
                        >
                            Blog
                        </Link>
                    </div>
                    <div className="py-4 text-lg border-b font-medium">
                        <Link
                            className="py-5 text-lg hover:underline ml-5"
                            href="/precios"
                        >
                            Precios
                        </Link>
                    </div>
                </Accordion>
                <div className="lg:mx-[10%] sm:mx-[5%] mx-0 lg:text-lg text-xs mt-10 px-4 flex justify-center flex-col">
                  <Link
                    href="/dashboard"
                    className="flex justify-center"
                  >
                    <Image 
                        src="/logo.svg"
                        width={50}
                        height={50}
                        alt="Logo"
                    />
                    <p className="ml-2 hover:underline">
                      Sketchlie
                    </p>
                  </Link>
                  <p className="ml-2 text-center mt-3">
                     © 2024. Todos los derechos reservados.
                  </p>
                </div>
            </div>
        </footer>
    )
}