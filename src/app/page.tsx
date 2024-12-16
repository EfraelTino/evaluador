"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { useState } from "react";
import isValidUrl from "@/utils/isValidUrl";
import axios from "axios";
import ProcesoText from "@/components/ui/ProcesoText";
import { Skeleton } from "@/components/ui/skeleton";
export default function Home() {
  const [firstUrl, setFirstUrl] = useState("");
  const [secondUrl, setSecondUrl] = useState("");
  const [data, setData] = useState("");
  const [loading, setloading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstUrl(e.target.value)
    console.log(e.target.value)
  }
  const handleChangeSecond = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecondUrl(e.target.value)
    console.log(e.target.value)
  }
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      setloading(true);
      const urlItem = isValidUrl(firstUrl);
      const urlitemtwo = isValidUrl(secondUrl);
      console.log(urlItem)
     const response = await axios.post("/api/process", { urls: [urlItem, urlitemtwo] });
      setData(response.data.results)
      console.log(response.data);
    } catch (error) {
      console.log("error: ", error)
    } finally {
     // setloading(false)
    }

  }

  return (
    <>
      <div className="bg-pared top-0 left-0 right-0 bottom-0 z-0 fixed"></div>
      <div className="bg-black bg-opacity0 fixed top-0 right-0 left-0 bottom-0 z-[2]"></div>
      <section className="flex justify-center items-center h-full p-6 relative z-20">
        <div className="">
          <div className="max-w-4xl relative z-20">
            <h1 className="text-3xl pb-2 font-black leading-tight tracking-tighter md:text-6xl lg:leading-[1.1] text-center text-white">
              Tu agente auditor que te ayudará analizar el sitio web de tu competencia
            </h1>
            <p className="text-center text-lg text-white py-4">Analiza el sitio web de tu competencia en segundos, con nuestro potente asistent  de AI  </p>
            {
              data ? (
                <div className="rounded-lg border border-ring overflow-x-auto">
                  <ProcesoText data={data} />
                </div>
              ) : <form action="" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1 space-y-2">
                    <label htmlFor="email" className="text-white text-opacity-90 text-sm">El enlace de tu sitio web</label>
                    <Input type="text" id="url" placeholder="Enlace de tu sitio web" className="bg-white" onChange={handleChange} value={firstUrl} />
                  </div>
                  <div className="col-span-1 space-y-2">
                    <label htmlFor="email" className="text-white text-opacity-90 text-sm">El enlace del sitio web de tu competencia</label>
                    <Input type="text" id="secondurl" placeholder="Enlace de sitio web de tu competencia" className="bg-white" onChange={handleChangeSecond} value={secondUrl} />
                  </div>
                </div>
                <div className="flex justify-center">
                  {
                    loading ? (<Skeleton className="h-4 w-full bg-primary/70 " />) : <Button className="bg-yellow-500 text-black hover:bg-yellow-600 font-bold">Analizar sitio web</Button>
                  }
                </div>
              </form>
            }
          </div>
        </div>
      </section>
    </>
  );
}
