"use client"

import { useEffect, useRef } from "react";

export const LandingVideo = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

        useEffect(() => {
            if (videoRef.current) {
                videoRef.current.play();
            }
        }, []);
        
    return (
        <div className="w-full lg:px-[10%] px-[5%] flex justify-center">
            <video 
                ref={videoRef}
                className="rounded-2xl border border-black"
                src="/placeholders/landingvideo.mp4"
                autoPlay
                loop
                muted
            />
        </div>
    )
};