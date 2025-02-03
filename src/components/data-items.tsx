import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { useState } from "react";
import isValidUrl from "@/utils/isValidUrl";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { AuthSession } from "@/types/auth";
import LoginButton from "./LoginButton";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

//grid grid-cols-5 gap-4
interface propsInput {
  data?: string,
  setData: React.Dispatch<React.SetStateAction<string>>; // Asegúrate de que sea Dispatch<SetStateAction<string>>
  propsUbication?: string;
  language:string;
  dataLanguage: { dataAction:string; principalView: { actionSubmit: string, labelOne: string, labelTwo: string, placeHolderOne: string, placeholderTwo: string } }
}
export default function InputsLayer({ setData, propsUbication, dataLanguage, language }: propsInput) {
  console.log(language);
  const session: AuthSession | null = useAuthStore((state) => state.session);

  const [firstUrl, setFirstUrl] = useState<string>("");
  const [secondUrl, setSecondUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setloading] = useState(false);
  //const [selectValue, setSelectValue] = useState<number>(0);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstUrl(e.target.value)
  }
  const handleChangeSecond = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecondUrl(e.target.value)
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
      const response = await axios.post("/api/process", { urls: [firstUrl, secondUrl], procesador: 1, userid: session?.user?.id, language:language });

      if (response.status === 200) {
        return setData(response.data.results)
      }
    } catch {
      return setError("Error, intenta de nuevo.")

    } finally {
      setloading(false)
    }

  }
  return (<>
    <form action="" onSubmit={handleSubmit} className="space-y-4 md:mt-10 max-w-4xl w-full ">
      <div className={propsUbication}>
        <div className="col-span-2 space-y-2">
          <label htmlFor="email" className="font-semibold text-sm lg:text-lg">{dataLanguage?.principalView?.labelOne}</label>
          <Input type="text" id="url" placeholder={dataLanguage?.principalView?.placeHolderOne} className="w-full px-3  placeholder:text-silver-900 focus-visible:ring-terracotta focus:ring-0 h-11 resize-none bg-white" onChange={handleChange} value={firstUrl} />

        </div>
        <div className="col-span-2 space-y-2">
          <label htmlFor="email" className="font-semibold text-sm lg:text-lg">{dataLanguage?.principalView?.labelTwo}</label>
          <Input type="text" id="secondurl" placeholder={dataLanguage?.principalView?.placeholderTwo} className="w-full px-3  placeholder:text-silver-900 focus-visible:ring-terracotta focus:ring-0 h-11 resize-none bg-white" onChange={handleChangeSecond} value={secondUrl} />
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
            <motion.div
            initial={{ rotate: 0, scale: 1 }}
            animate={{
              rotate: [0, 360], // Rota 360 una vez
              scale: [1, 1.2, 1], // Escalado infinito después del giro
              opacity: [1, 0.5, 1],
            }}
            transition={{
              rotate: { duration: 1, ease: "easeInOut" },
              scale: {
                delay: 1, // Espera a que termine el giro antes de iniciar el escalado
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              },
              opacity: {
                delay: 1,
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
            className="w-6 h-6 text-[#A15C3E]"
          >
            <Sparkles />
          </motion.div>

          ) :
            session?.user ? (<Button

              className="bg-[#A15C3E] hover:bg-[#8B4E35] text-white w-full md:w-auto px-12 h-12 text-lg">{dataLanguage?.principalView?.actionSubmit}  <ArrowRight className="ml-2 w-5 h-5" /></Button>) : (
              <LoginButton dataLanguage={dataLanguage} provider="google" className="shadow-sm border-gray-300" />

            )
        }
      </div>
      {
        error && <div className="flex justify-center w-full"><span className="text-center  text-red-600 text-sm font-bold rounded px-3">{error}</span></div>
      }
    </form>

  </>)
}