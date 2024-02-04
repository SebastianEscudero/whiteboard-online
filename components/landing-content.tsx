"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const testimonials = [
    {
        name: "David",
        avatar: "D",
        title: "CRM Manager",
        description: '"{name} is a great tool for professionals. It helps me enhance the overall editing process and collaborate with my team in real time."'
    },
    {
        name: "Sebastian",
        avatar: "S",
        title: "Teacher",
        description: '"{name} is a great tool for educators. It helps me create engaging and interactive lessons for my students."'
    },
    {
        name: "Michael",
        avatar: "M",
        title: "Student",
        description: '"{name} is a game-changer for me. It helps me understand complex concepts and solve problems in a fun and interactive way."'
    },
    {
        name: "Sophia",
        avatar: "S",
        title: "Designer",
        description: '"I love using {name} to create and share my ideas and projects in real time. It is a great tool for professionals and students."'
    },
]

export const LandingContent = () => {
    return (
        <div className="px-10 pb-20">
            <Carousel
                plugins={[
                    Autoplay({
                        delay: 6000,
                    }),
                    ]}
                    className="mx-[10%]"
            >
                <CarouselContent>
                    {testimonials.map((item) => (
                    <CarouselItem key={item.description}>
                        <Card key={item.description} className="bg-[#FFFFFF] border-black text-black rounded-2xl mx-[30%]">
                            <CardHeader>
                                <CardTitle className="flex gap-x-2">
                                    <div>
                                        <p className="text-sm">{item.name}</p>
                                        <p className="text-[#535151] text-sm">{item.title}</p>
                                    </div>
                                </CardTitle>
                                <CardContent className="pt-4 px-0">
                                    {item.description}
                                </CardContent>
                            </CardHeader>
                        </Card>
                    </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    )
}