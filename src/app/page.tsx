'use client';

import ProcesoText from "@/components/ui/ProcesoText";
import { TopMenu } from "@/components/TopMenu";
import InputsLayer from "@/components/data-items";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { AuthSession } from "@/types/auth";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import Script from "next/script";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
// Declaración del elemento personalizado
export default function Home() {
  const session: AuthSession | null = useAuthStore((state) => state.session);
  const { toast } = useToast()
  const [suggesstion, setSuggesstion] = useState<boolean>(false)
  const [data, setData] = useState<string>("");
  console.log("session: ", session?.user?.email)
  const sendData = async () => {
    const res = await axios.post("/api/login", {
      name: session?.user?.name,
      photoURL: session?.user?.photoURL,
      email: session?.user?.email,
      userid: session?.user?.id,
    });
    const { status, message } = res.data;
    if (status === true) {
      return toast({
        description: message
      });
    }
    return toast({
      variant: 'destructive',
      description: message,
    })
    console.log(" res frontend: ", res)
  }
  const handleModal = ()=>{
    setSuggesstion(!suggesstion)
  }
  useEffect(() => {

    if (typeof window !== "undefined" && session?.user) {
      sendData();
    }
    const script = document.createElement('script');
    script.src = 'https://mhooqolm.formester.com/widget/standard.js';
    script.type = 'module';
    script.async = true;
    document.body.appendChild(script);

    // Limpieza cuando el componente se desmonta
    return () => {
      document.body.removeChild(script);
    };
  }, [session?.user]);
  const htmlfrom = `<formester-standard-form
            set-auto-height="true"
            height="80%"
            id="1afb3c78-e46f-4a5b-be54-d0949c0aad41"
            url="https://mhooqolm.formester.com/f/1afb3c78-e46f-4a5b-be54-d0949c0aad41"
          />`;

  return (
    <>
      <TopMenu />
      <Script
        src="https://mhooqolm.formester.com/widget/standard.js"
        type="module"
        strategy="afterInteractive" 
        className="z-10"
        // Se carga después de que el contenido de la página se haya cargado
      />
      <Button  onClick={handleModal} className="text-white z-10 bg-terracotta fixed left-4 md:left-10 font-bold bottom-4 md:bottom-10">Solita una nueva función</Button>
      {
        suggesstion && <div className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 flex justify-center items-center">
        <div className="max-w-xl rounded-lg relative">
          {/*eslint-disable-next-line @typescript-eslint/no-namespace */}
          <Button onClick={handleModal} className="absolute right-2 top-7 bg-white text-black"><X /> </Button>
          <div
      dangerouslySetInnerHTML={{ __html: htmlfrom }}
    />
        </div>
      </div>
      }
      <section className="flex justify-center items-center h-full p-6 fade-in ">
        <div className="max-w-4xl flex flex-col justify-center items-center ">

          <h1 className="max-w-4xl mt-8 text-center text-charcoal-600 text-2xl md:text-7xl font-bold">
            Mejora tu <strong className="font-extrabold">Landing page</strong> para <strong className="font-extrabold">convertir visitantes en clientes</strong>
          </h1>
          <p className="text-center text-gray-500 text-lg md:text-xl  leading-6 md:leading-normal my-2 md:my-8">Analiza tu sitio web, compáralo con el de tu competencia en segundos y arma la mejor landing page, con nuestra potente herramienta impulsada con <strong>AI.</strong></p>
          {
            data ? (

              <ProcesoText data={data} setData={setData} />

            ) : <InputsLayer data={data} setData={setData} propsUbication="grid grid-cols-1 md:grid-cols-4 gap-4" />
          }
        </div>
      </section>
    </>
  );
}
