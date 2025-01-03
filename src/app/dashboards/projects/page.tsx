
import { Globe, HomeIcon, Lightbulb, Plus } from "lucide-react";
import Link from "next/link";
export default function pageProjects() {
    return (<div className="flex-grow p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8 mt-10">
            <h1 className=" lg:mt-0  text-2xl lg:text-4xl font-bold text-charcoal-700">
                Lista de Proyectos
            </h1>
            <button className="flex-shrink-0 bg-terracotta text-white px-4 py-2 text-sm lg:text-base rounded-lg flex items-center hover:bg-terracotta-600 transition-colors duration-200"><Plus /> Nuevo análisis</button>
        </div>
        <section className="grid grid-cols-3 gap-2">
            <div className="bg-sidebar p-6 rounded-lg shadow-md col-span-1"><h2 className="mb-6 text-xl lg:text-2xl font-semibold flex items-center"><Lightbulb className="mr-3" />What to expect</h2><div className="space-y-4"><div className="flex items-start"><div className="w-10 lg:w-12 h-10 lg:h-12 mr-3 lg:mr-4 flex-shrink-0 flex items-center justify-center bg-sidebar rounded-lg border border-ivory-350 shadow-sm">
                <HomeIcon />
            </div><div><h3 className="font-semibold text-base lg:text-lg">Tu sitio web</h3><p className="text-xs lg:text-sm">Have a clearly articulated pain point.</p></div></div><div className="flex items-start"><div className="w-10 lg:w-12 h-10 lg:h-12 mr-3 lg:mr-4 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-lg border border-ivory-350 shadow-sm"><Globe /> </div><div><h3 className="font-semibold text-base lg:text-lg">Sitio web de tu competencia</h3><p className="text-xs lg:text-sm">Initial ideas about who might be experiencing this problem.</p></div></div></div> <div className="w-full flex">
                    <Link href={'projects/3'} className="w-full mt-2 py-2 text-white rounded-lg text-center text-base lg:text-lg text-ivory-50 font-medium bg-terracotta hover:bg-terracotta-600 transition duration-200 ease-in-out shadow-md hover:shadow-lg">Ver</Link>  </div> </div>

        </section>
    </div>)
}