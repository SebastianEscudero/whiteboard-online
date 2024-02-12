"use client";

import Link from "next/link";
import TypewriterComponent from "typewriter-effect";
import { Button } from "./ui/button";

export const LandingHero = () => {
    return (
        <div className="text-[#1c1c1e] font-normal font-roobert py-28 space-y-5">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl space-y-5 text-center">
                <h1>
                    Draw your dreams
                </h1>
                <h1>
                    And turn them into reality.
                </h1>
                <div className="text-center bg-clip-text text-[#2E4DE6] leading-small">
                    <TypewriterComponent 
                        options = {{
                            strings: [
                                "Build.",
                                "Collab.",
                                "Design.",
                                "Create.",
                                "Teach.",
                            ],
                            autoStart: true,
                            loop: true,
                        }}
                    />
                </div>
            </div>
            <div className="text-sm md:text-xl font-light text-zinc-800 w-[33%] mx-auto text-center">
            Brainstorm, collaborate, and bring your ideas to life in our interactive workspace. Join us and turn your thoughts into reality.
            </div>
            <div className="text-center ">
                <Link href={"/dashboard"}>
                    <Button variant="outline" className="md:text-lg p-4 md:p-6 font-normal">
                        Sign up free
                    </Button>
                </Link>
            </div>
            <div className="text-zinc-400 text-xs md:text-sm font-normal text-center ">
                No credit card required.
            </div>
        </div>
    )
}