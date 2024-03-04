import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

interface StepItem {
    trigger: string;
    text: string;
  }

interface BlogSectionProps {
    steps: StepItem[];
}

export const HowToCreate = ({
    steps,
}: BlogSectionProps) => {
    return (
        <div className={`bg-[#fff] rounded-lg border border-black lg:mx-[10%] mx-[5%] font-normal text-[#1c1c1e] px-0 xl:px-20`}>
            <h1 className="text-2xl lg:text-3xl xl:text-4xl text-center my-8">
                Cómo hacer un diagrama de flujo
            </h1>
            <Accordion type="single" collapsible className="bg-white p-3 rounded-lg">
                {steps.map(item => (
                    <AccordionItem value={item.trigger} key={item.trigger}>
                        <AccordionTrigger className="my-3 text-lg md:text-xl xl:text-2xl">{item.trigger}</AccordionTrigger>
                        <AccordionContent className="px-4 text-lg md:text-xl xl:text-2xl" style={{ whiteSpace: 'pre-line' }}>
                            {item.text}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}