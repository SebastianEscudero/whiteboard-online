"use client";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { ElementType } from "react";

interface ToolButtonProps {
    icon: ElementType;
    onClick: () => void;
    isActive?: boolean;
    isDisabled?: boolean;
    label?: string;
};

export const ToolButton = ({
    icon: Icon,
    onClick,
    isActive,
    isDisabled,
    label
}: ToolButtonProps) => {
    const button = (
        <Button disabled={isDisabled} onClick={onClick} className="h-10 w-10 p-2" variant={isActive ? "iconActive" : "icon"}>
            <Icon className="h-5 w-5" />
        </Button>
    );

    return label ? (
        <Hint side="top" label={label} sideOffset={14}>
            {button}
        </Hint>
    ) : (
        button
    );
}