"use client";

import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import Autoplay from "embla-carousel-autoplay"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import Marquee from "react-fast-marquee";
import { LogoSlider } from "./logo-slider";
  

export const BotNavbar = () => {
    const { isSignedIn } = useAuth();

    return (
        <footer className="bg-[#1C1C1E] text-white">
            <div className="py-4">
                <div className="text-center my-10">
                    <h1 className="lg:text-5xl mb-8 md:text-4xl text-xl">
                        Join our 60M+ users today
                    </h1>
                    <p>
                        Join thousands of teams collaborating and doing their best work on Sketchdeck.
                    </p>
                    <Button variant="outline" className="mt-10 w-[30%]">
                        Sign up free
                    </Button>
                <LogoSlider />
                </div>
                <Accordion type="single" collapsible className="lg:mx-[15%] sm:mx-[5%] mx-0">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Solutions</AccordionTrigger>
                        <AccordionContent className="hover:underline ml-5">
                            <Link href="/accessibility">
                                yea
                            </Link>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Blog</AccordionTrigger>
                        <AccordionContent className="hover:underline ml-5">
                            <Link href="/accessibility">
                                yea
                            </Link>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Pricing</AccordionTrigger>
                        <AccordionContent className="hover:underline ml-5">
                            <Link href="/accessibility">
                                yea
                            </Link>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Pricing</AccordionTrigger>
                        <AccordionContent className="hover:underline ml-5">
                            <Link href="/accessibility">
                                yea
                            </Link>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Pricing</AccordionTrigger>
                        <AccordionContent className="hover:underline ml-5">
                            <Link href="/accessibility">
                                yea
                            </Link>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </footer>
    )
}