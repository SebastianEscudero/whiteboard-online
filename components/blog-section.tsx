import Image from "next/image";

interface BlogSectionProps {
    title: string;
    text: string;
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
            <div>
                <Image
                    src={img}
                    alt={text}
                    layout="responsive"
                    width={5}
                    height={5}
                    className="border rounded-sm"
                />
            </div>
        </div>
    );

    return (
        <div className={`flex flex-col lg:mx-[15%] mx-[5%] md:flex-row items-center my-10 space-y-4 font-roobert md:space-x-20 xl:space-x-48 text-[#1c1c1e] ${!img && 'text-center'}`}>
            {side === 'left' && imageElement}
            <div className="my-10 flex-1">
                <h1 className="mb-10 leading-snug sm:text-2xl lg:text-3xl space-y-5">
                    {title}
                </h1>
                <p className="sm:text-lg lg:text-xl font-light text-zinc-800">
                    {text}
                </p>
            </div>
            {side === 'right' && imageElement}
        </div>
    )
}