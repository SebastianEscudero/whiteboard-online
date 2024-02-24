import { LandingNavbar } from "@/components/landing-navbar";
import { BotNavbar } from "@/components/bottom-navbar";
import { BlogStructure } from "@/components/blog-structure";
import { Metadata } from "next";
import { BlogSection } from "@/components/blog-section";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Pizarra Online | Pizzara virtual para colaborar gratuita | Sketchlie",
    description: "La pizarra online de Sketchlie ayuda a las personas a colaborar y presentar ideas de manera efectiva, logrando mejores productos todo desde una pizarra online. Segura y pensada para tu empresas.",
  };

const LandingPage = () => {
    const tools = [
        {
            features: {
                "Espacios de trabajo": "Ilimitados",
                "Capas máximas": "500",
                "Herramientas": "Todas",
                "Soporte": "Básico",
                "Export a PDF": "Sí",
            }
        },
    ]
    return ( 
        <div className="h-full">
            <LandingNavbar />
            <BlogStructure
                title="La pizarra online para colaborar."
                description="Sketchlie es una pizarra online rápida, gratuita y fácil de usar pensada para  ayudarte a colaborar con cualquier persona desde cualquier lugar."
            />
            <div className="w-full lg:px-[5%] px-[2%] flex justify-center">
                <video 
                    className="rounded-2xl border border-black my-20"
                    src="/placeholders/landingvideo.mp4"
                    autoPlay
                    loop
                    muted
                />
            </div>
            <BlogSection 
                title="Espacio de trabajo pensado en ti" 
                text="Sketchlie es más que una pizarra online, es un espacio virtual donde los usuarios pueden colaborar en tiempo real, compartir ideas, añadir notas, y desarrollar proyectos de forma conjunta, sin importar su ubicación geográfica. En Sketchlie, nuestra pizarra online va más allá al ofrecer una amplia gama de características diseñadas específicamente para potenciar la creatividad y la productividad de los equipos."
            />
            <BlogSection 
                title="La pizarra online para colaborar efectivamente" 
                text="En el mundo actual, donde la colaboración remota se ha vuelto esencial, contar con herramientas que faciliten el trabajo en equipo y fomenten la creatividad es fundamental."
                img="/placeholders/landing4.png"
                side="right"
            />
            <BlogSection
                title="Colaboración en Tiempo Real" 
                text="Con nuestra pizarra online, los usuarios pueden trabajar juntos en proyectos en tiempo real, lo que permite una comunicación instantánea y una mayor eficiencia en la toma de decisiones."
                img="/placeholders/landing3.png"
                side="left"
            />
            <BlogSection
                title="Planificación y Gestión de Proyectos" 
                text="Equipado con funciones de planificación integradas, nuestra pizarra online facilita la organización de tareas, la asignación de responsabilidades y el seguimiento del progreso del proyecto, todo en un solo lugar."
                img="/placeholders/landing2.png"
                side="right"
            />
            <BlogSection
                title="La pizarra online única Sketchlie." 
                text="Invita a colegas a tu pizarra online para sesiones de lluvia de ideas, toma de notas y seguimiento de proyectos. Comparte tu pantalla, realiza videoconferencias y aprovecha el modo de presentación para reuniones estimulantes. La rapidez de Sketchlie permite que múltiples usuarios trabajen simultáneamente sin esfuerzo."
                img="/placeholders/landing1.png"
                side="left"
            />
            <BlogSection
                title="Prueba Sketchlie gratis" 
                text="Regístrate gratis y comienza a usar Sketchlie hoy. No se requiere tarjeta de crédito."	
            />
            <div className="text-center mb-10">
                <Link href={"/dashboard"}>
                    <Button variant="outline" className="md:text-lg p-4 md:p-6 font-normal">
                        Regístrate gratis
                    </Button>
                </Link>
            </div>
            <BlogSection 
                title="Preguntas frecuentes sobre las pizarras online de Sketchlie" 
            />
            <Accordion type="single" collapsible className="lg:mx-[10%] sm:mx-[5%] mx-0 text-lg bg-white p-3 mb-20">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>¿Qué es una pizarra online?</AccordionTrigger>
                        <AccordionContent className="px-4 text-lg">
                        Una pizarra online es un espacio virtual donde se puede dibujar todo tipo de ideas, diseños, procesos etc. En Sketchlie trabajamos para que puedas tener la pizarra online colaborativa infinita más rápida para que sea ideal para todo tipo de equipos.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>¿La pizarra online de Sketchlie es grátis?</AccordionTrigger>
                        <AccordionContent className="px-4 text-lg">
                            Sí! Sketchlie es gratis y no requiere tarjeta de crédito para registrarte, para equipos que quieran ir más allá tenemos planes de pago, pero la versión gratuita es ideal para equipos pequeños.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>¿Se puede utilizar la pizarra online de Sketchlie para hacer clases?</AccordionTrigger>
                        <AccordionContent className="px-4 text-lg">
                            Sí! Sketchlie ofrece organizadores gráficos intuitivos y dinámicos, como líneas del tiempo, mapas mentales y diagramas de Venn que se adaptan a todos los estudiantes. Edita en tiempo real con tus alumnos, prepara clases, comparte materiales, haz videollamadas, comentarios, encuestas y muchas otras funciones para hacer que tus clases online sean aún más interesantes. Regístrate para estimular el pensamiento crítico y la creatividad de tus estudiantes.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>¿Por qué Sketchlie?</AccordionTrigger>
                        <AccordionContent className="px-4 text-lg">
                            Sketchlie ofrece simplemente la pizarra online más rápida y fácil de usar, con una interfaz intuitiva y una amplia gama de herramientas de colaboración. Nuestra pizarra online es ideal para equipos de cualquier tamaño, desde pequeñas empresas hasta grandes corporaciones.
                            También es perfecta para profesores y estudiantes que buscan una forma más interactiva de enseñar y aprender.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            <BotNavbar />
        </div>

     );
}
 
export default LandingPage;