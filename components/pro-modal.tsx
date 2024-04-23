"use client";

import { Card } from "@/components/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useProModal } from "@/hooks/use-pro-modal";
import { Check, ChevronsDown, Zap } from "lucide-react";
import { Badge } from "./ui/badge";
import { SubscriptionButton } from "./subscription-button";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { subscriptionPlans } from "@/lib/subscriptionPlans";

const paidPlans = subscriptionPlans.filter(plan => plan.label !== "Gratis");

export const ProModal = () => {
    const proModal = useProModal();
    const [selectedOrganization, setSelectedOrganization] = useState<any>("");
    const user = useCurrentUser();
    const organizations = user?.organizations;

    if (!organizations) {
        return null;
    }

    return (
        <div>
            <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
                <DialogContent className="max-w-[1080px] w-full overflow-y-auto h-full xl:max-h-[700px] lg:max-h-[700px] max-h-[650px] my-3">
                    <DialogHeader>
                        <DialogTitle className="flex justify-center items-center flex-col text-sm md:text-base">
                            <div className="flex items-center gap-x-2 font-bold text-2xl">
                                Sketchlie
                                <Zap className="w-6 h-6 text-custom-blue fill-custom-blue" />
                            </div>
                        </DialogTitle>
                        <div className="flex justify-center text-lg md:text-xl items-center flex-wrap">
                            <p>Choose organization to upgrade:</p>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <div
                                        className="text-xl md:text-2xl flex flex-row items-center ml-3 text-custom-blue hover:bg-accent rounded-md"
                                    >
                                        {selectedOrganization.name || "Select organization"}
                                        <ChevronsDown className="ml-2" />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <div className="flex flex-col gap-y-2">
                                        {organizations.map((organization) => (
                                            <DropdownMenuItem
                                                className="w-[200px] truncate"
                                                key={organization.id}
                                            >
                                                <Button
                                                    onClick={() => setSelectedOrganization(organization)}
                                                    variant="selectOrg"
                                                    className="p-0 w-full flex justify-start">
                                                    <div className="ml-2 text-left w-[180px] text-sm md:text-base">
                                                        <p className="text-[12px] md:text-[14px] truncate">
                                                            {organization.name}
                                                        </p>
                                                        <p className="truncate text-[10px] md:text-[12px] text-zinc-400">{organization.subscriptionPlan} - {organization.users.length} members </p>
                                                    </div>
                                                </Button>
                                            </DropdownMenuItem>
                                        ))}
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <DialogDescription className="gap-4 text-zinc-900 font-medium flex flex-col md:flex-row max-h-[700px] pt-4 text-sm md:text-base">
                            {paidPlans.map((subscriptionPlan) => (
                                <Card
                                    key={subscriptionPlan.label}
                                    className={`p-5 md:flex flex-col flex-1 ${subscriptionPlan.recommended && 'border-2 border-custom-blue'}`}>
                                    <div className="h-[120px]">
                                        <div className="gap-x-4 font-semibold text-lg md:text-xl mb-2 flex">
                                            {subscriptionPlan.recommended ?
                                                <>
                                                    {subscriptionPlan.label}
                                                    <Badge variant="outline" className="uppercase text-xs md:text-sm py-1">
                                                        Popular
                                                    </Badge>
                                                </>
                                                : subscriptionPlan.label}
                                        </div>
                                        <div className="text-xs md:text-sm mb-auto">
                                            {subscriptionPlan.description}
                                        </div>
                                    </div>
                                    <div className="flex font-bold text-lg md:text-xl">
                                        {subscriptionPlan.price}$/m
                                    </div>
                                    <p className="text-sm md:text-base">por miembro</p>
                                    <div className="flex flex-col gap-y-2 mt-8 flex-1 mb-4 text-sm md:text-base">
                                        <p>Todas las características del plan gratis más:</p>
                                        {Object.entries(subscriptionPlan.features).map(([feature, value]) => (
                                            <div key={feature} className="flex items-center gap-x-2">
                                                <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                                <span className="text-black-5">{feature}:</span>
                                                <span className="text-black-5 font-bold">{value}</span>
                                            </div>
                                        ))}
                                        {subscriptionPlan.extraFeatures && (
                                            <div className="flex items-center gap-x-2">
                                                <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                                <span className="text-black-5 font-bold">{subscriptionPlan.extraFeatures}</span>
                                            </div>
                                        )}
                                    </div>
                                    <SubscriptionButton
                                        plan={subscriptionPlan}
                                        selectedOrganization={selectedOrganization}
                                    />
                                </Card>
                            ))}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}