import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { useState } from "react";
import isValidUrl from "@/utils/isValidUrl";
import axios from "axios";
//grid grid-cols-5 gap-4
interface propsInput{
    data?:string,
    setData: React.Dispatch<React.SetStateAction<string>>; // Asegúrate de que sea Dispatch<SetStateAction<string>>
    propsUbication?:string
}
export default function InputsLayer({ setData, propsUbication}: propsInput) {
    const [firstUrl, setFirstUrl] = useState<string>("");
    const [secondUrl, setSecondUrl] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setloading] = useState(false);
    //const [selectValue, setSelectValue] = useState<number>(0);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFirstUrl(e.target.value)
      console.log(e.target.value)
    }
    const handleChangeSecond = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSecondUrl(e.target.value)
      console.log(e.target.value)
    }
  //  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    ///  const valueitem = parseInt(e.target.value);
      //setSelectValue(valueitem)
    //}
    const handleSubmit = async (e: React.SyntheticEvent) => {
      e.preventDefault();
      try {
        setError('');
        setloading(true);
        const urlItem = isValidUrl(firstUrl);
        const urlitemtwo = isValidUrl(secondUrl);
  
        if (!urlItem || !urlitemtwo) {
          return setError('Ingresa una url válida');
        }
      //  console.log({ urls: [firstUrl, secondUrl], procesador: selectValue })
        const response = await axios.post("/api/process", { urls: [firstUrl, secondUrl], procesador: 1 });
        setData(response.data.results)
        console.log(response);
      } catch (error) {
        console.log("error: ", error)
      } finally {
        setloading(false)
      }
  
    }
    return (<>
        <form action="" onSubmit={handleSubmit} className="space-y-4 mt-10 max-w-4xl w-full">
            <div className={propsUbication}>
                <div className="col-span-2 space-y-2">
                    <label htmlFor="email" className="font-semibold text-base lg:text-lg">Enlace de tu sitio web</label>
                    <Input type="text" id="url" placeholder="Enlace de tu sitio web" className="w-full px-3  placeholder:text-silver-900 focus-visible:ring-terracotta focus:ring-0 h-11 resize-none bg-white" onChange={handleChange} value={firstUrl} />

                </div>
                <div className="col-span-2 space-y-2">
                    <label htmlFor="email" className="font-semibold text-base lg:text-lg">Enlace del sitio web de tu competencia</label>
                    <Input type="text" id="secondurl" placeholder="Enlace de sitio web de tu competencia" className="w-full px-3  placeholder:text-silver-900 focus-visible:ring-terracotta focus:ring-0 h-11 resize-none bg-white" onChange={handleChangeSecond} value={secondUrl} />
                </div>
              {/*   <div className="col-span-1 space-y-2 w-full">
                    <label htmlFor="email" className="font-semibold text-base lg:text-lg">Seleccionar AI</label>
                    <select name="ai" onChange={handleSelect} id="" className="flex h-11 items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-terracotta  [&>span]:line-clamp-1 w-full text-black bg-white">
                        <option value="0">Open AI</option>
                        <option value="1">Gemini</option>
                    </select>
                </div>
                */}
            </div>

            <div className="flex justify-center">
                {
                    loading ? (
                <>
                
                 <div className="relative flex justify-center">
                 <span className="absolute  w-6 h-6 rounded-full bg-terracotta animate-pulse"></span>
                 </div>
                </>  
                
                  ) : <Button className="w-full md:w-auto px-6 py-6 flex justify-center items-center gap-2 text-lg text-white bg-terracotta hover:bg-terracotta-600 border-[0.5px] border-terracotta-500 rounded-lg transition duration-200 ease-in-out">Analizar sitio web</Button>
                }
            </div>
            {
                error && <div className="flex justify-center w-full"><span className="text-center  text-red-600 text-sm font-bold rounded px-3">{error}</span></div>
            }
        </form>

    </>)
}