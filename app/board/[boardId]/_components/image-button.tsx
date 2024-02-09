"use client";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { toast } from "sonner"
import { 
    CanvasMode, 
    CanvasState, 
    LayerType,
  } from "@/types/canvas";
import { useRef, useState } from "react";

interface ImageButtonProps {
    onImageSelect: (src: string) => void;
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    isActive?: boolean;
    isDisabled?: boolean;
};

export const ImageButton = ({
    label,
    icon: Icon,
    onClick,
    isActive,
    isDisabled,
    onImageSelect,
}: ImageButtonProps) => {
    const inputFileRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        inputFileRef.current?.click();
        onClick();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onImageSelect(URL.createObjectURL(e.target.files[0]));
        }
        else {
            toast.error("Failed to load image");
        }
    };

    return (
        <Hint label={label} side="right" sideOffset={14}>
            <Button disabled={isDisabled} onClick={handleButtonClick} size="icon" variant={isActive ? "boardActive" : "board"}>
                <Icon />
                <input 
                    type="file" 
                    ref={inputFileRef}
                    accept="image/*" 
                    style={{display: 'none'}} 
                    onChange={handleImageChange}
                />
            </Button>
        </Hint>
    )
}