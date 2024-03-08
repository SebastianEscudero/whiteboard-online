"use client";

import { LogoSlider } from "./logo-slider";
import { BlogSection } from "./blog-section";
import { BlogTestimonials } from "./blog-testimonials";
import { LandingVideo } from "./landing-video";

export const LandingContent = () => {
    return (
        <div>
            <LogoSlider />
            <LandingVideo />
            <div className="md:my-20 lg:my-28 my-10">
                <BlogSection 
                    title="Colabora hoy para definir el mañana."
                    text="Con Sketchlie, puedes colaborar con tu equipo en tiempo real, compartir ideas, añadir notas y desarrollar proyectos de forma colaborativa, sin importar su ubicación geográfica. Nuestra pizarra online va más allá al ofrecer una amplia gama de características diseñadas específicamente para potenciar la creatividad y la productividad de los equipos."
                />
            </div>
            <BlogSection 
                title="Tu próxima gran idea comienza aquí." 
                text="Te brindamos las herramientas necesarias para diseñar el futuro. Desde estrategia y planificación hasta desarrollo de productos y servicios, todo se simplifica cuando trabajas en un espacio ilimitado como Sketchlie."
                img="/placeholders/car-sales-grafic.png"
                side="right"
            />
            <BlogSection 
                title="Desarrolla soluciones a medida para tus clientes."
                text="Fomenta una cultura centrada en la satisfacción del cliente con un entorno colaborativo donde puedas generar, estructurar y compartir ideas con tu equipo, todo en un mismo lugar." 
                img="/placeholders/prototype-wireframe.png"
                side="left"
            />
            <BlogSection 
                title="Conecta toda tu empresa en un espacio seguro."
                text="La seguridad es nuestra prioridad. Con Sketchlie, puedes estar seguro de que tus datos están protegidos con las más altas medidas de seguridad empresarial."
                img="/placeholders/mapa-mental.png"
                side="right"
            />
            <BlogTestimonials
                title="Itera y desarrolla productos y servicios de manera eficiente."
                text="Nuestras funciones avanzadas te permiten innovar y llevar tus proyectos al mercado más rápido. Desde diagramas hasta talleres, Sketchlie está diseñado para apoyar los procesos de desarrollo de productos de manera ágil y efectiva."
            />
        </div>
    )
}