'use client';

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

          <h1 className="max-w-4xl mt-8 text-center text-charcoal-600 text-2xl md:text-7xl font-bold">
            Mejora tu Landing page para convertir visitantes en clientes
          </h1>
          {
            data ? (
    
                <ProcesoText  data={data} />
            
            ) : <InputsLayer data={data}  setData={setData} propsUbication="grid grid-cols-1 md:grid-cols-4 gap-4"/>
          }
        </div>
      </section>
    </>
  );
}
