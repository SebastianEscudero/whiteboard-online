import { LandingNavbar } from "@/components/landing-navbar";
import { BotNavbar } from "@/components/bottom-navbar";
import { BlogStructure } from "@/components/blog-structure";
import { Metadata } from "next";
import { BlogSection } from "@/components/blog-section";
import { DashboardButton } from "@/components/register-button";
import { LogoSlider } from "@/components/logo-slider";
import { FaqSection } from "@/components/faq-section";
import { LandingVideo } from "@/components/landing-video";
import { HowToCreate } from "@/components/how-to-create";

export const metadata: Metadata = {
    title: "Creador de diagramas de flujo | Sketchlie",
    description: "Crea tus diagramas de flujo en línea en minutos con Sketchlie y comienza a colaborar con tu equipo! Con una amplia gama de símbolos y plantillas gratuitas, simplifica tus flujos de trabajo. ¡Regístrate ahora y empieza!"
};

const LandingPage = () => {
    const faqData = [
        {
            value: "item-1",
            trigger: "¿Qué es un wireframe?",
            content: "Los wireframes son esquemas básicos que ayudan a los equipos a alinearse en cuanto a requisitos, manteniendo las conversaciones de diseño de experiencia de usuario (UX) enfocadas y constructivas. Piensa en tu wireframe como el esqueleto de tu aplicación, sitio web u otro producto final. En las primeras etapas de diseño, los wireframes de baja fidelidad utilizan texto lorem ipsum y formas simples como marcadores de posición para imágenes y videos. Esto ayuda al equipo de diseño, a los redactores y a otros miembros del equipo a centrarse en la funcionalidad básica para alinearse en la dirección correcta. Comenzar con un diseño de wireframe limpio y sencillo también brinda a los diseñadores de UI/UX espacio para iterar. Pueden recopilar comentarios tempranos de pruebas de usuario sobre elementos básicos de UX/UI, sin distraer a los usuarios con detalles de diseño visual. Los equipos de diseño prueban diferentes conceptos, flujos de usuarios y plantillas a medida que trabajan hacia la experiencia de usuario definitiva."
        },
        {
            value: "item-2",
            trigger: "5 mejores prácticas en el diseño de wireframes",
            content: "1. Identifica tus objetivos de diseño. \n\n Antes de comenzar a hacer bocetos o jugar con plantillas de wireframes, define tus objetivos de diseño. Considera las necesidades del usuario y las acciones que deseas que realicen para lograrlos. Alinea a tu equipo de diseño en torno a este objetivo para que tus diseños de wireframe avancen esa causa. \n\n 2. Escoge el tamaño adecuado para tu wireframe. \n\n Tus wireframes deben coincidir con el tamaño de la pantalla que utilizará tu audiencia objetivo. Naturalmente, un sitio web o aplicación se verá diferente en una computadora portátil que en un dispositivo móvil. Con eso en mente, los tamaños de wireframe estándar para tipos de pantalla son los siguientes: \n\n Móvil: 1080 píxeles de ancho por 1920 píxeles de largo \nTablet de 8 pulgadas: 800 píxeles de ancho por 1280 píxeles de largo \n Tablet de 10 pulgadas: 1200 píxeles de ancho por 1920 píxeles de largo \n Escritorio: 768 píxeles de ancho por 1366 píxeles de largo. \n\n 3. Mantén el diseño de tu wireframe simple. \n\n Comienza tu wireframe utilizando colores en escala de grises, limitando las fuentes y reemplazando los gráficos con cuadros. Asegúrate de que tu esquema cumpla con los requisitos del usuario al nivel más básico. Si te enfocas en detalles como errores de ortografía o esquemas de color, podrías pasar por alto un defecto en la experiencia del usuario. \n\n 4. Haz la navegación evidente. \n\n Tus flujos de usuario deben ser fluidos e intuitivos. Al aplicar arquitectura de información a tu wireframe, considera dónde podrías necesitar apoyarlo con navegación y señales de orientación. Si los usuarios tienen que consultar un mapa del sitio, tu navegación y arquitectura de información necesitan mejoras. \n\n 5. Aprovecha las herramientas de wireframing. \n\n Los equipos de diseño necesitan wireframes que puedan compartir, guardar y convertir en maquetas en línea. El kit de wireframes de Sketchlie viene con herramientas de diseño de arrastrar y soltar que facilitan a principiantes y profesionales del diseño crear wireframes personalizados de alta fidelidad."
        },
        {
            value: "item-3",
            trigger: "3 tipos de wireframes",
            content: "1. Los wireframes de baja fidelidad: \n\n Los wireframes de baja fidelidad son wireframes básicos centrados en el diseño de la disposición, navegación y arquitectura de la información. Muestran cómo se verá la interfaz, ilustrando los flujos de usuario con elementos clave de diseño de interfaz de usuario. Los bocetos físicos en pizarra blanca pueden funcionar en las primeras etapas de creación de wireframes, aunque no siempre son fáciles de compartir, guardar o modificar. Con la herramienta de creación de wireframes en línea de Figma, puedes crear, compartir e iterar rápidamente en wireframes de baja fidelidad. \n\n 2. Los wireframes de media fidelidad: \n\n Los wireframes de media fidelidad ayudan a los diseñadores a iterar y dar forma al diseño final. Los equipos de diseño pueden agregar anotaciones y contenido mientras prueban diferentes enfoques para los flujos de usuario y los elementos de diseño de la interfaz de usuario, mapeando la funcionalidad central y las interacciones clave. Esto permite a los equipos establecer el marco de diseño final del wireframe antes de agregar componentes de diseño visual.\n\n 3. Los wireframes de alta fidelidad: \n\n Los wireframes de alta fidelidad se asemejan a maquetas tempranas del producto, con elementos de diseño interactivo y visual, pero sin la funcionalidad de los prototipos de baja fidelidad. En este punto del proceso de diseño, es posible que desees agregar elementos de marca como fuentes, colores y logotipos. De esta manera, puedes capturar la apariencia y sensación del producto final para realizar pruebas de usuario."
        },
        {
            value: "item-4",
            trigger: "¿Para qué sirve un wireframe?",
            content: "Un wireframe es una herramienta fundamental en el proceso de diseño de páginas web y aplicaciones móviles. Sirve como un esquema visual básico que representa la estructura y disposición de los elementos en una interfaz digital, sin incluir detalles de diseño gráfico o contenido visual. \n\n La creación de un wireframe permite a los diseñadores y desarrolladores planificar la distribución de contenido, la navegación del usuario y la funcionalidad de manera eficiente. Además, proporciona una visión clara de la jerarquía de la información y las interacciones clave dentro de la interfaz."
        },
    ];

    const steps = [
        {
            trigger: "1. Definir el Objetivo Principal",
            text: "Considera el objetivo principal del sitio web y diseña el wireframe teniendo ese objetivo en mente, asegurando un enfoque centrado en el usuario para la interacción con la interfaz."
        },
        {
            trigger: "2. Estructurar la Base del Wireframe",
            text: "Comienza con un wireframe básico y de baja fidelidad que conste de tres secciones principales: el encabezado, que captura la atención del usuario en la parte superior; el cuerpo, donde reside el contenido principal; y el pie de página, que generalmente contiene información menos crítica."
        },
        {
            trigger: "3. Integrar Elementos de Navegación",
            text: "Incorpora elementos de navegación en el wireframe, como botones y enlaces, permitiendo a los usuarios acceder de manera fluida a secciones clave como áreas de contenido, funciones de búsqueda y opciones de inicio de sesión de usuario."
        },
        {
            trigger: "4. Anotar para Claridad y Comunicación",
            text: "Mejora la claridad del wireframe mediante la anotación de elementos clave para una mejor comprensión. Las anotaciones ayudan a transmitir funcionalidades y características específicas a los interesados, facilitando la comunicación y retroalimentación efectivas."
        }
    ]
    
    return ( 
            <div className="h-full">
            <LandingNavbar />
            <BlogStructure
                title="Herramienta para crear Wireframes Online"
                description="Diseña tus proyectos web de manera efectiva y eficiente con nuestro creador de wireframes en línea. Visualiza la estructura y el diseño de tu sitio web antes de empezar a codificar, asegurando una experiencia de usuario óptima desde el principio."
                cta="Crear wireframe"
                img="/placeholders/landing6.png"
            />
            <LogoSlider />
            <LandingVideo />
            <div className="mb:my-28 my-14">
                <BlogSection 
                    title="Construye tus ideas con wireframes versátiles." 
                    text="
                    Utiliza nuestras herramientas de diseño para simplificar la creación de tus proyectos web. Explora una amplia variedad de elementos y disposiciones, y agrega interacciones para simular la experiencia del usuario final."
                />
            </div>
            <BlogSection 
                title="Diseña tu sitio web como un profesional" 
                text="Empieza a visualizar tus ideas en minutos con nuestro intuitivo creador de wireframes. Crea esquemas de lo que necesites, desde páginas de inicio hasta formularios y menús, con nuestro creador de wireframes. Visualiza la estructura de tu sitio web de manera clara y concisa."
                img="/placeholders/landing4.png"
                side="right"
            />
            <BlogSection
                title="Acceso desde cualquier lugar" 
                text="Tus wireframes guardados en la nube te permiten acceder desde cualquier lugar, en cualquier momento. Nuestro creador de wireframes es compatible con todos los dispositivos. Comienza a diseñar en nuestro plataforma y colabora con tu equipo para asegurar la coherencia y eficacia de tu diseño."
                img="/placeholders/landing3.png"
                side="left"
            />
            <BlogSection
                title="Crea Wireframes Online de Forma Intuitiva con Nosotros"
                text="Descubre cómo crear wireframes de manera intuitiva y colaborativa con nuestra plataforma. Ofrecemos herramientas potentes para visualizar la arquitectura de la información, probar la usabilidad y colaborar con tu equipo en tiempo real. Simplifica el proceso de diseño y desarrollo de tu sitio web con nuestras funciones intuitivas y fáciles de usar. ¡Comienza a diseñar tus wireframes hoy mismo con nosotros!"
                img="/placeholders/landing2.png"
                side="right"
            />
            <BlogSection
                title="Potencia tus proyectos web" 
                text="Explora cómo nuestra plataforma puede llevar tus proyectos web a un nuevo nivel. Desde sesiones de brainstorming hasta revisiones de diseño, nuestra herramienta versátil y fácil de usar está diseñada para potenciar la creatividad y la productividad de tu equipo. Únete a la revolución del diseño web colaborativo. ¡Regístrate hoy mismo!"
                img="/placeholders/landing1.png"
                side="left"
            />
            <div className="text-center md:my-28 my-14">
                <BlogSection
                    title="Prueba Nuestra Plataforma Gratis Hoy Mismo" 
                    text="Regístrate ahora y comienza a explorar todas las funcionalidades de nuestra plataforma de wireframes de forma gratuita. No se requiere tarjeta de crédito. Únete a miles de usuarios satisfechos que han descubierto una nueva forma de diseñar proyectos web de manera eficiente."
                />
                <DashboardButton />
            </div>
            <HowToCreate steps={steps} title="Cómo hacer un wireframe"/>
            <FaqSection accordionData={faqData} sectionTitle="los wireframes" />
            <BotNavbar />
        </div>

     );
}
 
export default LandingPage;