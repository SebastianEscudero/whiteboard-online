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

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
  
  

export const BotNavbar = () => {
    const { isSignedIn } = useAuth();

    return (
        <footer className="bg-[#1C1C1E] text-white">
            <div className="lg:mx-[15%] mx-[5%]">
                <Accordion type="single" collapsible>
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
                </Accordion>
            </div>
        </footer>
    )
}