import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

interface FaqItem {
    value: string;
    trigger: string;
    content: string;
  }
  
  interface FaqSectionProps {
    accordionData: FaqItem[];
  }

export const FaqSection = ({
    accordionData,
}: FaqSectionProps) => {
    return (
        <>
            <div className="lg:mx-[10%] mx-[5%] my-10 font-normal text-[#1c1c1e]">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl sm:text-left text-center">
                    Preguntas frecuentes de las pizarras online de Sketchlie
                </h1>
            </div>
            <Accordion type="single" collapsible className="lg:mx-[10%] sm:mx-[5%] mx-0 text-xl md:text-2xl bg-white p-3 mb-20">
                {accordionData.map(item => (
                    <AccordionItem value={item.value} key={item.value}>
                        <AccordionTrigger className="my-3">{item.trigger}</AccordionTrigger>
                        <AccordionContent className="px-4 text-lg" style={{ whiteSpace: 'pre-line' }}>
                            {item.content}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </>
    )
}