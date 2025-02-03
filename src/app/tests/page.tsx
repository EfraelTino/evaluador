import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF9F6] to-white">
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image src="/placeholder.svg" alt="LandingLab Logo" width={32} height={32} className="w-8 h-8" />
          <span className="text-[#A15C3E] text-xl font-medium">LandingLab</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost">Iniciar sesión</Button>
          <Button variant="outline" className="bg-[#A15C3E] text-white hover:bg-[#8B4E35] hover:text-white">
            Registrarse
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 mt-16 md:mt-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border mb-4">
            <Sparkles className="w-4 h-4 text-[#A15C3E]" />
            <span className="text-sm font-medium">Potenciado por Inteligencia Artificial</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter">
            Mejora tu Landing page para convertir visitantes en clientes
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Analiza tu sitio web, compáralo con el de tu competencia en segundos y arma la mejor landing page, con
            nuestra potente herramienta impulsada con <span className="font-medium">AI</span>.
          </p>

          <Card className="max-w-2xl mx-auto p-6 mt-12 bg-white/50 backdrop-blur-sm">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-left text-lg font-medium">Tu sitio web</label>
                  <Input type="url" placeholder="https://tusitioweb.com/" className="h-12" />
                </div>

                <div className="space-y-2">
                  <label className="block text-left text-lg font-medium">Sitio de competencia</label>
                  <Input type="url" placeholder="https://competencia.com/" className="h-12" />
                </div>
              </div>

              <Button
                size="lg"
                className="bg-[#A15C3E] hover:bg-[#8B4E35] text-white w-full md:w-auto px-12 h-12 text-lg"
              >
                Analizar ahora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </Card>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 rounded-lg bg-white shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Análisis Rápido</h3>
              <p className="text-muted-foreground">Resultados detallados en segundos sobre tu landing page</p>
            </div>
            <div className="p-6 rounded-lg bg-white shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Comparativa AI</h3>
              <p className="text-muted-foreground">Insights basados en IA para mejorar tu conversión</p>
            </div>
            <div className="p-6 rounded-lg bg-white shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Optimización</h3>
              <p className="text-muted-foreground">Recomendaciones personalizadas de mejora</p>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-4 left-4 space-x-4">
        <Button variant="outline" size="sm">
          EN
        </Button>
        <Button variant="secondary" size="sm" className="bg-[#A15C3E] text-white hover:bg-[#8B4E35]">
          Solicita una nueva función
        </Button>
      </div>
    </div>
  )
}

