"use client";

import ProcesoText from "@/components/ui/ProcesoText";
import { TopMenu } from "@/components/TopMenu";
import InputsLayer from "@/components/data-items";
import { useState } from "react";
export default function Home() {
 
  const [data, setData] = useState<string>("");


  return (
    <>
        <TopMenu />

      <section className="flex justify-center items-center h-full p-6  ">
        <div className="max-w-4xl flex flex-col justify-center items-center">
          {/* <h1 className="text-3xl pb-2 font-black leading-tight tracking-tighter md:text-6xl lg:leading-[1.1] text-center text-white">
              Estudia a tu competencia y descubre nuevos <strong>Océanos Azules</strong>
            </h1>*/}
          <h1 className="max-w-4xl mt-8 text-center text-charcoal-600 text-2xl md:text-7xl font-bold">
            Mejora tu Landing page para convertir visitantes en clientes
          </h1>
          {/*<h1 className="max-w-4xl mt-8 text-center text-charcoal-600 text-5xl md:text-7xl font-bold">
              Tu agente auditor que te ayudará analizar el sitio web de tu competencia
            </h1> 
            <p className="max-w-2xl mt-10 text-center text-xl md:text-2xl text-charcoal-350">Analiza el sitio web de tu competencia en segundos, con nuestro potente asistente  de AI  </p>
            <p className="max-w-2xl mt-10 text-center text-xl md:text-2xl text-charcoal-350">Analiza el sitio web de tu competencia en segundos, con nuestro potente asistente  de AI  </p> */}
          <p className="max-w-2xl text-center text-base md:text-2xl text-gray-500">Analiza tu sitio web, compáralo con el de tu competencia en segundos y arma la mejor landing page, con nuestra potente herramienta impulsada con AI</p>
          {/*<div>
            <button className="w-full md:w-auto px-6 py-3 flex items-center justify-center bg-white border border-ivory-400 rounded-lg hover:bg-ivory-50 transition duration-200 ease-in-out group">
              <div className="flex items-center">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5 mr-3"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path></svg><span className="font-roboto font-medium text-lg">Empieza gratis con Google</span>
              </div>
            </button>
          </div> */}
          {
            data ? (
    
                <ProcesoText setData={setData} data={data} />
            
            ) : <InputsLayer data={data}  setData={setData} propsUbication="grid grid-cols-1 md:grid-cols-4 gap-4"/>
          }
        </div>
      </section>
    </>
  );
}
