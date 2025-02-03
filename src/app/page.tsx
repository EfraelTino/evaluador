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
import dataLanguage from '@/lib/data.json';

import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles, X } from "lucide-react";
import { Card } from "@/components/ui/card";
// Declaración del elemento personalizado
type Language = "es" | "en";

export default function Home() {
  const session: AuthSession | null = useAuthStore((state) => state.session);
  const [language, setLanguage] = useState<Language>('en');
  const { toast } = useToast()
  const [suggesstion, setSuggesstion] = useState<boolean>(false)
  const [data, setData] = useState<string>("");



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
  }
  const handleModal = () => {
    setSuggesstion(!suggesstion)
  }
  useEffect(() => {
    const userLang = navigator.language; // Usamos solo navigator.language
    if (userLang.startsWith("en")) {
      setLanguage("en"); // Esto es válido porque "en" es parte de "Language"
    } else {
      setLanguage("es"); // Lo mismo aquí
    }
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
      <TopMenu dataLanguage={dataLanguage[language]} language={language} setLanguage={setLanguage} />
      <Script
        src="https://mhooqolm.formester.com/widget/standard.js"
        type="module"
        strategy="afterInteractive"
        className="z-10"
      // Se carga después de que el contenido de la página se haya cargado
      />
      <div className="fixed left-4 md:left-10 bottom-2 md:bottom-10 flex z-10 gap-2">
        <Button onClick={handleModal} className="text-white  text-[10px] bg-terracotta  font-bold ">{dataLanguage[language]?.btnSuggestion}</Button>
        <Button
          className="font-bold text-[10px] "
          onClick={() => {
            setLanguage(language === "es" ? "en" : "es");
          }}
        >
          <RefreshCw />
          {language === 'es' ? 'EN' : 'ES'}
        </Button>
      </div>
      {
        suggesstion && <div className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 flex justify-center items-center">
          <div className="max-w-xl rounded-lg relative">
            {/*eslint-disable-next-line @typescript-eslint/no-namespace */}
            <Button onClick={handleModal} className="absolute right-2 top-7 bg-white text-black hover:bg-terracotta hover:text-white"><X /> </Button>
            <div
              dangerouslySetInnerHTML={{ __html: htmlfrom }}
            />

          </div>

        </div>
      }
      <section className="flex justify-center items-center h-full py-20 px-6 md:p-6 fade-in ">
        <div className="max-w-4xl flex flex-col justify-center items-center ">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border mb-8">
            <Sparkles className="w-4 h-4 text-[#A15C3E]" />
            <span className="text-[10px] font-medium">{dataLanguage[language]?.dataAI}</span>
          </div>
          <h1 className="max-w-4xl text-2xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter text-center" dangerouslySetInnerHTML={{ __html: dataLanguage[language]?.title || '' }} />
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto text-center mt-2 md:mt-6" dangerouslySetInnerHTML={{ __html: dataLanguage[language]?.description || '' }} />
          {
            !data ? (

              <ProcesoText data={data} setData={setData} language={language} />

            ) :

              <Card className=" mx-auto w-full p-6 mt-4 md:mt-12 bg-white backdrop-blur-sm md:mb-20">
                <InputsLayer data={data} setData={setData} language={language} dataLanguage={dataLanguage[language]} propsUbication="grid grid-cols-1 md:grid-cols-4 gap-4" />
              </Card>
          }
        </div>
      </section>
    </>
  );
}
