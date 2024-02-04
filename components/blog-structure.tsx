import Link from "next/link"
import { Button } from "./ui/button"

interface BlogStructureProps {
    title: string;
    description: string;
}

export const BlogStructure = ({
    title,
    description
}: BlogStructureProps) => {
    return (
        <div className="text-[#1c1c1e] font-normal font-roobert py-28 text-center space-y-5">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl space-y-5">
                <h1>
                    {title}
                </h1>
            </div>
            <div className="text-sm md:text-xl font-light text-zinc-800 w-[33%] mx-auto">
            {description}
            </div>
            <div>
                <Link href={"/dashboard"}>
                    <Button variant="outline" className="md:text-lg p-4 md:p-6 rounded-full font-normal">
                        {"Sign up free"}
                    </Button>
                </Link>
            </div>
            <div className="text-zinc-400 text-xs md:text-sm font-normal">
                No credit card required.
            </div>
        </div>
    )
}