'use client';

import ProcesoText from "@/components/ui/ProcesoText";
import { TopMenu } from "@/components/TopMenu";
import InputsLayer from "@/components/data-items";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { AuthSession } from "@/types/auth";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const session: AuthSession | null = useAuthStore((state) => state.session);
  const { toast } = useToast()

  const [data, setData] = useState<string>("");
  console.log("session: ", session?.user?.email)
  const sendData = async () => {
    const res = await axios.post("/api/login", {
      name: session?.user?.name,
      photoURL: session?.user?.photoURL,
      email: session?.user?.email,
      userid:  session?.user?.id,
    });
    const {status, message} = res.data;
    if(status === true){
   return   toast({
        description: message
      });
    }
    return toast({
      variant: 'destructive',
      description: message,
    })
    console.log(" res frontend: ",res)
  }
  useEffect(() => {
    if (typeof window !== "undefined" && session?.user) {
      sendData();
    }
  }, [session?.user]);
  

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

              <ProcesoText data={data}  setData={setData}/>

            ) : <InputsLayer data={data} setData={setData} propsUbication="grid grid-cols-1 md:grid-cols-4 gap-4" />
          }
        </div>
      </section>
    </>
  );
}
