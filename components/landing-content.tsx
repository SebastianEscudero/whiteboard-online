"use client";

import { LogoSlider } from "./logo-slider";
import { BlogSection } from "./blog-section";
import { BlogTestimonials } from "./blog-testimonials";

export const LandingContent = () => {
    return (
        <div>
            <LogoSlider />
            <div className="w-full lg:px-[5%] px-[2%] flex justify-center">
                <video 
                    className="rounded-2xl border border-black"
                    src="/placeholders/landingvideo.mp4"
                    autoPlay
                    loop
                    muted
                />
            </div>
            <BlogSection 
                title="Colabora hoy para definir el mañana."
            />
            <BlogSection 
                title="Tu próxima gran idea comienza aquí." 
                text="Te brindamos las herramientas necesarias para diseñar el futuro. Desde estrategia y planificación hasta desarrollo de productos y servicios, todo se simplifica cuando trabajas en un espacio ilimitado como Sketchdeck."
                img="/placeholders/landing1.png"
                side="right"
            />
            <BlogSection 
                title="Desarrolla soluciones a medida para tus clientes."
                text="Fomenta una cultura centrada en la satisfacción del cliente con un entorno colaborativo donde puedas generar, estructurar y compartir ideas con tu equipo, todo en un mismo lugar." 
                img="/placeholders/landing2.png"
                side="right"
            />
            <BlogSection 
                title="Conecta toda tu empresa en un espacio seguro."
                text="La seguridad es nuestra prioridad. Con Sketchdeck, puedes estar seguro de que tus datos están protegidos con las más altas medidas de seguridad empresarial."
                img="/placeholders/landing3.png"
                side="right"
            />
            <BlogTestimonials
                title="Itera y desarrolla productos y servicios de manera eficiente."
                text="Nuestras funciones avanzadas te permiten innovar y llevar tus proyectos al mercado más rápido. Desde diagramas hasta talleres, Sketchdeck está diseñado para apoyar los procesos de desarrollo de productos de manera ágil y efectiva."
            />
        </div>
    )
}