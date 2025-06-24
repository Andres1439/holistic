"use client"

import { useState, useEffect } from "react"
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
  DollarSign,
  Users,
  BarChart3,
  Activity,
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

  // Estado para cambio de moneda
  const [isDollarMode, setIsDollarMode] = useState(false)
  const [dollarRate, setDollarRate] = useState("3.75")

  // Función para convertir moneda
  const convertCurrency = (value: number, toDollar: boolean = isDollarMode) => {
    const rate = parseFloat(dollarRate) || 3.75
    return toDollar ? value / rate : value * rate
  }

  // Función para obtener el símbolo de moneda
  const getCurrencySymbol = () => isDollarMode ? "$" : "S/"

  // Efecto para recalcular cuando cambie la moneda
  useEffect(() => {
    if (calcResults.cpaReal !== null) {
      calculateResults();
    }
  }, [isDollarMode, dollarRate]);

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
    // Solo cambiar la pestaña activa, NO limpiar los datos
    setActiveCalcTab(tab);
    console.log("Pestaña cambiada");
  };

  // Función para calcular resultados
  const calculateResults = () => {
    if (!validateInputs()) {
      setCalcResults({
        cpaReal: null,
        roas: null,
        roi: null,
        margenNeto: null,
        error: "Por favor, completa todos los campos requeridos con valores válidos."
      });
      return;
    }

    try {
      let cpaReal = 0;
      let roas = 0;
      let roi = 0;
      let margenNeto = 0;

      // Convertir valores de entrada si están en dólares
      const rate = parseFloat(dollarRate) || 3.75;
      const convertToSoles = (value: number) => isDollarMode ? value * rate : value;

      if (activeCalcTab === "conversiones") {
        // Cálculos para conversiones
        const inversionPublicitaria = convertToSoles(conversionData.inversionPublicitaria);
        const cpa = convertToSoles(conversionData.cpa);
        const precioProducto = convertToSoles(sharedData.precioProducto);
        const costoProducto = convertToSoles(sharedData.costoProducto);
        const gastoOperativo = convertToSoles(sharedData.gastoOperativo);
        const comisionCourier = convertToSoles(sharedData.comisionCourier);

        const conversiones = inversionPublicitaria / cpa;
        const conversionesExitosas = conversiones * (conversionData.tasaCierre / 100);
        const entregasExitosas = conversionesExitosas * (conversionData.tasaEntrega / 100);
        const ingresos = entregasExitosas * precioProducto;
        const costos = inversionPublicitaria + (entregasExitosas * costoProducto);
        const gastosOperativos = entregasExitosas * gastoOperativo;
        const comisiones = entregasExitosas * comisionCourier;
        const costosTotales = costos + gastosOperativos + comisiones;

        cpaReal = costosTotales / entregasExitosas;
        roas = ingresos / inversionPublicitaria;
        roi = ((ingresos - costosTotales) / costosTotales) * 100;
        margenNeto = ((ingresos - costosTotales) / ingresos) * 100;
      } else {
        // Cálculos para WhatsApp
        const inversionPublicitaria = convertToSoles(whatsappData.inversionPublicitaria);
        const costoPorMensaje = convertToSoles(whatsappData.costoPorMensaje);
        const precioProducto = convertToSoles(sharedData.precioProducto);
        const costoProducto = convertToSoles(sharedData.costoProducto);
        const gastoOperativo = convertToSoles(sharedData.gastoOperativo);
        const comisionCourier = convertToSoles(sharedData.comisionCourier);

        const mensajes = inversionPublicitaria / costoPorMensaje;
        const conversiones = mensajes * (whatsappData.tasaConversionWhatsApp / 100);
        const entregasExitosas = conversiones * (whatsappData.tasaEntrega / 100);
        const ingresos = entregasExitosas * precioProducto;
        const costos = inversionPublicitaria + (entregasExitosas * costoProducto);
        const gastosOperativos = entregasExitosas * gastoOperativo;
        const comisiones = entregasExitosas * comisionCourier;
        const costosTotales = costos + gastosOperativos + comisiones;

        cpaReal = costosTotales / entregasExitosas;
        roas = ingresos / inversionPublicitaria;
        roi = ((ingresos - costosTotales) / costosTotales) * 100;
        margenNeto = ((ingresos - costosTotales) / ingresos) * 100;
      }

      // Convertir resultados a la moneda seleccionada si es necesario
      if (isDollarMode) {
        cpaReal = cpaReal / rate;
      }

      setCalcResults({
        cpaReal: cpaReal,
        roas: roas,
        roi: roi,
        margenNeto: margenNeto,
        error: ""
      });
    } catch (error) {
      setCalcResults({
        cpaReal: null,
        roas: null,
        roi: null,
        margenNeto: null,
        error: "Error en el cálculo. Verifica los datos ingresados."
      });
    }
  };

  // Funciones para manejar campañas
  const addCampaign = (campaign: CampaignData) => {
    setCampaigns(prev => [...prev, campaign]);
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
  };

  // Funciones para manejar entregas
  const addDelivery = (delivery: DeliveryData) => {
    setDeliveries(prev => [...prev, delivery]);
  };

  const deleteDelivery = (id: string) => {
    setDeliveries(prev => prev.filter(delivery => delivery.id !== id));
  };

  // Función para limpiar historial
  const clearHistory = () => {
    setCampaigns([]);
    setDeliveries([]);
  };

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

  // Restaurar campañas desde localStorage al cargar
  useEffect(() => {
    const stored = localStorage.getItem("campaigns")
    if (stored) {
      setCampaigns(JSON.parse(stored))
    }
  }, [])

  // Guardar campañas en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem("campaigns", JSON.stringify(campaigns))
  }, [campaigns])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white w-full shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center group">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-blue-700 transition-all duration-300">
                  HOLISTIC
                </span>
              </Link>
              <div className="hidden sm:block">
                <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 font-medium">
                  Herramientas
                </Badge>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-900 hover:border-blue-400 transition-all duration-300 font-medium">
                <Home className="h-4 w-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-6 hidden lg:block shadow-sm">
          <nav className="space-y-3">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg"
                  : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              <Home className={`h-5 w-5 ${activeTab === "dashboard" ? "text-white" : "text-gray-600"}`} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab("campanas")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === "campanas"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-lg"
                  : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
              }`}
            >
              <Target className={`h-5 w-5 ${activeTab === "campanas" ? "text-white" : "text-gray-600"}`} />
              <span>Campañas</span>
            </button>
            <button
              onClick={() => setActiveTab("entregas")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === "entregas"
                  ? "bg-gradient-to-r from-violet-500 to-violet-600 text-white font-semibold shadow-lg"
                  : "text-gray-700 hover:bg-gray-50 hover:text-violet-600"
              }`}
            >
              <Truck className={`h-5 w-5 ${activeTab === "entregas" ? "text-white" : "text-gray-600"}`} />
              <span>Entregas</span>
            </button>
            <button
              onClick={() => setActiveTab("calculadora")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === "calculadora"
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold shadow-lg"
                  : "text-gray-700 hover:bg-gray-50 hover:text-purple-600"
              }`}
            >
              <Calculator className={`h-5 w-5 ${activeTab === "calculadora" ? "text-white" : "text-gray-600"}`} />
              <span>Calculadora</span>
            </button>
            <button
              onClick={() => setActiveTab("historial")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === "historial"
                  ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold shadow-lg"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-600"
              }`}
            >
              <History className={`h-5 w-5 ${activeTab === "historial" ? "text-white" : "text-gray-600"}`} />
              <span>Historial</span>
            </button>
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
          <div className="flex justify-around py-3">
            {[
              { id: "dashboard", icon: Home, label: "Dashboard", color: "blue" },
              { id: "campanas", icon: Target, label: "Campañas", color: "green" },
              { id: "entregas", icon: Truck, label: "Entregas", color: "violet" },
              { id: "calculadora", icon: Calculator, label: "Calc", color: "purple" },
              { id: "historial", icon: History, label: "Historial", color: "gray" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === item.id 
                    ? `text-${item.color}-600 bg-${item.color}-50` 
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-32 lg:pb-8 w-full bg-gray-50">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard General</h1>
                  <p className="text-gray-600">Resumen de métricas actualizadas</p>
                </div>
                <div className="flex space-x-3 mt-2 sm:mt-0">
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 border-none shadow-lg font-medium">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>

              {/* Metrics Cards - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
                  <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-blue-100">
                    <div className="flex items-center justify-between">
                      <CardDescription className="text-blue-700 text-sm font-semibold">INVERSIÓN TOTAL</CardDescription>
                      <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">S/ {totalInversion.toFixed(2)}</div>
                    <div className="flex items-center text-green-600 text-sm font-medium">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      12.5% vs ayer
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
                  <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-green-100">
                    <div className="flex items-center justify-between">
                      <CardDescription className="text-green-700 text-sm font-semibold">CONVERSIONES</CardDescription>
                      <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{totalConversiones}</div>
                    <div className="flex items-center text-green-600 text-sm font-medium">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      8.3% vs ayer
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
                  <CardHeader className="pb-3 bg-gradient-to-r from-violet-50 to-violet-100">
                    <div className="flex items-center justify-between">
                      <CardDescription className="text-violet-700 text-sm font-semibold">CPA PROMEDIO</CardDescription>
                      <div className="h-10 w-10 bg-violet-500 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">S/ {avgCPA.toFixed(2)}</div>
                    <div className="flex items-center text-red-600 text-sm font-medium">
                      <ArrowDown className="h-4 w-4 mr-1" />
                      3.8% vs ayer
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
                  <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-purple-100">
                    <div className="flex items-center justify-between">
                      <CardDescription className="text-purple-700 text-sm font-semibold">ROAS GENERAL</CardDescription>
                      <div className="h-10 w-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Activity className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{avgROAS.toFixed(1)}x</div>
                    <div className="flex items-center text-green-600 text-sm font-medium">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      0.4x vs ayer
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Section - Responsive */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in w-full">
                <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                    <CardTitle className="text-blue-900 font-semibold">Inversión por Plataforma - Últimos 7 días</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-64 flex items-end justify-around gap-4 pb-4 w-full">
                      {/* Gráfico de columnas profesional */}
                      <div className="flex flex-col items-center flex-1">
                        <div className="relative w-full">
                          <div className="w-full h-20 bg-gradient-to-t from-blue-400 to-blue-500 rounded-t-lg mb-3 shadow-md relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-600 to-blue-400 opacity-20"></div>
                          </div>
                          <div className="absolute -top-2 right-2 text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded">
                            S/ 650
                          </div>
                        </div>
                        <span className="text-blue-700 text-sm font-medium">Facebook</span>
                      </div>
                      <div className="flex flex-col items-center flex-1">
                        <div className="relative w-full">
                          <div className="w-full h-32 bg-gradient-to-t from-green-400 to-green-500 rounded-t-lg mb-3 shadow-md relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-green-600 to-green-400 opacity-20"></div>
                          </div>
                          <div className="absolute -top-2 right-2 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">
                            S/ 500
                          </div>
                        </div>
                        <span className="text-green-700 text-sm font-medium">Google</span>
                      </div>
                      <div className="flex flex-col items-center flex-1">
                        <div className="relative w-full">
                          <div className="w-full h-16 bg-gradient-to-t from-violet-400 to-violet-500 rounded-t-lg mb-3 shadow-md relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-violet-600 to-violet-400 opacity-20"></div>
                          </div>
                          <div className="absolute -top-2 right-2 text-xs font-semibold text-violet-700 bg-violet-100 px-2 py-1 rounded">
                            S/ 300
                          </div>
                        </div>
                        <span className="text-violet-700 text-sm font-medium">TikTok</span>
                      </div>
                    </div>
                    {/* Leyenda del gráfico */}
                    <div className="flex justify-center space-x-6 mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-xs text-gray-600">Facebook</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="text-xs text-gray-600">Google</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-violet-500 rounded"></div>
                        <span className="text-xs text-gray-600">TikTok</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                    <CardTitle className="text-green-900 font-semibold">Evolución del CPA - Últimos 7 días</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-64 relative w-full">
                      {/* Gráfico de líneas profesional */}
                      <svg className="w-full h-full" viewBox="0 0 400 200">
                        <defs>
                          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                          </linearGradient>
                          <filter id="glow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                            <feMerge> 
                              <feMergeNode in="coloredBlur"/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                        </defs>
                        
                        {/* Grid lines */}
                        <g stroke="#e5e7eb" strokeWidth="1" opacity="0.5">
                          <line x1="0" y1="40" x2="400" y2="40"/>
                          <line x1="0" y1="80" x2="400" y2="80"/>
                          <line x1="0" y1="120" x2="400" y2="120"/>
                          <line x1="0" y1="160" x2="400" y2="160"/>
                        </g>
                        
                        {/* Data points and line */}
                        <circle cx="20" cy="180" r="3" fill="#10b981" filter="url(#glow)"/>
                        <circle cx="80" cy="155" r="3" fill="#10b981" filter="url(#glow)"/>
                        <circle cx="140" cy="150" r="3" fill="#10b981" filter="url(#glow)"/>
                        <circle cx="200" cy="145" r="3" fill="#10b981" filter="url(#glow)"/>
                        <circle cx="260" cy="140" r="3" fill="#10b981" filter="url(#glow)"/>
                        <circle cx="320" cy="135" r="3" fill="#10b981" filter="url(#glow)"/>
                        <circle cx="380" cy="130" r="3" fill="#10b981" filter="url(#glow)"/>
                        
                        {/* Line path */}
                        <path
                          d="M 20 180 Q 50 167 80 155 T 140 150 T 200 145 T 260 140 T 320 135 T 380 130"
                          stroke="#10b981"
                          strokeWidth="3"
                          fill="none"
                          className="drop-shadow-lg"
                          filter="url(#glow)"
                        />
                        
                        {/* Area under line */}
                        <path 
                          d="M 20 180 Q 50 167 80 155 T 140 150 T 200 145 T 260 140 T 320 135 T 380 130 L 380 200 L 20 200 Z" 
                          fill="url(#lineGradient)" 
                        />
                      </svg>
                      
                      {/* Eje X labels */}
                      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-4">
                        <span>Lun</span>
                        <span>Mar</span>
                        <span>Mié</span>
                        <span>Jue</span>
                        <span>Vie</span>
                        <span>Sáb</span>
                        <span>Dom</span>
                      </div>
                      
                      {/* Eje Y labels */}
                      <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-xs text-gray-500 py-4">
                        <span>S/ 25</span>
                        <span>S/ 20</span>
                        <span>S/ 15</span>
                        <span>S/ 10</span>
                        <span>S/ 5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Entries Table */}
              <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-900 font-semibold">Entradas Recientes</CardTitle>
                    <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors">
                      <Eye className="h-4 w-4 mr-1" /> Ver todo
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">FECHA</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">PLATAFORMA</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">INVERSIÓN</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">CONVERSIONES</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">CPA</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">ROAS</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dashboardData.map((row, index) => {
                          const cpa = row.inversion / row.conversiones
                          const roas = row.ventas / row.inversion
                          return (
                            <tr
                              key={index}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 text-gray-900 font-medium">{row.fecha}</td>
                              <td className="px-6 py-4 text-gray-900">{row.plataforma}</td>
                              <td className="px-6 py-4 text-gray-900 font-semibold">S/ {row.inversion.toFixed(2)}</td>
                              <td className="px-6 py-4 text-gray-900">{row.conversiones}</td>
                              <td className="px-6 py-4 text-gray-900 font-semibold">S/ {cpa.toFixed(2)}</td>
                              <td className="px-6 py-4 text-gray-900 font-semibold">{roas.toFixed(2)}x</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
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
              isDollarMode={isDollarMode}
              setIsDollarMode={setIsDollarMode}
              dollarRate={dollarRate}
              setDollarRate={setDollarRate}
              convertCurrency={convertCurrency}
              getCurrencySymbol={getCurrencySymbol}
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
