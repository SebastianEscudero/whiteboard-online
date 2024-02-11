"use client";

import { toast } from "sonner"
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useRouter } from "next/navigation";
import { ConfirmBoardModal } from "@/components/create-board-modal";
import React, { useState } from 'react';

interface NewBoardButtonProps {
    orgId: string;
    disabled?: boolean;
}

export const NewBoardButton = ({
    orgId,
    disabled,
}: NewBoardButtonProps) => {
    const router = useRouter();

    // Create a state variable for the title
    const [title, setTitle] = useState('');

    const { mutate, pending} = useApiMutation(api.board.create);
    const onClick = () => {
        mutate({
            orgId,
            title,  // Use the title state variable here
        })
            .then((id) => {
                toast.success("Board created");
                router.push(`/board/${id}`);
            })
            .catch(() => {
                toast.error("Failed to create board");
            });
    }

    return (
        <ConfirmBoardModal
            header="Name your board!"
            description="You can also edit the board name in the canvas"
            disabled={pending}
            onConfirm={onClick}
            setTitle={setTitle}
        >
            <button
                disabled={pending || disabled}
                className={cn(
                    "col-span-1 aspect-[100/127] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6",
                    (pending || disabled) && "opacity-75 hover:bg-blue-600 cursor-not-allowed" 
                )}
            >
                <div />
                <Plus className="w-12 h-12 text-white stroke-1" />
                <p className="text-sm text-white font-light">
                    New Board
                </p>
            </button>
        </ConfirmBoardModal>
    )
}