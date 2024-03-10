import { ChevronsUp, GanttChart, GaugeCircle, LucideLockKeyhole } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"

export const PlatformYouCanTrust = () => {
    return (
            <div className="bg-[#FFF] lg:p-16 lg:pb-5 pb-5 p-8 border border-zinc-500 rounded-lg xl:mx-[20%] mx-[2%] lg:mx-[5%]">
                <div className="text-center mb-4">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-2 text-[#000000]">
                        Plataforma en la que puedes confiar.
                    </h1>
                    <p className="text-zinc-700 text-lg md:text-xl font-normal text-center lg:mx-[10%] mx-0">   
                        Sketchlie es una plataforma segura y confiable que puede manejar cualquier situación que se presente
                    </p>
                </div>
                <div className="py-3">
                    <div className="grid grid-cols-1 grid-rows-2 lg:grid-cols-2 rounded-lg my-4">
                        <div className="md:p-7 py-6 m-2 rounded-md">
                            <h1 className="lg:text-2xl md:text-xl text-lg flex items-center font-semibold mb-1">   
                                <GaugeCircle className="mr-2 text-pink-500"/>
                                99.99% de tiempo de actividad
                            </h1>
                            <div className="text-zinc-700 text-lg md:text-xl font-normal">
                                Garantizamos un alto tiempo de actividad para que puedas colaborar sin interrupciones.
                            </div>
                        </div>
                        <div className="md:p-7 py-6 m-2 rounded-md">
                            <h1 className="lg:text-2xl md:text-xl text-lg flex items-center font-semibold mb-1">   
                                <ChevronsUp className="mr-2 text-green-500" />
                                Colaboración con todo tu equipo
                            </h1>
                            <div className="text-zinc-700 text-lg md:text-xl font-normal">
                                Invita a tu equipo a colaborar en tiempo real. Innova, crea, diseña y ejecuta proyectos juntos.
                            </div>
                        </div>
                        <div className="md:p-7 py-6 m-2 rounded-md">
                            <h1 className="lg:text-2xl md:text-xl text-lg flex items-center font-semibold mb-1">   
                                <GanttChart className="mr-2 text-orange-500"/>
                                Planificación de Proyectos
                            </h1>
                            <div className="text-zinc-700 text-lg md:text-xl font-normal">
                                Planifica tus proyectos sin preocupación el único que tiene acceso a tu espacio de trabajo es tu y tu equipo
                            </div>
                        </div>
                        <div className="md:p-7 py-6 m-2 rounded-md">
                            <h1 className="lg:text-2xl md:text-xl text-lg flex items-center font-semibold mb-1">   
                                <LucideLockKeyhole className="mr-2 text-custom-blue"/>
                                Seguridad con AWS
                            </h1>
                            <div className="text-zinc-700 text-lg md:text-xl font-normal">
                                Utilizamos la seguridad de AWS para proteger tus imágenes y datos con la más alta tecnología.
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <Link href={"/dashboard"}>
                        <Button variant="outline" className="text-lg p-6 font-normal mt-4">
                            {"Regístrate gratis"}
                        </Button>
                        </Link>
                    </div>
                </div>
        </div>
    )
}
