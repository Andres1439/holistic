"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Copy, Check, Loader2, AlertCircle, CheckCircle, BarChart3 } from "lucide-react"

interface CompetitorLink {
  id: string
  url: string
  status: 'pending' | 'loading' | 'success' | 'error'
  error?: string
}

export default function CompetidoresPage() {
  const [activeInterface, setActiveInterface] = useState("links")
  const [competitorLinks, setCompetitorLinks] = useState<CompetitorLink[]>([])
  const [newLink, setNewLink] = useState("")
  const [bulkLinks, setBulkLinks] = useState("")
  const [analysis, setAnalysis] = useState("")
  const [copyStatus, setCopyStatus] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStats, setAnalysisStats] = useState<any>(null)
  const [facebookCopy, setFacebookCopy] = useState("")
  const [isGeneratingFacebook, setIsGeneratingFacebook] = useState(false)



  const addLink = () => {
    if (newLink.trim() && competitorLinks.length < 5) {
      // Validar URL antes de agregar
      const url = newLink.trim()
      
      try {
        const urlObj = new URL(url)
        if (!urlObj.protocol.startsWith('http')) {
          alert('Por favor, ingresa una URL válida que comience con http:// o https://')
          return
        }
      } catch (error) {
        alert('Por favor, ingresa una URL válida')
        return
      }

      const newCompetitorLink: CompetitorLink = {
        id: Date.now().toString(),
        url: url,
        status: 'pending'
      }
      setCompetitorLinks([...competitorLinks, newCompetitorLink])
      setNewLink("")
    }
  }

  const removeLink = (id: string) => {
    setCompetitorLinks(competitorLinks.filter(link => link.id !== id))
  }

  const clearAllLinks = () => {
    setCompetitorLinks([])
    setAnalysis("")
    setAnalysisStats(null)
  }

  const copyAnalysis = async () => {
    if (!analysis.trim()) {
      setCopyStatus("⚠️ NADA QUE COPIAR")
      setTimeout(() => setCopyStatus(""), 2000)
      return
    }

    try {
      await navigator.clipboard.writeText(analysis)
      setCopyStatus("✅ ¡COPIADO!")
      setTimeout(() => setCopyStatus(""), 2000)
    } catch (err) {
      setCopyStatus("❌ ERROR AL COPIAR")
      setTimeout(() => setCopyStatus(""), 2000)
    }
  }

  // 🚀 FUNCIÓN PRINCIPAL DE ANÁLISIS
  const generateAnalysis = async () => {
    // Solo trabajar con la interfaz de enlaces individuales
    if (activeInterface !== "links") {
      setAnalysis("// Esta función está disponible solo en la interfaz de productos.")
      return
    }

    if (competitorLinks.length === 0) {
      setAnalysis("// Por favor, agrega al menos un enlace de competidor para generar el análisis.")
      return
    }

    setIsAnalyzing(true)
    setAnalysis("🚀 Iniciando análisis de productos competidores...\n\n")

    // Actualizar estado de enlaces a loading
    setCompetitorLinks(prev => 
      prev.map(link => ({ ...link, status: 'loading' as const }))
    )

    try {
      // Usar la nueva API route que combina scraping y análisis
      const urls = competitorLinks.map(link => link.url)
      
      const response = await fetch('https://rough-thunder-2dca.andres-st1803.workers.dev/analyze-competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls })
      })

      const result = await response.json()

      if (result.success) {
        // Actualizar estados de enlaces basado en resultados
        setCompetitorLinks(prev => 
          prev.map(link => ({
            ...link,
            status: 'success' as const
          }))
        )

        // Mostrar análisis exitoso
        setAnalysis(result.analysis || 'No se pudo generar copy parafraseado')
        setAnalysisStats({
          total: result.stats?.total_urls || 0,
          successful: result.stats?.successful_scrapes || 0,
          failed: result.stats?.failed_scrapes || 0,
          usage: null
        })

      } else {
        // Error en el análisis
        setCompetitorLinks(prev => 
          prev.map(link => ({ ...link, status: 'error' as const }))
        )

        setAnalysis(`❌ ERROR EN EL ANÁLISIS

${result.error}

${result.details ? `DETALLES:
${result.details.map((d: any) => `• ${d.url}: ${d.error}`).join('\n')}` : ''}

POSIBLES SOLUCIONES:
1. Verifica que las URLs sean válidas y contengan productos
2. Intenta con URLs de sitios más simples (Amazon, MercadoLibre, eBay)
3. Evita sitios que requieran autenticación o tengan captchas
4. Verifica que la página del producto esté disponible públicamente
5. Intenta con diferentes URLs del mismo sitio`)

        if (result.scrape_results) {
          setAnalysisStats({
            total: result.scrape_results.total || 0,
            successful: result.scrape_results.successful || 0,
            failed: result.scrape_results.failed || 0,
            usage: null
          })
        }
      }

    } catch (error: any) {
      // Error general
      setCompetitorLinks(prev => 
        prev.map(link => ({ ...link, status: 'error' as const }))
      )

      setAnalysis(`❌ ERROR INESPERADO

${error.message}

POSIBLES CAUSAS:
• Problema de conectividad
• Límites de API alcanzados
• Configuración incorrecta de variables de entorno

SOLUCIÓN:
Revisa la consola del navegador para más detalles y verifica tu configuración.`)

    } finally {
      setIsAnalyzing(false)
    }
  }

  // 🚀 FUNCIÓN PARA GENERAR COPY DE FACEBOOK
  const generateFacebookCopy = async () => {
    if (!bulkLinks.trim()) {
      setFacebookCopy("// Por favor, ingresa el texto base para generar el copy de Facebook.")
      return
    }

    // Validar configuración
    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      setFacebookCopy(`// ❌ ERROR DE CONFIGURACIÓN

Para usar el generador de copy de Facebook necesitas configurar OpenAI API:

🤖 OPENAI API (OBLIGATORIO):
   1. Obtén tu key en: https://platform.openai.com/account/api-keys
   2. Agrega en .env.local: NEXT_PUBLIC_OPENAI_API_KEY=sk-proj-tu_key

Reinicia el servidor después de configurar la variable.`)
      return
    }

    setIsGeneratingFacebook(true)
    setFacebookCopy("🚀 Generando copy optimizado para Facebook...\n\n")

    try {
      const response = await fetch('https://rough-thunder-2dca.andres-st1803.workers.dev/generate-facebook-copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: bulkLinks,
          style: 'facebook'
        })
      })

      const result = await response.json()

      if (result.success) {
        setFacebookCopy(result.copy || 'No se pudo generar el copy de Facebook')
      } else {
        setFacebookCopy(`❌ ERROR AL GENERAR COPY

${result.error}

POSIBLES SOLUCIONES:
1. Verifica que el texto base sea válido
2. Revisa que OpenAI API esté configurado correctamente
3. Intenta con un texto más descriptivo`)
      }

    } catch (error: any) {
      setFacebookCopy(`❌ ERROR INESPERADO

${error.message}

POSIBLES CAUSAS:
• Problema de conectividad
• Límites de API alcanzados
• Configuración incorrecta de OpenAI API

SOLUCIÓN:
Revisa la consola del navegador para más detalles.`)
    } finally {
      setIsGeneratingFacebook(false)
    }
  }

  const copyFacebookCopy = async () => {
    if (!facebookCopy.trim()) {
      setCopyStatus("⚠️ NADA QUE COPIAR")
      setTimeout(() => setCopyStatus(""), 2000)
      return
    }

    try {
      await navigator.clipboard.writeText(facebookCopy)
      setCopyStatus("✅ ¡COPIADO!")
      setTimeout(() => setCopyStatus(""), 2000)
    } catch (err) {
      setCopyStatus("❌ ERROR AL COPIAR")
      setTimeout(() => setCopyStatus(""), 2000)
    }
  }

  const getStatusIcon = (status: CompetitorLink['status']) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status: CompetitorLink['status']) => {
    switch (status) {
      case 'loading':
        return 'border-blue-500/50 bg-blue-500/5'
      case 'success':
        return 'border-green-500/50 bg-green-500/5'
      case 'error':
        return 'border-red-500/50 bg-red-500/5'
      default:
        return 'border-gray-600 bg-gray-800/50'
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      {/* Fondo animado */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Navbar />
      
      <div className="container mx-auto px-4 py-6 lg:py-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-3xl lg:text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 tracking-tight">
              Parafraseador de Productos
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Analiza productos de tus competidores y genera copy parafraseado automáticamente con IA
            </p>
          </div>

          {/* Estadísticas de uso si están disponibles */}
          {analysisStats && (
            <div className="mb-8">
              <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-400">{analysisStats.successful}</div>
                      <div className="text-sm text-gray-400">Exitosos</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-400">{analysisStats.failed}</div>
                      <div className="text-sm text-gray-400">Fallidos</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-400">{analysisStats.usage?.requests_used || 0}</div>
                      <div className="text-sm text-gray-400">Requests Usados</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-400">{analysisStats.usage?.requests_remaining || 0}</div>
                      <div className="text-sm text-gray-400">Remaining</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Interface Toggle */}
          <div className="flex justify-center mb-8">
            <Tabs value={activeInterface} onValueChange={setActiveInterface} className="w-full max-w-md">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
                <TabsTrigger 
                  value="links" 
                  className="data-[state=active]:bg-purple-500 text-white"
                >
                  🎯 Parafraseador de Productos
                </TabsTrigger>
                <TabsTrigger 
                  value="bulk" 
                  className="data-[state=active]:bg-pink-500 text-white"
                >
                  📝 Copy de Facebook
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Panel de Entrada */}
            <div className="space-y-6">
              {activeInterface === "links" ? (
                <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-200 flex items-center gap-2">
                      🎯 Agregar Productos de Competidores
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Agrega hasta 5 enlaces de productos para generar copy parafraseado
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                  
                  {/* Input para enlaces individuales */}
                  <div className="space-y-2">
                    <Label htmlFor="newLink" className="text-gray-300">
                      URL del Producto Competidor
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="newLink"
                        type="url"
                        value={newLink}
                        onChange={(e) => setNewLink(e.target.value)}
                        placeholder="https://ejemplo.com/producto"
                        className="flex-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-400"
                        disabled={competitorLinks.length >= 5 || isAnalyzing}
                      />
                      <Button
                        onClick={addLink}
                        disabled={!newLink.trim() || competitorLinks.length >= 5 || isAnalyzing}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-4"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      {competitorLinks.length}/5 productos agregados
                    </p>
                    <div className="text-xs text-gray-400 mt-2 p-2 bg-gray-800/50 rounded">
                      <p className="font-semibold mb-1">💡 URLs recomendadas:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Amazon: https://amazon.com/dp/PRODUCT_ID</li>
                        <li>• MercadoLibre: https://mercadolibre.com.ar/ITEM_ID</li>
                        <li>• eBay: https://ebay.com/itm/ITEM_ID</li>
                        <li>• Evita sitios con autenticación o captchas</li>
                      </ul>
                    </div>
                  </div>

                  {/* Lista de enlaces agregados */}
                  {competitorLinks.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-gray-300">Productos a Analizar:</Label>
                      <div className="space-y-2">
                        {competitorLinks.map((link) => (
                          <div key={link.id} className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-200 ${getStatusColor(link.status)}`}>
                            <div className="flex-shrink-0">
                              {getStatusIcon(link.status)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-gray-300 truncate">{link.url}</div>
                              {link.error && (
                                <div className="text-xs text-red-400 mt-1">{link.error}</div>
                              )}
                            </div>
                            <Button
                              onClick={() => removeLink(link.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              disabled={isAnalyzing}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={clearAllLinks}
                        variant="outline"
                        size="sm"
                        className="w-full text-gray-400 border-gray-600 hover:bg-gray-800"
                        disabled={isAnalyzing}
                      >
                        Limpiar Todos
                      </Button>
                    </div>
                  )}

                  {/* Botón de análisis */}
                  <Button
                    onClick={generateAnalysis}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
                    disabled={competitorLinks.length === 0 || isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analizando Productos...
                      </>
                    ) : (
                      <>
                        🚀 Generar Copy Parafraseado
                      </>
                    )}
                  </Button>

                  {/* Información de APIs */}
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="text-sm text-blue-300">
                      <div className="font-semibold mb-1">📋 Configuración:</div>
                      <div className="text-xs space-y-1">
                        <div>• ScraperAPI: Configurado en servidor</div>
                        <div>• OpenAI API: {process.env.NEXT_PUBLIC_OPENAI_API_KEY ? '✅ Configurado' : '❌ No configurado'}</div>
                        <div>• Next.js: v15 App Router ✅</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ) : (
                <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-200 flex items-center gap-2">
                      📝 Generador de Copy para Facebook
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Convierte cualquier texto en copy optimizado para redes sociales
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* Textarea para texto base */}
                    <div className="space-y-2">
                      <Label htmlFor="bulkLinks" className="text-gray-300">
                        Texto Base para Convertir
                      </Label>
                      <Textarea
                        id="bulkLinks"
                        value={bulkLinks}
                        onChange={(e) => setBulkLinks(e.target.value)}
                        placeholder="Describe tu producto, servicio o idea aquí... Ejemplo: 'Vendo un curso de programación que enseña React desde cero hasta proyectos avanzados'"
                        className="min-h-[120px] bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-pink-400 resize-none"
                        disabled={isGeneratingFacebook}
                      />
                      <p className="text-xs text-gray-500">
                        El texto será convertido en copy optimizado para Facebook con emojis y estructura atractiva
                      </p>
                    </div>

                    {/* Botón de generación */}
                    <Button
                      onClick={generateFacebookCopy}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3"
                      disabled={!bulkLinks.trim() || isGeneratingFacebook}
                    >
                      {isGeneratingFacebook ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generando Copy de Facebook...
                        </>
                      ) : (
                        <>
                          🚀 Generar Copy de Facebook
                        </>
                      )}
                    </Button>

                    {/* Información de APIs */}
                    <div className="mt-4 p-3 bg-pink-500/10 border border-pink-500/20 rounded-lg">
                      <div className="text-sm text-pink-300">
                        <div className="font-semibold mb-1">📋 Configuración:</div>
                        <div className="text-xs space-y-1">
                          <div>• OpenAI API: {process.env.NEXT_PUBLIC_OPENAI_API_KEY ? '✅ Configurado' : '❌ No configurado'}</div>
                          <div>• Next.js: v15 App Router ✅</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Panel de Resultados */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border-gray-700/50">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl text-gray-200 flex items-center gap-2">
                      {activeInterface === "links" ? "📝 Copy Parafraseado" : "📝 Copy de Facebook"}
                    </CardTitle>
                    <Button
                      onClick={activeInterface === "links" ? copyAnalysis : copyFacebookCopy}
                      variant="outline"
                      size="sm"
                      className="text-gray-400 border-gray-600 hover:bg-gray-800"
                      disabled={activeInterface === "links" ? (!analysis.trim() || isAnalyzing) : (!facebookCopy.trim() || isGeneratingFacebook)}
                    >
                      {copyStatus ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <CardDescription className="text-gray-400">
                    {activeInterface === "links" 
                      ? (copyStatus || "Copy generado automáticamente basado en análisis de competidores")
                      : (copyStatus || "Copy optimizado para Facebook con emojis y estructura atractiva")
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={activeInterface === "links" ? analysis : facebookCopy}
                    readOnly
                    placeholder={activeInterface === "links" 
                      ? "El copy parafraseado se generará automáticamente después del análisis..."
                      : "El copy de Facebook se generará automáticamente después de procesar el texto..."
                    }
                    className="min-h-[500px] bg-gray-950 border-gray-700 text-gray-300 font-mono text-sm resize-none"
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-12 text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-full text-sm text-purple-400 border border-purple-500/20">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>IA en tiempo real para copy optimizado</span>
            </div>
            
            <div className="text-sm text-gray-500 max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-left">
                  <h4 className="font-semibold text-gray-300 mb-2">🎯 Parafraseador de Productos:</h4>
                  <p className="text-xs">
                    Analiza hasta 5 productos de competidores y genera copy parafraseado 
                    optimizado para diferentes enfoques de marketing.
                  </p>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-300 mb-2">📝 Copy de Facebook:</h4>
                  <p className="text-xs">
                    Convierte cualquier texto en copy optimizado para redes sociales con 
                    emojis, hashtags y estructura atractiva.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 