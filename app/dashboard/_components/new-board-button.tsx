"use client";

import { toast } from "sonner"
import { cn } from "@/lib/utils";
import { LoaderCircle, Plus } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useRouter } from "next/navigation";
import { ConfirmBoardModal } from "@/components/create-board-modal";
import React, { useState } from 'react';
import { useQuery } from "convex/react";
import { useProModal } from "@/hooks/use-pro-modal";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getMaxBoards } from "@/lib/planLimits";
import { updateR2Bucket } from "@/lib/r2-bucket-functions";



interface NewBoardButtonProps {
    org: any
    disabled?: boolean;
}

export const NewBoardButton = ({
    org,
    disabled,
}: NewBoardButtonProps) => {

    const maxAmountOfBoards = getMaxBoards(org);

    const user = useCurrentUser();
    const usersRole = org?.users?.find((u: any) => u.id === user?.id)?.role;


    const data = useQuery(api.boards.get, {
        orgId: org.id,
    });


    const proModal = useProModal();
    const router = useRouter();
    const [title, setTitle] = useState('New Board');
    const { mutate, pending } = useApiMutation(api.board.create);

    if (!user) {
        return null;
    }

    const onClick = async () => {
        try {
            const id = await mutate({
                orgId: org.id,
                title,
                userId: user.id,
                userName: user.name,
            });
            await updateR2Bucket('/api/r2-bucket/createBoard', id, [], {});
            toast.success("Board created");
            await router.push(`/board/${id}`);
        } catch (error) {
            toast.error("Failed to create board");
        }
    }

    const onConfirm = () => {
        if (maxAmountOfBoards !== null && (data?.length ?? 0) < maxAmountOfBoards) {
            onClick();
        } else {
            proModal.onOpen(org.id);
        }
    }
    return (
        <ConfirmBoardModal
            header="Name your board!"
            description="You can also edit the board name in the canvas"
            placeHolderText="Part 1: Planning"
            disabled={pending}
            onConfirm={onConfirm}
            setTitle={setTitle}
        >
            <button
                disabled={pending || disabled || usersRole !== 'Admin'}
                className={cn(
                    "col-span-1 aspect-[100/127] bg-blue-600 shadow-custom-1 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center",
                    (pending || disabled || usersRole !== 'Admin') && "opacity-75 hover:bg-blue-600 cursor-not-allowed"
                )}
            >
                {pending ? <LoaderCircle className="animate-spin w-12 h-12 text-white stroke-1" /> :
                    <>
                        <Plus className="w-12 h-12 text-white stroke-1" />
                        <p className="text-sm text-white font-light">
                            New Board
                        </p>
                    </>
                }
                {usersRole !== 'Admin' &&
                    <p className="text-xs text-white font-light mx-[20%] pt-2">
                        Only <span className="font-bold">Admins</span> can create boards
                    </p>}
            </button>
        </ConfirmBoardModal>
    )
}