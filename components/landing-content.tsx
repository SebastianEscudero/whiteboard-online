"use client";

import { LogoSlider } from "./logo-slider";
import { BlogSection } from "./blog-section";
import Image from "next/image";

const testimonials = [
    {
        name: "David",
        avatar: "D",
        title: "CRM Manager",
        description: '"{name} is a great tool for professionals. It helps me enhance the overall editing process and collaborate with my team in real time."'
    },
    {
        name: "Sebastian",
        avatar: "S",
        title: "Teacher",
        description: '"{name} is a great tool for educators. It helps me create engaging and interactive lessons for my students."'
    },
    {
        name: "Michael",
        avatar: "M",
        title: "Student",
        description: '"{name} is a game-changer for me. It helps me understand complex concepts and solve problems in a fun and interactive way."'
    },
    {
        name: "Sophia",
        avatar: "S",
        title: "Designer",
        description: '"I love using {name} to create and share my ideas and projects in real time. It is a great tool for professionals and students."'
    },
]

export const LandingContent = () => {
    return (
        <div className="pb-20">
            <LogoSlider />
            <div className="w-full lg:px-[5%] px-[2%]">
                <Image 
                    className="rounded-2xl border border-black"
                    src="/placeholders/test2.png"
                    width={5}
                    height={5}
                    layout="responsive"
                    alt="Gif"
                />
            </div>
            <BlogSection 
                title="Colabora hoy para definir el mañana"
            />
            <BlogSection 
                title="Tu próxima gran idea comienza aquí." 
                text="Te brindamos las herramientas necesarias para diseñar el futuro. Desde estrategia y planificación hasta desarrollo de productos y servicios, todo se simplifica cuando trabajas en un espacio ilimitado como Sketchdeck."
                img="/placeholders/test.png"
                side="right"
            />
            <BlogSection 
                title="Desarrolla soluciones a medida para tus clientes."
                text="Fomenta una cultura centrada en la satisfacción del cliente con un entorno colaborativo donde puedas generar, estructurar y compartir ideas con tu equipo, todo en un mismo lugar." 
                img="/placeholders/test2.png"
                side="right"
            />
            <BlogSection 
                title="Conecta toda tu empresa en un espacio seguro."
                text="La seguridad es nuestra prioridad. Con Sketchdeck, puedes estar seguro de que tus datos están protegidos con las más altas medidas de seguridad empresarial."
                img="/placeholders/test2.png"
                side="right"
            />
            <BlogSection 
                title="Itera y desarrolla productos y servicios de manera eficiente."
                text="Nuestras funciones avanzadas te permiten innovar y llevar tus proyectos al mercado más rápido. Desde diagramas hasta talleres, Sketchdeck está diseñado para apoyar los procesos de desarrollo de productos de manera ágil y efectiva."
            />
        </div>
    )
}