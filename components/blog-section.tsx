import Image from "next/image";

interface BlogSectionProps {
    title: string;
    text: string;
    img: string;
}

export const BlogSection = ({
    title,
    text,
    img,
}: BlogSectionProps) => {
    return (
        <div className="flex flex-col md:flex-row justify-center items-center my-10 space-y-4 md:space-y-0 font-roobert md:space-x-20 text-[#1c1c1e]">
            <div className="md:w-[30%] mb-4 md:mb-0 justify-between">
                <h1 className="text-center md:text-left text-5xl mb-10 leading-snug">
                    {title}
                </h1>
                <p className="text-center md:text-left text-lg">
                    {text}
                </p>
            </div>
            <div className="w-full md:w-1/3">
                <Image
                    src={img}
                    alt={text}
                    layout="responsive"
                    width={100}
                    height={100}
                    className="object-cover"
                />
            </div>
        </div>
    )
}