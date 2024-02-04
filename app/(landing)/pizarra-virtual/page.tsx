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
                text="lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id. Sed rhoncus, tortor sed eleifend tristique, tortor mauris molestie elit, et luctus enim justo non justo. Quisque tincidunt augue in mauris malesuada bibendum. Morbi non euismod magna. Morbi sit amet odio eu purus luctus suscipit. Nullam sed congue lectus. Donec et odio id quam laoreet suscipit. Nam sit amet iaculis sem. Etiam porttitor lacus sit amet libero posuere in mollis elit tempus."
                img="/placeholders/10.svg"
            />
            <BotNavbar />
        </div>
     );
}
 
export default LandingPage;