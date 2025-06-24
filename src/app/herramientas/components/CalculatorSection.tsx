import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, TrendingUp, Calculator, DollarSign, Target, Percent, AlertTriangle } from "lucide-react";
import dynamic from 'next/dynamic';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from 'react';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function CalculatorSection({
  activeCalcTab,
  setActiveCalcTab,
  conversionData,
  setConversionData,
  whatsappData,
  setWhatsappData,
  sharedData,
  setSharedData,
  calcResults,
  setCalcResults,
  inputValues,
  setInputValues,
  handleInputChange,
  clearAllData,
  calculateResults,
  handleTabChange,
  currency,
  setCurrency,
  getCurrencySymbol
}: any) {
  const derived = calculateDerivedMetrics(calcResults, inputValues);
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Optimización de performance para el heatmap
  const heatmapData = useMemo(() => {
    const cpaValues = [20, 30, 40, 50, 60, 70, 80, 90, 100];
    const conversionRates = [10, 15, 20, 25, 30, 35, 40, 45, 50];
    const investment = Number(inputValues.inversionPublicitaria) || 2000;
    const productPrice = Number(inputValues.precioProducto) || 200;
    const productCost = Number(inputValues.costoProducto) || 80;
    const operativeCost = Number(inputValues.gastoOperativo) || 20;
    const courierCost = Number(inputValues.comisionCourier) || 15;
    const deliveryRate = (Number(inputValues.tasaEntrega) || 85) / 100;
    const costPerOrder = productCost + operativeCost + courierCost;
    return conversionRates.map(convRate => ({
      name: convRate + '%',
      data: cpaValues.map(cpa => {
        const leads = investment / cpa;
        const conversions = leads * (convRate / 100);
        const deliveries = conversions * deliveryRate;
        const revenue = deliveries * productPrice;
        const variableCosts = deliveries * costPerOrder;
        const totalCosts = variableCosts + investment;
        const profit = revenue - totalCosts;
        const roi = (profit / investment) * 100;
        return {
          x: cpa.toString(),
          y: Math.round(roi * 10) / 10
        };
      })
    }));
  }, [
    inputValues.inversionPublicitaria,
    inputValues.precioProducto,
    inputValues.costoProducto,
    inputValues.gastoOperativo,
    inputValues.comisionCourier,
    inputValues.tasaEntrega
  ]);

  // Handler para Enter en cualquier input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      calculateResults();
    }
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Calculadora de Rentabilidad</h1>
        <p className="text-gray-600">Analiza la rentabilidad de tus campañas COD</p>
      </div>

      {/* Formulario principal */}
      <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-blue-900 font-semibold">Parámetros de Cálculo</CardTitle>
                <CardDescription className="text-blue-700">Configura los valores para tu análisis</CardDescription>
              </div>
            </div>
            {/* Selector de moneda */}
            <div className="flex items-center space-x-3">
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Moneda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - Dólar</SelectItem>
                  <SelectItem value="PEN">PEN - Sol</SelectItem>
                  <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                  <SelectItem value="COL">COL - Peso Colombiano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeCalcTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="conversiones" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 rounded-md transition-all duration-300 font-medium"
              >
                Conversiones
              </TabsTrigger>
              <TabsTrigger 
                value="whatsapp" 
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 rounded-md transition-all duration-300 font-medium"
              >
                WhatsApp
              </TabsTrigger>
            </TabsList>

            {/* Conversiones */}
            <TabsContent value="conversiones" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="inversion-pub" className="text-gray-700 font-medium">
                    Inversión Publicitaria ({getCurrencySymbol()})
                  </Label>
                  <Input
                    id="inversion-pub"
                    type="number"
                    value={inputValues.inversionPublicitaria}
                    onChange={(e) => handleInputChange('inversionPublicitaria', e.target.value, 'conversiones')}
                    onKeyDown={handleKeyDown}
                    className="bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpa-calc" className="text-gray-700 font-medium">
                    CPA ({getCurrencySymbol()})
                  </Label>
                  <Input
                    id="cpa-calc"
                    type="number"
                    value={inputValues.cpa}
                    onChange={(e) => handleInputChange('cpa', e.target.value, 'conversiones')}
                    onKeyDown={handleKeyDown}
                    className="bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tasa-cierre" className="text-gray-700 font-medium">
                    Tasa de Cierre (%)
                  </Label>
                  <Input
                    id="tasa-cierre"
                    type="number"
                    value={inputValues.tasaCierre}
                    onChange={(e) => handleInputChange('tasaCierre', e.target.value, 'conversiones')}
                    onKeyDown={handleKeyDown}
                    className="bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="precio-producto" className="text-gray-700 font-medium">
                    Precio del Producto ({getCurrencySymbol()})
                  </Label>
                  <Input
                    id="precio-producto"
                    type="number"
                    value={inputValues.precioProducto}
                    onChange={(e) => handleInputChange('precioProducto', e.target.value, 'shared')}
                    onKeyDown={handleKeyDown}
                    className="bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costo-producto" className="text-gray-700 font-medium">
                    Costo del Producto ({getCurrencySymbol()})
                  </Label>
                  <Input
                    id="costo-producto"
                    type="number"
                    value={inputValues.costoProducto}
                    onChange={(e) => handleInputChange('costoProducto', e.target.value, 'shared')}
                    onKeyDown={handleKeyDown}
                    className="bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gasto-operativo" className="text-gray-700 font-medium">
                    Gasto Operativo/Pedido ({getCurrencySymbol()})
                  </Label>
                  <Input
                    id="gasto-operativo"
                    type="number"
                    value={inputValues.gastoOperativo}
                    onChange={(e) => handleInputChange('gastoOperativo', e.target.value, 'shared')}
                    onKeyDown={handleKeyDown}
                    className="bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tasa-entrega-calc" className="text-gray-700 font-medium">
                    Tasa de Entrega (%)
                  </Label>
                  <Input
                    id="tasa-entrega-calc"
                    type="number"
                    value={inputValues.tasaEntrega}
                    onChange={(e) => handleInputChange('tasaEntrega', e.target.value, 'conversiones')}
                    onKeyDown={handleKeyDown}
                    min="0"
                    max="100"
                    className="bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                    placeholder="0"
                  />
                  {conversionData.tasaEntrega > 100 && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      La tasa de entrega debe ser menor o igual a 100%
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comision-courier" className="text-gray-700 font-medium">
                    Comisión Courier ({getCurrencySymbol()})
                  </Label>
                  <Input
                    id="comision-courier"
                    type="number"
                    value={inputValues.comisionCourier}
                    onChange={(e) => handleInputChange('comisionCourier', e.target.value, 'shared')}
                    onKeyDown={handleKeyDown}
                    className="bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={calculateResults}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Calcular Rentabilidad
                </Button>
                <Button
                  onClick={clearAllData}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpiar Datos
                </Button>
              </div>
            </TabsContent>

            {/* WhatsApp */}
            <TabsContent value="whatsapp" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="inversion-pub-wa" className="text-gray-700 font-medium">
                    Inversión Publicitaria ({getCurrencySymbol()})
                  </Label>
                  <Input
                    id="inversion-pub-wa"
                    type="number"
                    value={inputValues.inversionPublicitaria}
                    onChange={(e) => handleInputChange('inversionPublicitaria', e.target.value, 'whatsapp')}
                    onKeyDown={handleKeyDown}
                    className="bg-white border-gray-200 text-gray-900 focus:border-green-500 focus:ring-green-500 transition-all duration-300"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costo-mensaje" className="text-gray-700 font-medium">
                    Costo por Mensaje (CPM) ({getCurrencySymbol()})
                  </Label>
                  <Input
                    id="costo-mensaje"
                    type="number"
                    value={inputValues.costoPorMensaje}
                    onChange={(e) => handleInputChange('costoPorMensaje', e.target.value, 'whatsapp')}
                    onKeyDown={handleKeyDown}
                    className="bg-white border-gray-200 text-gray-900 focus:border-green-500 focus:ring-green-500 transition-all duration-300"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tasa-conversion-wa" className="text-gray-700 font-medium">
                    Tasa de Conversión WhatsApp (%)
                  </Label>
                  <Input
                    id="tasa-conversion-wa"
                    type="number"
                    value={inputValues.tasaConversionWhatsApp}
                    onChange={(e) => handleInputChange('tasaConversionWhatsApp', e.target.value, 'whatsapp')}
                    onKeyDown={handleKeyDown}
                    min="0"
                    max="100"
                    className="bg-white border-gray-200 text-gray-900 focus:border-green-500 focus:ring-green-500 transition-all duration-300"
                    placeholder="0"
                  />
                  {whatsappData.tasaConversionWhatsApp > 100 && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      La tasa de conversión debe ser menor o igual a 100%
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="precio-producto-wa" className="text-gray-700 font-medium">
                    Precio del Producto ({getCurrencySymbol()})
                  </Label>
                  <Input
                    id="precio-producto-wa"
                    type="number"
                    value={inputValues.precioProducto}
                    onChange={(e) => handleInputChange('precioProducto', e.target.value, 'shared')}
                    onKeyDown={handleKeyDown}
                    className="bg-white border-gray-200 text-gray-900 focus:border-green-500 focus:ring-green-500 transition-all duration-300"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costo-producto-wa" className="text-gray-700 font-medium">
                    Costo del Producto ({getCurrencySymbol()})
                  </Label>
                  <Input
                    id="costo-producto-wa"
                    type="number"
                    value={inputValues.costoProducto}
                    onChange={(e) => handleInputChange('costoProducto', e.target.value, 'shared')}
                    onKeyDown={handleKeyDown}
                    className="bg-white border-gray-200 text-gray-900 focus:border-green-500 focus:ring-green-500 transition-all duration-300"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gasto-operativo-wa" className="text-gray-700 font-medium">
                    Gasto Operativo/Pedido ({getCurrencySymbol()})
                  </Label>
                  <Input
                    id="gasto-operativo-wa"
                    type="number"
                    value={inputValues.gastoOperativo}
                    onChange={(e) => handleInputChange('gastoOperativo', e.target.value, 'shared')}
                    onKeyDown={handleKeyDown}
                    className="bg-white border-gray-200 text-gray-900 focus:border-green-500 focus:ring-green-500 transition-all duration-300"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tasa-entrega-wa" className="text-gray-700 font-medium">
                    Tasa de Entrega (%)
                  </Label>
                  <Input
                    id="tasa-entrega-wa"
                    type="number"
                    value={inputValues.tasaEntrega}
                    onChange={(e) => handleInputChange('tasaEntrega', e.target.value, 'whatsapp')}
                    onKeyDown={handleKeyDown}
                    min="0"
                    max="100"
                    className="bg-white border-gray-200 text-gray-900 focus:border-green-500 focus:ring-green-500 transition-all duration-300"
                    placeholder="0"
                  />
                  {whatsappData.tasaEntrega > 100 && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      La tasa de entrega debe ser menor o igual a 100%
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comision-courier-wa" className="text-gray-700 font-medium">
                    Comisión Courier ({getCurrencySymbol()})
                  </Label>
                  <Input
                    id="comision-courier-wa"
                    type="number"
                    value={inputValues.comisionCourier}
                    onChange={(e) => handleInputChange('comisionCourier', e.target.value, 'shared')}
                    onKeyDown={handleKeyDown}
                    className="bg-white border-gray-200 text-gray-900 focus:border-green-500 focus:ring-green-500 transition-all duration-300"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={calculateResults}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium shadow-lg"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Calcular Rentabilidad
                </Button>
                <Button
                  onClick={clearAllData}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpiar Datos
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Indicadores de KPIs (scorecards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in mt-6">
        <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 max-w-xs w-56 mx-auto border-t-4 border-blue-500">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <span className="text-blue-900 font-semibold text-lg">CPA</span>
          </div>
          <div className="text-3xl font-bold text-blue-700">{Number((calcResults.cpaReal ?? 0).toFixed(2))}</div>
        </Card>
        <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 max-w-xs w-56 mx-auto border-t-4 border-green-500">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <span className="text-green-900 font-semibold text-lg">ROAS</span>
          </div>
          <div className="text-3xl font-bold text-green-700">{Number((calcResults.roas ?? 0).toFixed(2))}</div>
        </Card>
        <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 max-w-xs w-56 mx-auto border-t-4 border-violet-500">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-10 w-10 bg-violet-500 rounded-lg flex items-center justify-center">
              <Percent className="h-5 w-5 text-white" />
            </div>
            <span className="text-violet-900 font-semibold text-lg">ROI</span>
          </div>
          <div className="text-3xl font-bold text-violet-700">{Number((calcResults.roi ?? 0).toFixed(2))}%</div>
        </Card>
        <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 max-w-xs w-56 mx-auto border-t-4 border-purple-500">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-10 w-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-purple-900 font-semibold text-lg">Margen Neto</span>
          </div>
          <div className="text-3xl font-bold text-purple-700">{Number((calcResults.margenNeto ?? 0).toFixed(2))}%</div>
        </Card>
      </div>

      {/* Análisis */}
      {calcResults.roi !== null && calcResults.roi > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 animate-fade-in rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-green-900 font-semibold text-lg">Análisis de Rentabilidad</h3>
                <p className="text-green-700">
                  {calcResults.roi > 100 ? "Rentabilidad excelente" :
                    calcResults.roi > 50 ? "Rentabilidad buena" :
                      "Rentabilidad baja"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mensaje de error */}
      {calcResults.error && (
        <Card className="bg-red-50 border-red-200 animate-fade-in rounded-xl">
          <CardContent className="p-4 flex items-center text-red-700">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span className="font-medium">{calcResults.error}</span>
          </CardContent>
        </Card>
      )}

      {(calcResults.roi !== null) && (
        <div className="space-y-6 animate-fade-in">
          {/* Header del Dashboard con Toggle */}
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-lg rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 text-white">
                <div className="text-center flex-1">
                  <h2 className="text-2xl font-bold mb-2">
                    {showHeatmap ? '🔥 Heatmap de Profitabilidad' : '🎯 Mapa de Rentabilidad Completo'}
                  </h2>
                  <p className="text-blue-100">
                    {showHeatmap 
                      ? 'Explora escenarios de rentabilidad variando CPA y Tasa de Conversión'
                      : 'Análisis integral de tu campaña COD'
                    }
                  </p>
                </div>
                {/* Botón Toggle */}
                <div className="flex items-center justify-center md:justify-end space-x-3">
                  <Button
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    variant="outline"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all duration-300 px-2 py-1 text-xs md:px-4 md:py-2 md:text-base"
                  >
                    {showHeatmap ? (
                      <>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Ver Mapa Normal</span>
                        <span className="inline sm:hidden">Normal</span>
                      </>
                    ) : (
                      <>
                        <span className="mr-1">🔥</span>
                        <span className="hidden sm:inline">Ver Heatmap</span>
                        <span className="inline sm:hidden">Heatmap</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Contenido Condicional */}
          {showHeatmap ? (
            <div className="space-y-6">
              {/* Configuración del Heatmap */}
              <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-red-100 pb-4">
                  <CardTitle className="text-orange-900 font-semibold flex items-center">
                    <div className="h-8 w-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                      ⚙️
                    </div>
                    Configuración del Análisis
                  </CardTitle>
                  <CardDescription className="text-orange-700">
                    El heatmap variará CPA (20-100) y Tasa de Conversión (10%-50%) basado en tus otros datos
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-lg font-semibold text-blue-700">Precio Producto</div>
                      <div className="text-2xl font-bold text-blue-900">{getCurrencySymbol()} {inputValues.precioProducto || 0}</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-lg font-semibold text-green-700">Costo Total/Pedido</div>
                      <div className="text-2xl font-bold text-green-900">
                        {getCurrencySymbol()} {(
                          (Number(inputValues.costoProducto) || 0) + 
                          (Number(inputValues.gastoOperativo) || 0) + 
                          (Number(inputValues.comisionCourier) || 0)
                        ).toFixed(0)}
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-lg font-semibold text-purple-700">Tasa de Entrega</div>
                      <div className="text-2xl font-bold text-purple-900">{inputValues.tasaEntrega || 0}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Heatmap Principal */}
              <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-red-50 to-orange-100 pb-4">
                  <CardTitle className="text-red-900 font-semibold flex items-center">
                    <div className="h-8 w-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                      🔥
                    </div>
                    Mapa de Calor: ROI por CPA vs Tasa de Conversión
                  </CardTitle>
                  <CardDescription className="text-red-700">
                    Verde = Rentable | Amarillo = Marginal | Rojo = Pérdidas
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ReactApexChart
                    options={{
                      chart: {
                        type: 'heatmap',
                        toolbar: { show: false },
                        height: 500
                      },
                      dataLabels: {
                        enabled: true,
                        style: {
                          colors: ['#1e293b'],
                          fontSize: '11px',
                          fontWeight: 600
                        },
                        formatter: function(val) {
                          return Number(val) > 0 ? '+' + Number(val).toFixed(0) + '%' : Number(val).toFixed(0) + '%';
                        }
                      },
                      colors: ["#ef4444"],
                      plotOptions: {
                        heatmap: {
                          shadeIntensity: 0.5,
                          radius: 8,
                          useFillColorAsStroke: false,
                          colorScale: {
                            ranges: [
                              { from: -100, to: -0.1, color: '#dc2626', name: 'Pérdidas' },
                              { from: 0, to: 19.9, color: '#f59e0b', name: 'Marginal' },
                              { from: 20, to: 49.9, color: '#eab308', name: 'Bueno' },
                              { from: 50, to: 99.9, color: '#22c55e', name: 'Muy Bueno' },
                              { from: 100, to: 500, color: '#16a34a', name: 'Excelente' }
                            ]
                          }
                        }
                      },
                      xaxis: {
                        title: { text: 'CPA (' + getCurrencySymbol() + ')' },
                        labels: {
                          style: { fontSize: '12px', fontWeight: 600 }
                        }
                      },
                      yaxis: {
                        title: { text: 'Tasa de Conversión (%)' },
                        labels: {
                          style: { fontSize: '12px', fontWeight: 600 }
                        }
                      },
                      tooltip: {
                        y: {
                          formatter: function(val) {
                            return 'ROI: ' + Number(val).toFixed(1) + '%';
                          }
                        }
                      },
                      title: {
                        text: 'Análisis de Rentabilidad - Variación de CPA vs Tasa de Conversión',
                        align: 'center',
                        style: {
                          fontSize: '16px',
                          fontWeight: 600,
                          color: '#374151'
                        }
                      }
                    }}
                    series={heatmapData}
                    type="heatmap"
                    height={500}
                  />
                </CardContent>
              </Card>

              {/* Análisis del Heatmap */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-100 pb-4">
                    <CardTitle className="text-green-900 font-semibold flex items-center">
                      <div className="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                        ✅
                      </div>
                      Zonas Rentables
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <h4 className="font-semibold text-green-800 mb-2">🎯 Zona Óptima</h4>
                        <p className="text-green-700 text-sm">
                          CPA &lt; {getCurrencySymbol()} 40 + Conversión &gt; 25% = ROI excelente (&gt;50%)
                        </p>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                        <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Zona Marginal</h4>
                        <p className="text-yellow-700 text-sm">
                          CPA {getCurrencySymbol()} 40-60 + Conversión 20-30% = ROI moderado (0-20%)
                        </p>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                        <h4 className="font-semibold text-red-800 mb-2">❌ Zona de Pérdidas</h4>
                        <p className="text-red-700 text-sm">
                          CPA &gt; {getCurrencySymbol()} 70 + Conversión &lt; 20% = ROI negativo
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100 pb-4">
                    <CardTitle className="text-blue-900 font-semibold flex items-center">
                      <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                        💡
                      </div>
                      Recomendaciones Estratégicas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">🚀 Para Escalar</h4>
                        <p className="text-blue-700 text-sm">
                          Mantén CPA &lt; {getCurrencySymbol()} {Math.round(((Number(inputValues.precioProducto) || 200) - ((Number(inputValues.costoProducto) || 80) + (Number(inputValues.gastoOperativo) || 20) + (Number(inputValues.comisionCourier) || 15))) * 0.6)} y optimiza conversión al 30%+
                        </p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-2">🎯 Para Optimizar</h4>
                        <p className="text-purple-700 text-sm">
                          Si tu CPA actual es alto, enfócate primero en mejorar la tasa de conversión antes de reducir CPA
                        </p>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <h4 className="font-semibold text-orange-800 mb-2">⚡ Acción Inmediata</h4>
                        <p className="text-orange-700 text-sm">
                          Tu posición actual: CPA {getCurrencySymbol()}{inputValues.cpa || 0}, Conversión {inputValues.tasaCierre || 0}% 
                          {(() => {
                            const currentCPA = Number(inputValues.cpa) || 0;
                            const currentConv = Number(inputValues.tasaCierre) || 0;
                            if (currentCPA < 40 && currentConv > 25) return "🟢 ¡Estás en zona rentable!";
                            if (currentCPA > 70 || currentConv < 15) return "🔴 Necesitas optimizar urgente";
                            return "🟡 Puedes mejorar";
                          })()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabla de Escenarios Específicos */}
              <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 pb-4">
                  <CardTitle className="text-gray-900 font-semibold flex items-center">
                    <div className="h-8 w-8 bg-gray-500 rounded-lg flex items-center justify-center mr-3">
                      📊
                    </div>
                    Escenarios de Optimización
                  </CardTitle>
                  <CardDescription className="text-gray-700">
                    Proyecciones basadas en tus datos actuales
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left p-3 font-semibold">Escenario</th>
                          <th className="text-center p-3 font-semibold">CPA</th>
                          <th className="text-center p-3 font-semibold">Conversión</th>
                          <th className="text-center p-3 font-semibold">Entregas</th>
                          <th className="text-center p-3 font-semibold">ROI</th>
                          <th className="text-center p-3 font-semibold">Ganancia</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const scenarios = [
                            { name: "😫 Actual", cpa: Number(inputValues.cpa) || 45, conv: Number(inputValues.tasaCierre) || 15 },
                            { name: "🎯 Optimizado", cpa: 35, conv: 25 },
                            { name: "🚀 Excelente", cpa: 25, conv: 35 },
                            { name: "💎 Ideal", cpa: 20, conv: 40 }
                          ];
                          return scenarios.map((scenario, index) => {
                            const investment = Number(inputValues.inversionPublicitaria) || 2000;
                            const leads = investment / scenario.cpa;
                            const conversions = leads * (scenario.conv / 100);
                            const deliveries = conversions * ((Number(inputValues.tasaEntrega) || 85) / 100);
                            const revenue = deliveries * (Number(inputValues.precioProducto) || 200);
                            const costPerOrder = (Number(inputValues.costoProducto) || 80) + (Number(inputValues.gastoOperativo) || 20) + (Number(inputValues.comisionCourier) || 15);
                            const variableCosts = deliveries * costPerOrder;
                            const profit = revenue - variableCosts - investment;
                            const roi = (profit / investment) * 100;
                            return (
                              <tr key={index} className={`border-b border-gray-100 ${index === 0 ? 'bg-blue-50' : ''}`}>
                                <td className="p-3 font-medium">{scenario.name}</td>
                                <td className="p-3 text-center">{getCurrencySymbol()}{scenario.cpa}</td>
                                <td className="p-3 text-center">{scenario.conv}%</td>
                                <td className="p-3 text-center">{deliveries.toFixed(1)}</td>
                                <td className={`p-3 text-center font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {roi.toFixed(1)}%
                                </td>
                                <td className={`p-3 text-center font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {getCurrencySymbol()}{profit.toFixed(0)}
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Distribución de Costos */}
              <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-4">
                  <CardTitle className="text-blue-900 font-semibold flex items-center">
                    <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">🍩</div>
                    Distribución de Costos
                  </CardTitle>
                  <CardDescription className="text-blue-700">¿Dónde se va tu inversión?</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ReactApexChart
                    options={{
                      chart: { type: 'donut', toolbar: { show: false } },
                      labels: ['Inversión Publicitaria', 'Costos de Producto', 'Gastos Operativos', 'Comisión Courier'],
                      colors: ['#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6'],
                      dataLabels: {
                        enabled: true,
                        formatter: function (val, opts) {
                          return getCurrencySymbol() + ' ' + Number(val).toFixed(0);
                        },
                      },
                      plotOptions: {
                        pie: {
                          donut: {
                            size: '60%',
                            labels: {
                              show: true,
                              total: {
                                show: true,
                                label: 'Total',
                                formatter: () => getCurrencySymbol() + ' ' + (
                                  Number(inputValues.inversionPublicitaria || 0) +
                                  Number(inputValues.costoProducto || 0) * Number(derived.entregas || 0) +
                                  Number(inputValues.gastoOperativo || 0) * Number(derived.entregas || 0) +
                                  Number(inputValues.comisionCourier || 0) * Number(derived.entregas || 0)
                                ).toFixed(0)
                              }
                            }
                          }
                        }
                      },
                      legend: { position: 'bottom', horizontalAlign: 'center' },
                      tooltip: {
                        y: { formatter: (val) => getCurrencySymbol() + ' ' + Number(val).toFixed(2) },
                      },
                    }}
                    series={[
                      Number(inputValues.inversionPublicitaria) || 0,
                      ((Number(inputValues.costoProducto) || 0) * (derived.entregas || 0)),
                      ((Number(inputValues.gastoOperativo) || 0) * (derived.entregas || 0)),
                      ((Number(inputValues.comisionCourier) || 0) * (derived.entregas || 0))
                    ]}
                    type="donut"
                    height={300}
                  />
                </CardContent>
              </Card>
              {/* Gráfico del Funnel */}
              <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 pb-4">
                  <CardTitle className="text-green-900 font-semibold flex items-center">
                    <div className="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">📊</div>
                    Funnel de Conversión
                  </CardTitle>
                  <CardDescription className="text-green-700">De leads a entregas exitosas</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ReactApexChart
                    options={{
                      chart: { type: 'bar', toolbar: { show: false } },
                      plotOptions: { bar: { horizontal: false, borderRadius: 8, dataLabels: { position: 'top' } } },
                      dataLabels: {
                        enabled: true,
                        formatter: function (val) { return Number(val).toFixed(1); },
                        offsetY: -20,
                        style: { fontSize: '12px', colors: ["#304758"] }
                      },
                      xaxis: {
                        categories: ['Leads', 'Conversiones', 'Entregas'],
                        labels: { style: { colors: ['#059669', '#059669', '#059669'], fontSize: '14px', fontWeight: 600 } }
                      },
                      yaxis: { title: { text: 'Cantidad' } },
                      colors: ['#10b981'],
                      grid: { borderColor: '#e5e7eb' },
                      tooltip: { y: { formatter: (val) => Number(val).toFixed(1) + ' unidades' } },
                    }}
                    series={[
                      { name: 'Cantidad', data: [derived.leads || 0, derived.conversiones || 0, derived.entregas || 0] },
                    ]}
                    type="bar"
                    height={300}
                  />
                </CardContent>
              </Card>
              {/* Gráfico de Rentabilidad */}
              <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 pb-4">
                  <CardTitle className="text-purple-900 font-semibold flex items-center">
                    <div className="h-8 w-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">💰</div>
                    Análisis Financiero
                  </CardTitle>
                  <CardDescription className="text-purple-700">Ingresos vs Costos vs Ganancia</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ReactApexChart
                    options={{
                      chart: { type: 'bar', toolbar: { show: false } },
                      plotOptions: { bar: { horizontal: false, borderRadius: 8, dataLabels: { position: 'top' } } },
                      dataLabels: {
                        enabled: true,
                        formatter: function (val) { return getCurrencySymbol() + ' ' + Number(val).toFixed(0); },
                        offsetY: -20,
                        style: { fontSize: '12px', colors: ["#304758"] }
                      },
                      xaxis: {
                        categories: ['Ingresos', 'Costos', 'Ganancia/Pérdida'],
                        labels: { style: { fontSize: '14px', fontWeight: 600 } }
                      },
                      yaxis: { title: { text: `Monto (${getCurrencySymbol()})` } },
                      colors: [
                        '#10b981', // Ingresos
                        '#ef4444', // Costos
                        (Number(derived.ganancia) >= 0 ? '#10b981' : '#ef4444') // Ganancia/Pérdida
                      ],
                      grid: { borderColor: '#e5e7eb' },
                      tooltip: { y: { formatter: (val) => getCurrencySymbol() + ' ' + Number(val).toFixed(2) } },
                    }}
                    series={[
                      { name: 'Monto', data: [derived.ingresosTotales || 0, derived.costosTotal || 0, Math.abs(derived.ganancia || 0)] },
                    ]}
                    type="bar"
                    height={300}
                  />
                </CardContent>
              </Card>
              {/* Gráfico Radar de Métricas */}
              <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 pb-4">
                  <CardTitle className="text-indigo-900 font-semibold flex items-center">
                    <div className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">🎯</div>
                    Radar de Performance
                  </CardTitle>
                  <CardDescription className="text-indigo-700">Visualización integral de métricas</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ReactApexChart
                    options={{
                      chart: { type: 'radar', toolbar: { show: false } },
                      xaxis: {
                        categories: ['CPA Score', 'Tasa Cierre', 'Tasa Entrega', 'Margen Producto', 'ROAS Score'],
                        labels: { style: { colors: ['#6366f1', '#6366f1', '#6366f1', '#6366f1', '#6366f1'], fontSize: '12px' } }
                      },
                      yaxis: { max: 100, tickAmount: 5 },
                      plotOptions: { radar: { polygons: { strokeColors: '#e5e7eb', fill: { colors: ['#f8fafc', '#f1f5f9'] } } } },
                      colors: [calcResults.roi >= 0 ? '#10b981' : '#ef4444'],
                      markers: { size: 4, strokeWidth: 2, fillOpacity: 1 },
                      fill: { opacity: 0.1 },
                      stroke: { width: 2 }
                    }}
                    series={[
                      { name: 'Performance', data: [
                        Math.max(0, 100 - ((Number(inputValues.cpa) || 50) / 100 * 100)),
                        Number(inputValues.tasaCierre) || 0,
                        Number(inputValues.tasaEntrega) || 0,
                        (Number(inputValues.precioProducto) && Number(inputValues.costoProducto)) ? ((Number(inputValues.precioProducto) - Number(inputValues.costoProducto)) / Number(inputValues.precioProducto)) * 100 : 0,
                        calcResults && calcResults.roas ? Math.min(calcResults.roas * 25, 100) : 0
                      ] },
                    ]}
                    type="radar"
                    height={300}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      <div className="mt-8">
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-0 shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2 text-gray-900 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-blue-500" />
              Análisis de Rentabilidad
            </h3>
            <div className="text-gray-700 text-base">
              {typeof calcResults.roi === 'number' && !isNaN(calcResults.roi) ? (
                calcResults.roi < 0 ? (
                  <>
                    <span className="font-semibold text-red-600">No es rentable.</span> Estás perdiendo dinero. Revisa:
                    <ul className="list-disc ml-6 mt-2">
                      <li>El <b>costo del producto</b> o <b>gastos operativos</b> son muy altos.</li>
                      <li>La <b>tasa de cierre</b> o <b>tasa de entrega</b> es baja.</li>
                      <li>El <b>precio de venta</b> es insuficiente para cubrir los costos.</li>
                      <li>La <b>inversión publicitaria</b> es demasiado alta para el retorno.</li>
                    </ul>
                    <span className="block mt-2">Sugerencia: Optimiza tus costos, mejora la conversión y revisa tu estrategia de precios.</span>
                  </>
                ) : calcResults.roi < 30 ? (
                  <>
                    <span className="font-semibold text-yellow-600">Rentabilidad baja.</span> Apenas cubres los costos. Considera:
                    <ul className="list-disc ml-6 mt-2">
                      <li>Reducir <b>costos variables</b> o <b>comisiones</b>.</li>
                      <li>Mejorar la <b>tasa de cierre</b> y <b>entrega</b>.</li>
                      <li>Incrementar el <b>precio de venta</b> si es posible.</li>
                    </ul>
                    <span className="block mt-2">Sugerencia: Pequeños ajustes pueden mejorar tu margen.</span>
                  </>
                ) : calcResults.roi < 100 ? (
                  <>
                    <span className="font-semibold text-green-600">Rentabilidad aceptable.</span> Tu campaña es rentable, pero aún hay margen de mejora.
                    <ul className="list-disc ml-6 mt-2">
                      <li>Optimiza <b>costos</b> y <b>procesos</b> para aumentar el margen.</li>
                      <li>Analiza si puedes escalar la inversión manteniendo el ROAS.</li>
                    </ul>
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-emerald-600">¡Rentabilidad excelente!</span> Tu campaña está generando muy buenos resultados.
                    <ul className="list-disc ml-6 mt-2">
                      <li>Mantén la estrategia y busca oportunidades de escalado.</li>
                      <li>Reinvierte parte de la ganancia para crecer más rápido.</li>
                    </ul>
                  </>
                )
              ) : (
                <span className="text-gray-500">Completa los datos y calcula para ver el análisis.</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function calculateDerivedMetrics(calcResults: any, inputValues: any) {
  if (!calcResults || calcResults.roi === null || calcResults.roi === undefined) return {};
  const leads = (Number(inputValues.inversionPublicitaria) || 0) / (Number(inputValues.cpa) || 1);
  const conversiones = leads * ((Number(inputValues.tasaCierre) || 0) / 100);
  const entregas = conversiones * ((Number(inputValues.tasaEntrega) || 0) / 100);
  const ingresosTotales = entregas * (Number(inputValues.precioProducto) || 0);
  const costosVariables = entregas * ((Number(inputValues.costoProducto) || 0) + (Number(inputValues.gastoOperativo) || 0) + (Number(inputValues.comisionCourier) || 0));
  const costosTotal = costosVariables + (Number(inputValues.inversionPublicitaria) || 0);
  const ganancia = ingresosTotales - costosTotal;
  return { leads, conversiones, entregas, ingresosTotales, costosTotal, ganancia };
} 