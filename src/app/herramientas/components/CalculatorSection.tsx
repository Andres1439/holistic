import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, TrendingUp, Calculator, DollarSign, Target, Percent, AlertTriangle } from "lucide-react";
import dynamic from 'next/dynamic';
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
  isDollarMode,
  setIsDollarMode,
  dollarRate,
  setDollarRate,
  convertCurrency,
  getCurrencySymbol
}: any) {
  const derived = calculateDerivedMetrics(calcResults, inputValues);

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
            
            {/* Botón de cambio de moneda */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Label htmlFor="dollar-rate" className="text-sm text-blue-700 font-medium">
                  Tipo de cambio:
                </Label>
                <Input
                  id="dollar-rate"
                  type="number"
                  value={dollarRate}
                  onChange={(e) => setDollarRate(e.target.value)}
                  className="w-20 h-8 text-sm border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="3.75"
                  step="0.01"
                  min="0"
                />
              </div>
              <Button
                onClick={() => setIsDollarMode(!isDollarMode)}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-900 font-medium transition-all duration-300"
              >
                <span className="text-lg font-bold">{getCurrencySymbol()}</span>
                <span className="ml-2 text-sm">
                  {isDollarMode ? "Dólares" : "Soles"}
                </span>
              </Button>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in mt-6">
        <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden flex flex-col items-center justify-center p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <span className="text-blue-900 font-semibold text-lg">CPA</span>
          </div>
          <div className="text-3xl font-bold text-blue-700">{Number((calcResults.cpaReal ?? 0).toFixed(2))}</div>
        </Card>
        <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden flex flex-col items-center justify-center p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <span className="text-green-900 font-semibold text-lg">ROAS</span>
          </div>
          <div className="text-3xl font-bold text-green-700">{Number((calcResults.roas ?? 0).toFixed(2))}</div>
        </Card>
        <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden flex flex-col items-center justify-center p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-10 w-10 bg-violet-500 rounded-lg flex items-center justify-center">
              <Percent className="h-5 w-5 text-white" />
            </div>
            <span className="text-violet-900 font-semibold text-lg">ROI</span>
          </div>
          <div className="text-3xl font-bold text-violet-700">{Number((calcResults.roi ?? 0).toFixed(2))}%</div>
        </Card>
        <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden flex flex-col items-center justify-center p-6">
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
          {/* Header del Dashboard */}
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-lg rounded-xl overflow-hidden">
            <CardContent className="p-6 text-center text-white">
              <h2 className="text-2xl font-bold mb-2">🎯 Mapa de Rentabilidad Completo</h2>
              <p className="text-blue-100">Análisis integral de tu campaña COD</p>
            </CardContent>
          </Card>
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
                      formatter: function (val) { return val.toFixed(1); },
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
                    tooltip: { y: { formatter: (val) => val.toFixed(1) + ' unidades' } },
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
          {/* Insights y tabla de break-even analysis igual que en tu ejemplo... */}
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
  if (!calcResults || !calcResults.roi) return {};
  const leads = (Number(inputValues.inversionPublicitaria) || 0) / (Number(inputValues.cpa) || 1);
  const conversiones = leads * ((Number(inputValues.tasaCierre) || 0) / 100);
  const entregas = conversiones * ((Number(inputValues.tasaEntrega) || 0) / 100);
  const ingresosTotales = entregas * (Number(inputValues.precioProducto) || 0);
  const costosVariables = entregas * ((Number(inputValues.costoProducto) || 0) + (Number(inputValues.gastoOperativo) || 0) + (Number(inputValues.comisionCourier) || 0));
  const costosTotal = costosVariables + (Number(inputValues.inversionPublicitaria) || 0);
  const ganancia = ingresosTotales - costosTotal;
  return { leads, conversiones, entregas, ingresosTotales, costosTotal, ganancia };
} 