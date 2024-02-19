import Image from "next/image";
import { cn } from '@/lib/utils';

interface BlogSectionProps {
    title: string;
    text?: string;
    img?: string;
    side?: 'left' | 'right';
}

export const BlogSection = ({
    title,
    text,
    img,
    side = 'right',
}: BlogSectionProps) => {
    const imageElement = img && (
        <div className="flex-1 w-full">
            <Image
                src={img}
                alt="Logo"
                layout="responsive"
                width={10}
                height={10}
                className="border rounded-sm"
            />
        </div>
    );

    return (
        <div className={`flex flex-col lg:mx-[10%] mx-[5%] md:flex-row items-center my-10 space-y-4 font-roobert md:space-x-20 xl:space-x-30 text-[#1c1c1e] ${!img && 'text-center'}`}>
            {side === 'left' && imageElement}
            <div className="flex-1">
                <h1 className={cn("mb-10 leading-snug space-y-5", {
                    'text-xl sm:text-2xl lg:text-3xl': text && img,
                    'text-3xl sm:text-4xl lg:text-5xl my-10': !img 
                })}>
                    {title}
                </h1>
                {text && (
                    <p className="sm:text-lg lg:text-xl font-light text-zinc-800">
                        {text}
                    </p>
                )}
            </div>
            {side === 'right' && imageElement}
        </div>
    )
}