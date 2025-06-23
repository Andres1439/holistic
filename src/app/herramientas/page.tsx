"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Home,
  Target,
  Truck,
  Calculator,
  History,
  ShoppingCart,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Download,
  Trash2,
  Eye,
} from "lucide-react"
import { CampaignForm, DeliveryForm, CampaignTable, DeliveryTable } from "./components/functional-forms"
import CampaignsSection from "./components/CampaignsSection"
import DeliveriesSection from "./components/DeliveriesSection"
import CalculatorSection from "./components/CalculatorSection"
import HistorySection from "./components/HistorySection"

interface CampaignData {
  id: string
  fecha: string
  plataforma: string
  tipo: string
  inversion: number
  conversiones: number
  ventas: number
}

interface DeliveryData {
  id: string
  fecha: string
  totalPedidos: number
  entregados: number
  rechazados: number
  noUbicados: number
  costoEnvio: number
}

export default function HerramientasPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [campaigns, setCampaigns] = useState<CampaignData[]>([])
  const [deliveries, setDeliveries] = useState<DeliveryData[]>([])

  // Calculator state
  const [activeCalcTab, setActiveCalcTab] = useState("conversiones")
  const [conversionData, setConversionData] = useState({
    inversionPublicitaria: 1000,
    cpa: 20,
    tasaCierre: 100,
    tasaEntrega: 87.5,
  })
  const [whatsappData, setWhatsappData] = useState({
    inversionPublicitaria: 1000,
    costoPorMensaje: 20,
    tasaConversionWhatsApp: 5,
    tasaEntrega: 87.5,
  })
  const [sharedData, setSharedData] = useState({
    precioProducto: 120,
    costoProducto: 40,
    gastoOperativo: 15,
    comisionCourier: 8,
  })
  const [calcResults, setCalcResults] = useState({
    cpaReal: null as number | null,
    roas: null as number | null,
    roi: null as number | null,
    margenNeto: null as number | null,
    error: ""
  })

  // Estado para los valores de los inputs como string
  const [inputValues, setInputValues] = useState({
    inversionPublicitaria: "0",
    cpa: "0",
    tasaCierre: "0",
    precioProducto: "0",
    costoProducto: "0",
    gastoOperativo: "0",
    tasaEntrega: "0",
    comisionCourier: "0",
    costoPorMensaje: "0",
    tasaConversionWhatsApp: "0"
  });

  // Función para manejar cambios en los inputs - CORREGIDA
  const handleInputChange = (field: string, value: string, tab: string = "") => {
    console.log(`Cambiando ${field} a ${value} en tab ${tab}`);
    // Limpiar el valor: solo números y punto decimal
    const cleanedValue = value.replace(/[^0-9.]/g, '');
    // Evitar múltiples puntos decimales
    const parts = cleanedValue.split('.');
    const finalValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleanedValue;
    // Remover ceros iniciales innecesarios pero mantener "0" si es el único dígito
    const parsedValue = finalValue.replace(/^0+(?=\d)/, '') || (finalValue === '' ? '' : finalValue);
    setInputValues(prev => ({ ...prev, [field]: parsedValue }));
    const numericValue = parsedValue === '' ? 0 : Number.parseFloat(parsedValue);
    if (isNaN(numericValue)) {
      console.warn(`Valor no válido para ${field}:`, parsedValue);
      return;
    }
    // LÓGICA CORREGIDA: Manejar explícitamente el caso 'shared'
    if (tab === "conversiones") {
      setConversionData(prev => ({ ...prev, [field]: numericValue }));
    } else if (tab === "whatsapp") {
      setWhatsappData(prev => ({ ...prev, [field]: numericValue }));
    } else if (tab === "shared" || tab === "") {
      // IMPORTANTE: Los campos compartidos van a sharedData
      setSharedData(prev => ({ ...prev, [field]: numericValue }));
    }
    console.log(`${field} actualizado a ${numericValue} en ${tab || 'shared'}`);
  };

  // Función para limpiar todos los datos
  const clearAllData = () => {
    setInputValues({
      inversionPublicitaria: "0",
      cpa: "0",
      tasaCierre: "0",
      precioProducto: "0",
      costoProducto: "0",
      gastoOperativo: "0",
      tasaEntrega: "0",
      comisionCourier: "0",
      costoPorMensaje: "0",
      tasaConversionWhatsApp: "0"
    });
    setConversionData({
      inversionPublicitaria: 0,
      cpa: 0,
      tasaCierre: 0,
      tasaEntrega: 0,
    });
    setWhatsappData({
      inversionPublicitaria: 0,
      costoPorMensaje: 0,
      tasaConversionWhatsApp: 0,
      tasaEntrega: 0,
    });
    setSharedData({
      precioProducto: 0,
      costoProducto: 0,
      gastoOperativo: 0,
      comisionCourier: 0,
    });
    setCalcResults({
      cpaReal: null,
      roas: null,
      roi: null,
      margenNeto: null,
      error: ""
    });
  };

  // Función de validación mejorada
  const validateInputs = () => {
    if (activeCalcTab === "conversiones") {
      return (
        conversionData.inversionPublicitaria > 0 &&
        conversionData.cpa > 0 &&
        conversionData.tasaCierre > 0 &&
        conversionData.tasaEntrega > 0 &&
        conversionData.tasaEntrega <= 100 &&
        sharedData.precioProducto > 0 &&
        sharedData.costoProducto > 0
      );
    } else {
      return (
        whatsappData.inversionPublicitaria > 0 &&
        whatsappData.costoPorMensaje > 0 &&
        whatsappData.tasaConversionWhatsApp > 0 &&
        whatsappData.tasaConversionWhatsApp <= 100 &&
        whatsappData.tasaEntrega > 0 &&
        whatsappData.tasaEntrega <= 100 &&
        sharedData.precioProducto > 0 &&
        sharedData.costoProducto > 0
      );
    }
  };

  // Función mejorada para cambio de pestañas
  const handleTabChange = (tab: string) => {
    console.log(`Cambiando a pestaña: ${tab}`);
    // Limpiar todos los datos al cambiar de pestaña
    clearAllData();
    // Cambiar la pestaña activa
    setActiveCalcTab(tab);
    console.log("Datos limpiados y pestaña cambiada");
  };

  // Función de cálculo mejorada
  const calculateResults = () => {
    console.log("Iniciando cálculo...");
    console.log("Tab activo:", activeCalcTab);
    console.log("Datos de conversión:", conversionData);
    console.log("Datos compartidos:", sharedData);

    if (!validateInputs()) {
      setCalcResults({ 
        cpaReal: null, 
        roas: null, 
        roi: null, 
        margenNeto: null, 
        error: "Por favor completa todos los campos requeridos con valores válidos." 
      });
      return;
    }

    let conversiones = 0;
    let ventasReales = 0;
    let ingresosBrutos = 0;
    let costosTotales = 0;
    let inversionTotal = 0;

    try {
      if (activeCalcTab === "conversiones") {
        // Calcular número de conversiones (leads/clics)
        conversiones = conversionData.inversionPublicitaria / conversionData.cpa;
        console.log("Conversiones calculadas:", conversiones);
        // Aplicar tasa de cierre para obtener ventas
        const ventas = conversiones * (conversionData.tasaCierre / 100);
        console.log("Ventas después de tasa de cierre:", ventas);
        // Aplicar tasa de entrega para obtener ventas entregadas
        ventasReales = ventas * (conversionData.tasaEntrega / 100);
        console.log("Ventas reales (entregadas):", ventasReales);
        // Calcular ingresos brutos solo de las ventas entregadas
        ingresosBrutos = ventasReales * sharedData.precioProducto;
        console.log("Ingresos brutos:", ingresosBrutos);
        // Calcular costos totales
        const costoProductos = ventasReales * sharedData.costoProducto;
        const gastoOperativoTotal = ventasReales * sharedData.gastoOperativo;
        const comisionTotal = ventasReales * sharedData.comisionCourier;
        inversionTotal = conversionData.inversionPublicitaria;
        costosTotales = inversionTotal + costoProductos + gastoOperativoTotal + comisionTotal;
        console.log("Desglose de costos:");
        console.log("- Inversión publicitaria:", inversionTotal);
        console.log("- Costo productos:", costoProductos);
        console.log("- Gasto operativo:", gastoOperativoTotal);
        console.log("- Comisión courier:", comisionTotal);
        console.log("- Costos totales:", costosTotales);
      } else {
        // Para WhatsApp
        const mensajesEnviados = whatsappData.inversionPublicitaria / whatsappData.costoPorMensaje;
        console.log("Mensajes enviados:", mensajesEnviados);
        // Aplicar tasa de conversión de WhatsApp para obtener ventas
        const ventas = mensajesEnviados * (whatsappData.tasaConversionWhatsApp / 100);
        console.log("Ventas de WhatsApp:", ventas);
        // Aplicar tasa de entrega para obtener ventas entregadas
        ventasReales = ventas * (whatsappData.tasaEntrega / 100);
        console.log("Ventas reales WhatsApp:", ventasReales);
        // Calcular ingresos brutos solo de las ventas entregadas
        ingresosBrutos = ventasReales * sharedData.precioProducto;
        // Calcular costos totales
        const costoProductos = ventasReales * sharedData.costoProducto;
        const gastoOperativoTotal = ventasReales * sharedData.gastoOperativo;
        const comisionTotal = ventasReales * sharedData.comisionCourier;
        inversionTotal = whatsappData.inversionPublicitaria;
        costosTotales = inversionTotal + costoProductos + gastoOperativoTotal + comisionTotal;
      }

      // Validar que hay ventas entregadas
      if (ventasReales <= 0) {
        setCalcResults({ 
          cpaReal: null, 
          roas: null, 
          roi: null, 
          margenNeto: null, 
          error: "No hay ventas entregadas. Revisa los datos de tasas de cierre y entrega." 
        });
        return;
      }

      // Calcular métricas finales
      const cpaReal = inversionTotal / ventasReales;
      const roas = ingresosBrutos / inversionTotal;
      const margenNeto = ingresosBrutos - costosTotales;
      const roi = (margenNeto / inversionTotal) * 100;

      console.log("Resultados finales:");
      console.log("- CPA Real:", cpaReal);
      console.log("- ROAS:", roas);
      console.log("- Margen Neto:", margenNeto);
      console.log("- ROI:", roi);

      // Verificar que los resultados no sean NaN o Infinity
      if (isNaN(cpaReal) || isNaN(roas) || isNaN(roi) || isNaN(margenNeto) || 
          !isFinite(cpaReal) || !isFinite(roas) || !isFinite(roi) || !isFinite(margenNeto)) {
        setCalcResults({
          cpaReal: null,
          roas: null,
          roi: null,
          margenNeto: null,
          error: "Error en el cálculo. Verifica que todos los valores sean números válidos."
        });
        return;
      }

      setCalcResults({
        cpaReal: Number(cpaReal.toFixed(2)),
        roas: Number(roas.toFixed(2)),
        roi: Number(roi.toFixed(1)),
        margenNeto: Number(margenNeto.toFixed(2)),
        error: ""
      });

    } catch (error) {
      console.error("Error en calculateResults:", error);
      setCalcResults({
        cpaReal: null,
        roas: null,
        roi: null,
        margenNeto: null,
        error: "Error inesperado en el cálculo. Por favor, verifica los datos ingresados."
      });
    }
  };

  const addCampaign = (campaign: CampaignData) => {
    setCampaigns([campaign, ...campaigns])
  }

  const deleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter((c) => c.id !== id))
  }

  const addDelivery = (delivery: DeliveryData) => {
    setDeliveries([delivery, ...deliveries])
  }

  const deleteDelivery = (id: string) => {
    setDeliveries(deliveries.filter((d) => d.id !== id))
  }

  const clearHistory = () => {
    setCampaigns([])
    setDeliveries([])
  }

  // Sample data for dashboard
  const dashboardData =
    campaigns.length > 0
      ? campaigns.slice(0, 4)
      : [
          {
            id: "1",
            fecha: "19 nov",
            plataforma: "Facebook",
            inversion: 650.0,
            conversiones: 37,
            ventas: 2275.0,
          },
          {
            id: "2",
            fecha: "19 nov",
            plataforma: "Google",
            inversion: 500.0,
            conversiones: 23,
            ventas: 1400.0,
          },
          {
            id: "3",
            fecha: "19 nov",
            plataforma: "TikTok",
            inversion: 300.0,
            conversiones: 20,
            ventas: 1260.0,
          },
          {
            id: "4",
            fecha: "18 nov",
            plataforma: "Facebook",
            inversion: 580.0,
            conversiones: 32,
            ventas: 1856.0,
          },
        ]

  // Calculate totals for dashboard
  const totalInversion = dashboardData.reduce((sum, item) => sum + item.inversion, 0)
  const totalConversiones = dashboardData.reduce((sum, item) => sum + item.conversiones, 0)
  const totalVentas = dashboardData.reduce((sum, item) => sum + item.ventas, 0)
  const avgCPA = totalConversiones > 0 ? totalInversion / totalConversiones : 0
  const avgROAS = totalInversion > 0 ? totalVentas / totalInversion : 0

  // Calculate delivery metrics
  const totalDeliveries = deliveries.reduce((sum, d) => sum + d.totalPedidos, 0)
  const totalEntregados = deliveries.reduce((sum, d) => sum + d.entregados, 0)
  const totalRechazados = deliveries.reduce((sum, d) => sum + d.rechazados, 0)
  const totalNoUbicados = deliveries.reduce((sum, d) => sum + d.noUbicados, 0)
  const avgTasaEntrega = totalDeliveries > 0 ? (totalEntregados / totalDeliveries) * 100 : 87.0
  const avgRechazos = totalDeliveries > 0 ? (totalRechazados / totalDeliveries) * 100 : 8.4
  const avgNoUbicados = totalDeliveries > 0 ? (totalNoUbicados / totalDeliveries) * 100 : 4.7

  return (
    <div className="min-h-screen bg-f2 pb-14 w-full overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-primary-medium/20 bg-primary-dark/80 backdrop-blur-sm w-full">
        <div className="px-2 sm:px-6 lg:px-8 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center group">
                <div className="h-8 w-8 bg-gradient-to-r from-accent to-primary-medium rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <ShoppingCart className="h-5 w-5 text-primary-light" />
                </div>
                <span className="ml-3 text-xl font-bold text-primary-light group-hover:text-accent transition-colors duration-300">
                  HOLISTIC
                </span>
              </Link>
              <div className="hidden sm:block">
                <Badge variant="outline" className="border-accent/30 text-primary-dark bg-primary-light/60">
                  Herramientas
                </Badge>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" className="border-accent/30 text-accent hover:bg-accent hover:text-white">
                <Home className="h-4 w-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-primary-dark/90 border-r border-primary-medium/20 p-4 hidden lg:block">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                activeTab === "dashboard"
                  ? "bg-accent text-e9 font-semibold border border-e9"
                  : "text-e9/70 hover:bg-primary-medium/30 hover:text-e9"
              }`}
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab("campanas")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                activeTab === "campanas"
                  ? "bg-accent text-e9 font-semibold border border-e9"
                  : "text-e9/70 hover:bg-primary-medium/30 hover:text-e9"
              }`}
            >
              <Target className="h-5 w-5" />
              <span>Campañas</span>
            </button>
            <button
              onClick={() => setActiveTab("entregas")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                activeTab === "entregas"
                  ? "bg-accent text-e9 font-semibold border border-e9"
                  : "text-e9/70 hover:bg-primary-medium/30 hover:text-e9"
              }`}
            >
              <Truck className="h-5 w-5" />
              <span>Entregas</span>
            </button>
            <button
              onClick={() => setActiveTab("calculadora")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                activeTab === "calculadora"
                  ? "bg-accent text-e9 font-semibold border border-e9"
                  : "text-e9/70 hover:bg-primary-medium/30 hover:text-e9"
              }`}
            >
              <Calculator className="h-5 w-5" />
              <span>Calculadora</span>
            </button>
            <button
              onClick={() => setActiveTab("historial")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                activeTab === "historial"
                  ? "bg-accent text-e9 font-semibold border border-e9"
                  : "text-e9/70 hover:bg-primary-medium/30 hover:text-e9"
              }`}
            >
              <History className="h-5 w-5" />
              <span>Historial</span>
            </button>
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-primary-dark/90 backdrop-blur-sm border-t border-primary-medium/20 z-50">
          <div className="flex justify-around py-2">
            {[
              { id: "dashboard", icon: Home, label: "Dashboard" },
              { id: "campanas", icon: Target, label: "Campañas" },
              { id: "entregas", icon: Truck, label: "Entregas" },
              { id: "calculadora", icon: Calculator, label: "Calc" },
              { id: "historial", icon: History, label: "Historial" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === item.id ? "text-accent" : "text-white/70 hover:text-accent"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-2 sm:p-6 lg:p-8 pb-32 lg:pb-8 w-full">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-2">Dashboard General</h1>
                  <p className="text-primary-medium">Resumen de métricas actualizadas</p>
                </div>
                <div className="flex space-x-2 mt-2 sm:mt-0">
                  <Button variant="outline" className="border-accent/30 text-accent hover:bg-accent hover:text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>

              {/* Metrics Cards - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                <Card className="bg-secondary/40 border-primary-medium/20 hover:bg-secondary/60 transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-primary-medium text-sm">INVERSIÓN TOTAL</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold text-primary-dark mb-1">S/ {totalInversion.toFixed(2)}</div>
                    <div className="flex items-center text-green-700 text-sm">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      12.5% vs ayer
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/40 border-primary-medium/20 hover:bg-secondary/60 transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-primary-medium text-sm">CONVERSIONES</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold text-primary-dark mb-1">{totalConversiones}</div>
                    <div className="flex items-center text-green-700 text-sm">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      8.3% vs ayer
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/40 border-primary-medium/20 hover:bg-secondary/60 transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-primary-medium text-sm">CPA PROMEDIO</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold text-primary-dark mb-1">S/ {avgCPA.toFixed(2)}</div>
                    <div className="flex items-center text-red-700 text-sm">
                      <ArrowDown className="h-4 w-4 mr-1" />
                      3.8% vs ayer
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/40 border-primary-medium/20 hover:bg-secondary/60 transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-primary-medium text-sm">ROAS GENERAL</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold text-primary-dark mb-1">{avgROAS.toFixed(1)}x</div>
                    <div className="flex items-center text-green-700 text-sm">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      0.4x vs ayer
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Section - Responsive */}
              <div className="flex flex-col gap-6 animate-fade-in w-full">
                <Card className="bg-primary-light/20 border-primary-medium/20 w-full">
                  <CardHeader>
                    <CardTitle className="text-black">Inversión por Plataforma - Últimos 7 días</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end justify-around gap-2 pb-4 w-full">
                      <div className="flex flex-col items-center w-1/3">
                        <div className="w-full h-20 bg-accent/30 rounded-t mb-2"></div>
                        <span className="text-black/60 text-sm">Facebook</span>
                      </div>
                      <div className="flex flex-col items-center w-1/3">
                        <div className="w-full h-32 bg-accent/50 rounded-t mb-2"></div>
                        <span className="text-black/60 text-sm">Google</span>
                      </div>
                      <div className="flex flex-col items-center w-1/3">
                        <div className="w-full h-16 bg-accent/40 rounded-t mb-2"></div>
                        <span className="text-black/60 text-sm">TikTok</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-primary-light/20 border-primary-medium/20 w-full">
                  <CardHeader>
                    <CardTitle className="text-black">Evolución del CPA - Últimos 7 días</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 relative w-full">
                      <svg className="w-full h-full" viewBox="0 0 400 200">
                        <path
                          d="M 20 180 Q 100 120 200 100 T 380 80"
                          stroke="#9290C3"
                          strokeWidth="3"
                          fill="none"
                          className="drop-shadow-lg"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#9290C3" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#9290C3" stopOpacity="0.1" />
                          </linearGradient>
                        </defs>
                        <path d="M 20 180 Q 100 120 200 100 T 380 80 L 380 200 L 20 200 Z" fill="url(#gradient)" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Entries Table */}
              <div className="bg-primary-light/20 border-primary-medium/20 rounded-xl p-6 mt-8 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-black">Entradas Recientes</h2>
                  <button className="flex items-center text-accent hover:underline text-sm font-semibold">
                    <Eye className="h-4 w-4 mr-1" /> Ver todo
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-primary-medium/20">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-bold text-black/60 uppercase tracking-wider">FECHA</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-black/60 uppercase tracking-wider">PLATAFORMA</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-black/60 uppercase tracking-wider">INVERSIÓN</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-black/60 uppercase tracking-wider">CONVERSIONES</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-black/60 uppercase tracking-wider">CPA</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-black/60 uppercase tracking-wider">ROAS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.map((row, index) => {
                        const cpa = row.inversion / row.conversiones
                        const roas = row.ventas / row.inversion
                        return (
                          <tr
                            key={index}
                            className="border-b border-primary-light/10 hover:bg-primary-medium/10 transition-colors"
                          >
                            <td className="text-black py-3">{row.fecha}</td>
                            <td className="text-black py-3">{row.plataforma}</td>
                            <td className="text-black py-3">S/ {row.inversion.toFixed(2)}</td>
                            <td className="text-black py-3">{row.conversiones}</td>
                            <td className="text-black py-3">S/ {cpa.toFixed(2)}</td>
                            <td className="text-black py-3">{roas.toFixed(2)}x</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Campañas */}
          {activeTab === "campanas" && (
            <CampaignsSection campaigns={campaigns} setCampaigns={setCampaigns} deleteCampaign={deleteCampaign} />
          )}

          {/* Entregas */}
          {activeTab === "entregas" && (
            <DeliveriesSection deliveries={deliveries} setDeliveries={setDeliveries} deleteDelivery={deleteDelivery} />
          )}

          {/* Calculadora */}
          {activeTab === "calculadora" && (
            <CalculatorSection
              activeCalcTab={activeCalcTab}
              setActiveCalcTab={setActiveCalcTab}
              conversionData={conversionData}
              setConversionData={setConversionData}
              whatsappData={whatsappData}
              setWhatsappData={setWhatsappData}
              sharedData={sharedData}
              setSharedData={setSharedData}
              calcResults={calcResults}
              setCalcResults={setCalcResults}
              inputValues={inputValues}
              setInputValues={setInputValues}
              handleInputChange={handleInputChange}
              clearAllData={clearAllData}
              calculateResults={calculateResults}
              handleTabChange={handleTabChange}
            />
          )}

          {/* Historial */}
          {activeTab === "historial" && (
            <HistorySection
              campaigns={campaigns}
              deliveries={deliveries}
              deleteCampaign={deleteCampaign}
              deleteDelivery={deleteDelivery}
              clearHistory={clearHistory}
            />
          )}
        </div>
      </div>
    </div>
  )
}
