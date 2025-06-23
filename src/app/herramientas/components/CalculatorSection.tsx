import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, TrendingUp } from "lucide-react";

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
  handleTabChange
}: any) {
  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">Calculadora de Rentabilidad</h1>
        <p className="text-blue-700">Analiza la rentabilidad de tus campañas COD</p>
      </div>
      <Card className="bg-white border border-gray-200 shadow hover:border-blue-400 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-blue-900">Parámetros de Cálculo</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeCalcTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-blue-50">
              <TabsTrigger value="conversiones" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-blue-900">Conversiones</TabsTrigger>
              <TabsTrigger value="whatsapp" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-blue-900">WhatsApp</TabsTrigger>
            </TabsList>
            {/* Conversiones */}
            <TabsContent value="conversiones" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Inputs Conversiones */}
                {/* ... (igual que en page.tsx) ... */}
                <div>
                  <Label htmlFor="inversion-pub" className="text-blue-900">
                    Inversión Publicitaria (S/)
                  </Label>
                  <Input
                    id="inversion-pub"
                    type="number"
                    value={inputValues.inversionPublicitaria}
                    onChange={(e) => handleInputChange('inversionPublicitaria', e.target.value, 'conversiones')}
                    className="bg-white border-blue-200 text-blue-900"
                  />
                </div>
                <div>
                  <Label htmlFor="cpa-calc" className="text-blue-900">
                    CPA (S/)
                  </Label>
                  <Input
                    id="cpa-calc"
                    type="number"
                    value={inputValues.cpa}
                    onChange={(e) => handleInputChange('cpa', e.target.value, 'conversiones')}
                    className="bg-white border-blue-200 text-blue-900"
                  />
                </div>
                <div>
                  <Label htmlFor="tasa-cierre" className="text-blue-900">
                    Tasa de Cierre (%)
                  </Label>
                  <Input
                    id="tasa-cierre"
                    type="number"
                    value={inputValues.tasaCierre}
                    onChange={(e) => handleInputChange('tasaCierre', e.target.value, 'conversiones')}
                    className="bg-white border-blue-200 text-blue-900"
                  />
                </div>
                <div>
                  <Label htmlFor="precio-producto" className="text-blue-900">
                    Precio del Producto (S/)
                  </Label>
                  <Input
                    id="precio-producto"
                    type="number"
                    value={inputValues.precioProducto}
                    onChange={(e) => handleInputChange('precioProducto', e.target.value, 'shared')}
                    className="bg-white border-blue-200 text-blue-900"
                  />
                </div>
                <div>
                  <Label htmlFor="costo-producto" className="text-blue-900">
                    Costo del Producto (S/)
                  </Label>
                  <Input
                    id="costo-producto"
                    type="number"
                    value={inputValues.costoProducto}
                    onChange={(e) => handleInputChange('costoProducto', e.target.value, 'shared')}
                    className="bg-white border-blue-200 text-blue-900"
                  />
                </div>
                <div>
                  <Label htmlFor="gasto-operativo" className="text-blue-900">
                    Gasto Operativo/Pedido (S/)
                  </Label>
                  <Input
                    id="gasto-operativo"
                    type="number"
                    value={inputValues.gastoOperativo}
                    onChange={(e) => handleInputChange('gastoOperativo', e.target.value, 'shared')}
                    className="bg-white border-blue-200 text-blue-900"
                  />
                </div>
                <div>
                  <Label htmlFor="tasa-entrega-calc" className="text-blue-900">
                    Tasa de Entrega (%)
                  </Label>
                  <Input
                    id="tasa-entrega-calc"
                    type="number"
                    value={inputValues.tasaEntrega}
                    onChange={(e) => handleInputChange('tasaEntrega', e.target.value, 'conversiones')}
                    min="0"
                    max="100"
                    className="bg-white border-blue-200 text-blue-900"
                  />
                  {conversionData.tasaEntrega > 100 && (
                    <p className="text-red-500 text-sm">La tasa de entrega debe ser menor o igual a 100%</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="comision-courier" className="text-blue-900">
                    Comisión Courier (S/)
                  </Label>
                  <Input
                    id="comision-courier"
                    type="number"
                    value={inputValues.comisionCourier}
                    onChange={(e) => handleInputChange('comisionCourier', e.target.value, 'shared')}
                    className="bg-white border-blue-200 text-blue-900"
                  />
                </div>
              </div>
              <Button
                onClick={calculateResults}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
              >
                Calcular Rentabilidad
              </Button>
              <Button
                onClick={clearAllData}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-100 hover:text-blue-900 ml-2"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpiar Datos
              </Button>
            </TabsContent>
            {/* WhatsApp */}
            <TabsContent value="whatsapp" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Inputs WhatsApp */}
                <div>
                  <Label htmlFor="inversion-pub-wa" className="text-blue-900">
                    Inversión Publicitaria (S/)
                  </Label>
                  <Input
                    id="inversion-pub-wa"
                    type="number"
                    value={inputValues.inversionPublicitaria}
                    onChange={(e) => handleInputChange('inversionPublicitaria', e.target.value, 'whatsapp')}
                    className="bg-white border-blue-200 text-blue-900"
                  />
                </div>
                <div>
                  <Label htmlFor="costo-mensaje" className="text-blue-900">
                    Costo por Mensaje (CPM) (S/)
                  </Label>
                  <Input
                    id="costo-mensaje"
                    type="number"
                    value={inputValues.costoPorMensaje}
                    onChange={(e) => handleInputChange('costoPorMensaje', e.target.value, 'whatsapp')}
                    className="bg-white border-blue-200 text-blue-900"
                  />
                </div>
                <div>
                  <Label htmlFor="tasa-conversion-wa" className="text-blue-900">
                    Tasa de Conversión WhatsApp (%)
                  </Label>
                  <Input
                    id="tasa-conversion-wa"
                    type="number"
                    value={inputValues.tasaConversionWhatsApp}
                    onChange={(e) => handleInputChange('tasaConversionWhatsApp', e.target.value, 'whatsapp')}
                    min="0"
                    max="100"
                    className="bg-white border-blue-200 text-blue-900"
                  />
                  {whatsappData.tasaConversionWhatsApp > 100 && (
                    <p className="text-red-500 text-sm">La tasa de conversión debe ser menor o igual a 100%</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="precio-producto-wa" className="text-blue-900">
                    Precio del Producto (S/)
                  </Label>
                  <Input
                    id="precio-producto-wa"
                    type="number"
                    value={inputValues.precioProducto}
                    onChange={(e) => handleInputChange('precioProducto', e.target.value, 'shared')}
                    className="bg-white border-blue-200 text-blue-900"
                  />
                </div>
                <div>
                  <Label htmlFor="costo-producto-wa" className="text-blue-900">
                    Costo del Producto (S/)
                  </Label>
                  <Input
                    id="costo-producto-wa"
                    type="number"
                    value={inputValues.costoProducto}
                    onChange={(e) => handleInputChange('costoProducto', e.target.value, 'shared')}
                    className="bg-white border-blue-200 text-blue-900"
                  />
                </div>
                <div>
                  <Label htmlFor="gasto-operativo-wa" className="text-blue-900">
                    Gasto Operativo/Pedido (S/)
                  </Label>
                  <Input
                    id="gasto-operativo-wa"
                    type="number"
                    value={inputValues.gastoOperativo}
                    onChange={(e) => handleInputChange('gastoOperativo', e.target.value, 'shared')}
                    className="bg-white border-blue-200 text-blue-900"
                  />
                </div>
                <div>
                  <Label htmlFor="tasa-entrega-wa" className="text-blue-900">
                    Tasa de Entrega (%)
                  </Label>
                  <Input
                    id="tasa-entrega-wa"
                    type="number"
                    value={inputValues.tasaEntrega}
                    onChange={(e) => handleInputChange('tasaEntrega', e.target.value, 'whatsapp')}
                    min="0"
                    max="100"
                    className="bg-white border-blue-200 text-blue-900"
                  />
                  {whatsappData.tasaEntrega > 100 && (
                    <p className="text-red-500 text-sm">La tasa de entrega debe ser menor o igual a 100%</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="comision-courier-wa" className="text-blue-900">
                    Comisión Courier (S/)
                  </Label>
                  <Input
                    id="comision-courier-wa"
                    type="number"
                    value={inputValues.comisionCourier}
                    onChange={(e) => handleInputChange('comisionCourier', e.target.value, 'shared')}
                    className="bg-white border-blue-200 text-blue-900"
                  />
                </div>
              </div>
              <Button
                onClick={calculateResults}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
              >
                Calcular Rentabilidad
              </Button>
              <Button
                onClick={clearAllData}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-100 hover:text-blue-900 ml-2"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpiar Datos
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      {/* Resultados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-fade-in">
        <Card className="bg-white border border-gray-200 shadow hover:border-blue-400 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardDescription className="text-blue-700 text-sm">CPA REAL</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-blue-900">
              {calcResults.cpaReal !== null && !isNaN(calcResults.cpaReal) ? `S/ ${calcResults.cpaReal.toFixed(2)}` : "--"}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200 shadow hover:border-blue-400 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardDescription className="text-blue-700 text-sm">ROAS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-blue-900">
              {calcResults.roas !== null && !isNaN(calcResults.roas) ? `${calcResults.roas.toFixed(2)}x` : "--"}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200 shadow hover:border-blue-400 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardDescription className="text-blue-700 text-sm">ROI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-blue-900">
              {calcResults.roi !== null && !isNaN(calcResults.roi) ? `${calcResults.roi.toFixed(1)}%` : "--"}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200 shadow hover:border-blue-400 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardDescription className="text-blue-700 text-sm">MARGEN NETO</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-blue-900">
              {calcResults.margenNeto !== null && !isNaN(calcResults.margenNeto) ? `S/ ${calcResults.margenNeto.toFixed(2)}` : "--"}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Análisis */}
      {calcResults.roi !== null && calcResults.roi > 0 && (
        <Card className="bg-accent/10 border-accent/30 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-6 w-6 text-accent" />
              <div>
                <h3 className="text-accent font-semibold text-lg">Análisis de Rentabilidad</h3>
                <p className="text-white/80">
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
        <Card className="bg-red-500/10 border-red-500/30 animate-fade-in">
          <CardContent className="p-4 flex items-center text-red-400">
            <span>{calcResults.error}</span>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 