"use client";

import { LogoSlider } from "./logo-slider";
import { BlogSection } from "./blog-section";

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
            <LogoSlider />
            <BlogSection 
                title="Una forma rápida y fácil de crear wireframes online" 
                text="Foster a customer-centric mindset and build a mutual team space, where everyone can capture insights, structure them with diagrams and tables, and share it all in a central spot."
                img="/placeholders/test.png"
                side="right"
            />
            <BlogSection 
                title="Una forma rápida y fácil de crear wireframes online" 
                text="Foster a customer-centric mindset and build a mutual team space, where everyone can capture insights, structure them with diagrams and tables, and share it all in a central spot."
                img="/placeholders/test2.png"
                side="right"
            />
            <BlogSection 
                title="Una forma rápida y fácil de crear wireframes online" 
                text="Foster a customer-centric mindset and build a mutual team space, where everyone can capture insights, structure them with diagrams and tables, and share it all in a central spot."
            />
        </div>
    )
}