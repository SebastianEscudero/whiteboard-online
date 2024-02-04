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
        <footer className="p-4 bg-[#1C1C1E] text-white flex justify-center">
            <div className="w-[80%]">
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