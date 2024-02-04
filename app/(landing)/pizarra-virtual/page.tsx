import { LandingNavbar } from "@/components/landing-navbar";
import { BotNavbar } from "@/components/bottom-navbar";
import { BlogStructure } from "@/components/blog-structure";
import { Metadata } from "next";
import { BlogSection } from "@/components/blog-section";

export const metadata: Metadata = {
    title: "Pizarra Online",
    description: "Gestiona tus proyectos de forma colaborativa y en tiempo real.",
  };
  

const LandingPage = () => {
    return ( 
        <div className="h-full">
            <LandingNavbar />
            <BlogStructure
                title="Pizarra Virtual"
                description="Una pizarra virtual para que puedas dibujar y compartir con tus amigos."
            
            />
            <BlogSection 
                title="Una forma rápida y fácil de crear wireframes online" 
                text="Foster a customer-centric mindset and build a mutual team space, where everyone can capture insights, structure them with diagrams and tables, and share it all in a central spot."
                img="/placeholders/test.png"
                side="right"
            />
            <BlogSection
                title="Una forma rápida y fácil de crear wireframes online" 
                text="Foster a customer-centric mindset and build a mutual team space, where everyone can capture insights, structure them with diagrams and tables, and share it all in a central spot."
                img="/placeholders/test.png"
                side="left"
            />
            <BlogSection
                title="Una forma rápida y fácil de crear wireframes online" 
                text="Foster a customer-centric mindset and build a mutual team space, where everyone can capture insights, structure them with diagrams and tables, and share it all in a central spot."
            />
            <BotNavbar />
        </div>
     );
}
 
export default LandingPage;