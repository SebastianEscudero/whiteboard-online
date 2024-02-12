import Image from "next/image"
import Marquee from "react-fast-marquee"

export const LogoSlider = () => {
    return (
    <Marquee 
        speed={50}
        autoFill={true}
    >
        <Image src="/marquee/1.svg" alt="Logo" width={50} height={50} className="m-[30px] filter grayscale"/>
        <Image src="/marquee/2.svg" alt="Logo" width={50} height={50} className="m-[30px] filter grayscale"/>
        <Image src="/marquee/3.svg" alt="Logo" width={50} height={50} className="m-[30px] filter grayscale"/>
        <Image src="/marquee/4.svg" alt="Logo" width={50} height={50} className="m-[30px] filter grayscale"/>
        <Image src="/marquee/5.svg" alt="Logo" width={50} height={50} className="m-[30px] filter grayscale"/>
        <Image src="/marquee/6.svg" alt="Logo" width={50} height={50} className="m-[30px] filter grayscale"/>
        <Image src="/marquee/7.svg" alt="Logo" width={50} height={50} className="m-[30px] filter grayscale"/>
        <Image src="/marquee/8.svg" alt="Logo" width={50} height={50} className="m-[30px] filter grayscale"/>
        <Image src="/marquee/9.svg" alt="Logo" width={50} height={50} className="m-[30px] filter grayscale"/>
    </Marquee>
    )
}