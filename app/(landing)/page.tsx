import { LandingContent } from "@/components/landing-content";
import { LandingHero } from "@/components/landing-hero";
import { LandingNavbar } from "@/components/landing-navbar";
import { BotNavbar } from "@/components/bottom-navbar";


const LandingPage = () => {
    return ( 
        <div className="h-full">
            <LandingNavbar />
            <LandingHero />
            <LandingContent />
            <BotNavbar />
        </div>
     );
}
 
export default LandingPage;