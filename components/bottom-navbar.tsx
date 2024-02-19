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
  
const components: { title: string; href: string}[] = [
    {
      title: "Gestión de producto",
      href: "/gestion-producto",
    },
    {
      title: "Pizarra Online",
      href: "/pizarra-online",
    },
    {
      title: "Equipos de Ingeniería",
      href: "/equipos-de-ingenieria",
    },
    {
      title: "Mapa Conceptual",
      href: "/mapa-conceptual",
    },
    {
      title: "Equipos de IT",
      href: "/equipos-de-it",
    },
    {
      title: "Wireframes",
      href: "/wireframes",
    },
    {
      title: "Marketing",
      href: "/marketing",
    },
    {
      title: "Mapas mentales",
      href: "/mapas-mentales",
    },
    {
      title: "Agencias y Consultorías",
      href: "/agencias-consultorías",
    },
    {
      title: "Diseño",
      href: "/diseno",
    },
    {
      title: "Ventas",
      href: "/ventas",
    },
    {
      title: "Lluvia de Ideas",
      href: "/lluvia-de-ideas",
    },
  ]

export const BotNavbar = () => {
    return (
        <footer className="bg-[#1C1C1E] text-white">
            <div className="py-10">
                <div className="text-center mt-10 mx-[5%] sm:mx-[20%]">
                    <h1 className="lg:text-5xl mb-8 md:text-4xl text-xl">
                        Únete a los 1000+ de usuarios de Sketchdeck hoy mismo.
                    </h1>
                    <p>
                        Sé parte de la comunidad que impulsa la innovación y la colaboración con Sketchdeck. Regístrate ahora con tu correo electrónico laboral y comienza a transformar tus ideas en realidad.
                    </p>
                    <Button variant="outline" className="mt-10">
                        Regístrate gratis.
                    </Button>
                </div>
                <LogoSlider />
                <Accordion type="single" collapsible className="lg:mx-[10%] sm:mx-[5%] mx-0 text-lg">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Producto</AccordionTrigger>
                        <AccordionContent>
                            <Link 
                                className="p-3 text-lg hover:underline ml-5"
                                href="/product-overview">
                                Descripción de Sketchdeck
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
                    <div className="py-4 text-lg border-b">
                        <Link
                            className="py-5 text-lg hover:underline ml-5"
                            href="/blog"
                        >
                            Blog
                        </Link>
                    </div>
                    <div className="py-4 text-lg border-b">
                        <Link
                            className="py-5 text-lg hover:underline ml-5"
                            href="/precios"
                        >
                            Precios
                        </Link>
                    </div>
                </Accordion>
            </div>
        </footer>
    )
}