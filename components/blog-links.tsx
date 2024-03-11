import Image from "next/image"
import Link from "next/link";

interface BlogLinksProps {
    blogImage: string;
    blogHref: string;
    blogDescription: string;
    blogTitle: string;
}

export const BlogLinks = ({
    blogImage,
    blogHref,
    blogDescription,
    blogTitle
}: BlogLinksProps) => {
    return(
        <div className="w-auto border border-black rounded-md mb-10 mx-3 transform transition-all duration-200 hover:scale-105">
            <Link
                href={blogHref}
            >
                <Image 
                    className="rounded-md"
                    src={blogImage}
                    alt="Blog Image"
                    width={300}
                    height={200}
                    layout="responsive"
                    loading="eager"
                />
                <div className="p-5 bg-[#FFF] rounded-md md:h-[300px] lg:h-[350px] xl:h-[300px] 2xl:h-[250px]">
                    <h2 className="mb-5">
                        <strong>{blogTitle}</strong>
                    </h2>
                    <p className="h-[75%] sm:h-[70%] md:h-[75%] lg:h-[70%] md:mb-0 mb-5">
                        {blogDescription}
                    </p>
                    <p>
                        <strong>Leer más</strong>
                    </p>
                </div>
            </Link>
        </div>
    )
}