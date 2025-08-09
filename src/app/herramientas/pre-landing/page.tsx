"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Navbar from "@/components/Navbar"
import { generateLandingPageHTML } from "../../../lib/landingPageTemplate"

// Componente reutilizable para el modal de la landing page
const LandingPageModal = ({ countdown, finalUrl, isActive }: { countdown: number; finalUrl: string; isActive: boolean }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {/* Modal container con borde animado */}
      <div className="relative bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden animate-in zoom-in duration-500">
        {/* Borde gradiente animado */}
        <div className="absolute inset-0 bg-gradient-to-45 from-red-400 via-blue-400 via-yellow-400 to-red-400 bg-[length:400%_400%] animate-gradient-x rounded-2xl">
          <div className="absolute inset-[3px] bg-white rounded-2xl"></div>
        </div>
        
        {/* Contenido del modal */}
        <div className="relative p-6 text-center">
          {/* Icono principal */}
          <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-3xl animate-pulse">
            🎁
          </div>
          
          {/* Título */}
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            ¡Oferta Exclusiva Desbloqueada!
          </h2>
          
          {/* Descripción */}
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Estás a punto de ser redirigido a una página con una promoción especial. ¡Prepárate!
          </p>
          
          {/* Contador */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <span className="text-gray-700 font-semibold">
              Serás redirigido en{' '}
              <span className="text-red-500 text-xl font-bold animate-pulse">
                {countdown}
              </span>
              {' '}segundos...
            </span>
          </div>
          
          {/* Botón principal */}
          <button
            disabled={countdown > 0}
            className={`w-full py-4 px-6 rounded-xl font-bold uppercase tracking-wide transition-all duration-300 relative overflow-hidden ${
              countdown > 0
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95'
            }`}
          >
            <span className="relative z-10">
              {countdown > 0 ? 'Por favor, espera...' : 'IR A LA OFERTA AHORA'}
            </span>
            
            {/* Icono de mano (solo cuando está activo) */}
            {countdown === 0 && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg animate-bounce">
                👉
              </span>
            )}
            
            {/* Efecto shimmer para el botón activo */}
            {countdown === 0 && (
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PreLandingPage() {
  const [finalUrl, setFinalUrl] = useState("")
  const [countdown, setCountdown] = useState(5)
  const [activeDevice, setActiveDevice] = useState("desktop")
  const [copyStatus, setCopyStatus] = useState("")
  const previewFrameMobileRef = useRef<HTMLIFrameElement>(null)
  const previewFrameDesktopRef = useRef<HTMLIFrameElement>(null)

  // Memoizar el código HTML generado para evitar regeneraciones innecesarias
  const generatedCode = useMemo(() => {
    if (!finalUrl.trim()) {
      return "// Por favor, ingresa la URL de Destino Final."
    }
    return generateLandingPageHTML(finalUrl, countdown)
  }, [finalUrl, countdown])

  const changeCountdown = (delta: number) => {
    const current = parseInt(countdown.toString()) || 5
    const newValue = Math.max(1, Math.min(30, current + delta))
    setCountdown(newValue)
  }

  const switchDevice = (device: string) => {
    setActiveDevice(device)
  }

  const copyCode = async () => {
    if (!generatedCode || generatedCode.startsWith("//")) {
      setCopyStatus("⚠️ NADA QUE COPIAR")
      setTimeout(() => setCopyStatus(""), 2000)
      return
    }

    try {
      await navigator.clipboard.writeText(generatedCode)
      setCopyStatus("✅ ¡COPIADO!")
      setTimeout(() => setCopyStatus(""), 2000)
    } catch (err) {
      setCopyStatus("❌ ERROR AL COPIAR")
      setTimeout(() => setCopyStatus(""), 2000)
    }
  }

  const updatePreview = (htmlCode: string) => {
    const blob = new Blob([htmlCode], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    
    if (previewFrameMobileRef.current) {
      previewFrameMobileRef.current.src = url
    }
    if (previewFrameDesktopRef.current) {
      previewFrameDesktopRef.current.src = url
    }
    
    // Cleanup function to revoke URL
    const cleanup = () => {
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    }
    
    if (previewFrameMobileRef.current) {
      previewFrameMobileRef.current.onload = cleanup
    }
    if (previewFrameDesktopRef.current) {
      previewFrameDesktopRef.current.onload = cleanup
    }
  }

  // Actualizar preview cuando cambie el código generado
  useEffect(() => {
    if (generatedCode.startsWith("//")) {
      updatePreview(`<html><body style="font-family: sans-serif; text-align: center; padding-top: 50px; color: #888;">${generatedCode}</body></html>`)
    } else {
      updatePreview(generatedCode)
    }
  }, [generatedCode])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      {/* Fondo animado */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Navbar />
      
      <div className="container mx-auto px-4 py-6 lg:py-10">
        <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 xl:gap-10 max-w-7xl mx-auto items-stretch">
          
          {/* Panel de Control */}
          <div className="w-full xl:w-[450px] xl:flex-shrink-0">
            <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm p-6 lg:p-8 rounded-2xl shadow-2xl border border-gray-700/50 xl:sticky xl:top-6 h-full flex flex-col">
              
              <h1 className="text-2xl lg:text-3xl xl:text-4xl font-extrabold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-6 lg:mb-8 text-center tracking-tight">
                Enmascarar Landing Page
              </h1>

              {/* URL Input */}
              <div className="mb-6">
                <label className="block mb-3 font-semibold text-sm lg:text-base text-gray-200">
                  URL de Destino Final
                </label>
                <input
                  type="url"
                  value={finalUrl}
                  onChange={(e) => setFinalUrl(e.target.value)}
                  placeholder="https://ejemplo.com/oferta-final"
                  className="w-full px-4 py-3 lg:px-5 lg:py-4 bg-gray-900 border-2 border-gray-700 rounded-xl text-white text-sm lg:text-base transition-all duration-300 focus:border-green-400 focus:ring-4 focus:ring-green-400/20 outline-none placeholder:text-gray-500"
                />
              </div>

              {/* Countdown Input */}
              <div className="mb-6">
                <label className="block mb-3 font-semibold text-sm lg:text-base text-gray-200">
                  Segundos de Espera (1-30)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={countdown}
                    onChange={(e) => setCountdown(parseInt(e.target.value) || 5)}
                    min="1"
                    max="30"
                    className="w-full px-4 py-3 lg:px-5 lg:py-4 pr-12 sm:pr-14 lg:pr-16 bg-gray-900 border-2 border-gray-700 rounded-xl text-white text-sm lg:text-base transition-all duration-300 focus:border-green-400 focus:ring-4 focus:ring-green-400/20 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <div className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 sm:gap-1">
                    <button
                      onClick={() => changeCountdown(1)}
                      className="bg-gray-800 hover:bg-green-500 text-gray-300 hover:text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs transition-all duration-200 min-w-[20px] sm:min-w-[24px] h-5 sm:h-6 flex items-center justify-center"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => changeCountdown(-1)}
                      className="bg-gray-800 hover:bg-green-500 text-gray-300 hover:text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs transition-all duration-200 min-w-[20px] sm:min-w-[24px] h-5 sm:h-6 flex items-center justify-center"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>

              {/* Copy Button */}
              <button
                onClick={copyCode}
                className="w-full py-4 lg:py-5 px-6 rounded-xl text-gray-900 text-base lg:text-lg font-bold transition-all duration-300 bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/25 uppercase tracking-wide relative overflow-hidden group mb-6"
              >
                <span className="relative z-10">
                  {copyStatus || "📋 COPIAR CÓDIGO HTML"}
                </span>
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              </button>

              {/* Code Display */}
              <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700/50 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg text-gray-200">📄 Código HTML Generado</h3>
                </div>
                <textarea
                  value={generatedCode}
                  readOnly
                  placeholder="El código se generará automáticamente..."
                  className="w-full flex-1 min-h-[200px] lg:min-h-[250px] bg-gray-950 border border-gray-700 text-gray-300 font-mono text-xs lg:text-sm rounded-lg p-4 resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="flex-1 min-w-0">
            <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm p-6 lg:p-8 rounded-2xl shadow-2xl border border-gray-700/50 h-full flex flex-col">
              
              {/* Header */}
              <div className="text-center mb-6 lg:mb-8">
                <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-200 mb-3">
                  Vista Previa en Vivo
                </h2>
                <div className="inline-flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full text-sm text-green-400 border border-green-500/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Actualización automática activa</span>
                </div>
              </div>

              {/* Device Switcher */}
              <div className="flex gap-3 lg:gap-4 justify-center mb-6 lg:mb-8">
                <button
                  onClick={() => switchDevice("mobile")}
                  className={`px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg transition-all duration-300 font-semibold flex items-center gap-2 text-sm lg:text-base ${
                    activeDevice === "mobile"
                      ? "border-2 border-green-400 bg-green-400/10 text-green-400"
                      : "bg-gray-800 border-2 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600"
                  }`}
                >
                  📱 <span className="hidden sm:inline">Móvil</span>
                </button>
                <button
                  onClick={() => switchDevice("desktop")}
                  className={`px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg transition-all duration-300 font-semibold flex items-center gap-2 text-sm lg:text-base ${
                    activeDevice === "desktop"
                      ? "border-2 border-green-400 bg-green-400/10 text-green-400"
                      : "bg-gray-800 border-2 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600"
                  }`}
                >
                  💻 <span className="hidden sm:inline">Escritorio</span>
                </button>
              </div>

              {/* Preview Container */}
              <div className="flex justify-center items-start flex-1 w-full overflow-hidden p-2 sm:p-4">
                {activeDevice === "mobile" ? (
                  <div className="w-[180px] sm:w-[220px] md:w-[280px] lg:w-[320px] xl:w-[380px] h-[320px] sm:h-[380px] md:h-[500px] lg:h-[600px] xl:h-[700px] bg-gray-900 rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 md:p-3 shadow-2xl border border-gray-700 relative mx-auto flex-shrink-0">
                    {/* Phone notch */}
                    <div className="absolute top-2 sm:top-3 md:top-4 left-1/2 -translate-x-1/2 w-12 sm:w-16 md:w-20 lg:w-24 xl:w-32 h-2 sm:h-2.5 md:h-3 lg:h-4 xl:h-5 bg-black rounded-full z-10"></div>
                    <iframe
                      ref={previewFrameMobileRef}
                      className="w-full h-full border-none bg-white rounded-xl sm:rounded-2xl"
                      title="Vista Previa Móvil"
                    />
                  </div>
                ) : (
                  <div className="w-full h-[280px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[650px] bg-gray-900 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 lg:p-6 shadow-2xl border border-gray-700 relative overflow-hidden">
                    {/* Browser dots */}
                    <div className="absolute top-1.5 sm:top-2 md:top-3 lg:top-4 left-1.5 sm:left-2 md:left-3 lg:left-4 flex gap-0.5 sm:gap-1 md:gap-2 z-10">
                      <div className="w-1 sm:w-1.5 md:w-2 lg:w-3 h-1 sm:h-1.5 md:h-2 lg:h-3 bg-red-500 rounded-full"></div>
                      <div className="w-1 sm:w-1.5 md:w-2 lg:w-3 h-1 sm:h-1.5 md:h-2 lg:h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-1 sm:w-1.5 md:w-2 lg:w-3 h-1 sm:h-1.5 md:h-2 lg:h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <iframe
                      ref={previewFrameDesktopRef}
                      className="w-full h-full border-none bg-white rounded-sm sm:rounded-md md:rounded-lg mt-3 sm:mt-4 md:mt-6 lg:mt-8"
                      title="Vista Previa Escritorio"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}