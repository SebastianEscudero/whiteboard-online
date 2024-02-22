import { Card, CardContent, CardHeader, CardTitle } from "./card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
  } from "@/components/ui/carousel";
import { NAME } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";

const name = NAME;
const testimonials = [
    {
        name: "Maximilian Smith",
        avatar: "M",
        title: "CRM Manager",
        description: `"${name} is awesome!. It helps me enhance the overall editing process and collaborate with my team in real time."`
    },
    {
        name: "Paula Verastegui",
        avatar: "P",
        title: "Teacher",
        description: `"${name} is a great tool for educators. It helps me create engaging and interactive lessons for my students."`
    },
    {
        name: "Matheus Kasakoff",
        avatar: "M",
        title: "Student",
        description: `"${name} is a game-changer for me. It helps me understand complex concepts and solve problems in a fun and interactive way."`
    },
    {
        name: "Sebastián Kopp",
        avatar: "S",
        title: "Designer",
        description: `"I love using ${name} to create and share my ideas and projects in real time. It is a great tool for professionals and students."`
    },
    {
        name: "Mariana Sánchez",
        avatar: "M",
        title: "Engineer",
        description: `"${name} is an invaluable resource for professionals. It streamlines my workflow and fosters effective team collaboration."`
    },
    {
        name: "Javier Pérez",
        avatar: "J",
        title: "Developer",
        description: `"I use ${name} to create and share my projects with my team. It is a great tool for developers and designers."`
    }
]

export const Testimonials = () => {
    return (
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
                <Card key={item.description} className="bg-[#FFFFFF] border-black text-black rounded-2xl lg:mx-[30%] sm:mx-[10%] mx-[2%]">
                    <CardHeader>
                    <CardTitle className="flex gap-x-2">
                        <div className="flex items-center justify-center w-9 h-9 bg-gray-300 rounded-full">
                            <p className="text-black font-bold lg:text-lg text-md">{item.avatar}</p>
                        </div>
                        <div>
                            <p className="lg:text-sm text-xs">{item.name}</p>
                            <p className="text-[#535151] lg:text-sm text-xs">{item.title}</p>
                        </div>
                    </CardTitle>
                    <CardContent className="pt-4 px-0 text-xs lg:text-sm">
                        {item.description}
                    </CardContent>
                    </CardHeader>
                </Card>
            </CarouselItem>
            ))}
        </CarouselContent>
    </Carousel>
    )
}