import { LandingContent } from "@/components/landing-content";
import { LandingHero } from "@/components/landing-hero";
import { BotNavbar } from "@/components/bottom-navbar";


const LandingPage = () => {
    return ( 
        <div>
            <LandingHero />
            <LandingContent />
        </div>
     );
}
 
export default LandingPage;