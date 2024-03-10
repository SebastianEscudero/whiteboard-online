"use client";

import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useEffect, useState } from "react";
import Sidebar from "./sidebar";

const MobileSidebar = ({
}) => {
    const[isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return ( 
        <Sheet>
            <SheetTrigger>
                <Button variant="ghost" size="icon" className="xl:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0">
                <Sidebar/>
            </SheetContent>
        </Sheet>
     );
}
 
export default MobileSidebar;