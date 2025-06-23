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
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Calculadora de Rentabilidad</h1>
        <p className="text-white/70">Analiza la rentabilidad de tus campañas COD</p>
      </div>
      <Card className="bg-primary-medium/20 border-primary-light/20 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-white">Parámetros de Cálculo</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeCalcTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-primary-dark/50">
              <TabsTrigger
                value="conversiones"
                className="data-[state=active]:bg-accent data-[state=active]:text-black"
              >
                Conversiones
              </TabsTrigger>
              <TabsTrigger
                value="whatsapp"
                className="data-[state=active]:bg-accent data-[state=active]:text-black"
              >
                WhatsApp
              </TabsTrigger>
            </TabsList>
            {/* Conversiones */}
            <TabsContent value="conversiones" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Inputs Conversiones */}
                {/* ... (igual que en page.tsx) ... */}
                <div>
                  <Label htmlFor="inversion-pub" className="text-white/80">
                    Inversión Publicitaria (S/)
                  </Label>
                  <Input
                    id="inversion-pub"
                    type="number"
                    value={inputValues.inversionPublicitaria}
                    onChange={(e) => handleInputChange('inversionPublicitaria', e.target.value, 'conversiones')}
                    className="bg-primary-dark/50 border-primary-light/30 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="cpa-calc" className="text-white/80">
                    CPA (S/)
                  </Label>
                  <Input
                    id="cpa-calc"
                    type="number"
                    value={inputValues.cpa}
                    onChange={(e) => handleInputChange('cpa', e.target.value, 'conversiones')}
                    className="bg-primary-dark/50 border-primary-light/30 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="tasa-cierre" className="text-white/80">
                    Tasa de Cierre (%)
                  </Label>
                  <Input
                    id="tasa-cierre"
                    type="number"
                    value={inputValues.tasaCierre}
                    onChange={(e) => handleInputChange('tasaCierre', e.target.value, 'conversiones')}
                    className="bg-primary-dark/50 border-primary-light/30 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="precio-producto" className="text-white/80">
                    Precio del Producto (S/)
                  </Label>
                  <Input
                    id="precio-producto"
                    type="number"
                    value={inputValues.precioProducto}
                    onChange={(e) => handleInputChange('precioProducto', e.target.value, 'shared')}
                    className="bg-primary-dark/50 border-primary-light/30 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="costo-producto" className="text-white/80">
                    Costo del Producto (S/)
                  </Label>
                  <Input
                    id="costo-producto"
                    type="number"
                    value={inputValues.costoProducto}
                    onChange={(e) => handleInputChange('costoProducto', e.target.value, 'shared')}
                    className="bg-primary-dark/50 border-primary-light/30 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="gasto-operativo" className="text-white/80">
                    Gasto Operativo/Pedido (S/)
                  </Label>
                  <Input
                    id="gasto-operativo"
                    type="number"
                    value={inputValues.gastoOperativo}
                    onChange={(e) => handleInputChange('gastoOperativo', e.target.value, 'shared')}
                    className="bg-primary-dark/50 border-primary-light/30 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="tasa-entrega-calc" className="text-white/80">
                    Tasa de Entrega (%)
                  </Label>
                  <Input
                    id="tasa-entrega-calc"
                    type="number"
                    value={inputValues.tasaEntrega}
                    onChange={(e) => handleInputChange('tasaEntrega', e.target.value, 'conversiones')}
                    min="0"
                    max="100"
                    className="bg-primary-dark/50 border-primary-light/30 text-white"
                  />
                  {conversionData.tasaEntrega > 100 && (
                    <p className="text-red-500 text-sm">La tasa de entrega debe ser menor o igual a 100%</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="comision-courier" className="text-white/80">
                    Comisión Courier (S/)
                  </Label>
                  <Input
                    id="comision-courier"
                    type="number"
                    value={inputValues.comisionCourier}
                    onChange={(e) => handleInputChange('comisionCourier', e.target.value, 'shared')}
                    className="bg-primary-dark/50 border-primary-light/30 text-white"
                  />
                </div>
              </div>
              <Button
                onClick={calculateResults}
                className="bg-accent hover:bg-accent/90 text-black w-full sm:w-auto"
              >
                Calcular Rentabilidad
              </Button>
              <Button
                onClick={clearAllData}
                variant="outline"
                className="border-red-500/30 text-red-500 hover:bg-red-500/10 ml-2"
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
                  <Label htmlFor="inversion-pub-wa" className="text-white/80">
                    Inversión Publicitaria (S/)
                  </Label>
                  <Input
                    id="inversion-pub-wa"
                    type="number"
                    value={inputValues.inversionPublicitaria}
                    onChange={(e) => handleInputChange('inversionPublicitaria', e.target.value, 'whatsapp')}
                    className="bg-primary-dark/50 border-primary-light/30 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="costo-mensaje" className="text-white/80">
                    Costo por Mensaje (CPM) (S/)
                  </Label>
                  <Input
                    id="costo-mensaje"
                    type="number"
                    value={inputValues.costoPorMensaje}
                    onChange={(e) => handleInputChange('costoPorMensaje', e.target.value, 'whatsapp')}
                    className="bg-primary-dark/50 border-primary-light/30 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="tasa-conversion-wa" className="text-white/80">
                    Tasa de Conversión WhatsApp (%)
                  </Label>
                  <Input
                    id="tasa-conversion-wa"
                    type="number"
                    value={inputValues.tasaConversionWhatsApp}
                    onChange={(e) => handleInputChange('tasaConversionWhatsApp', e.target.value, 'whatsapp')}
                    min="0"
                    max="100"
                    className="bg-primary-dark/50 border-primary-light/30 text-white"
                  />
                  {whatsappData.tasaConversionWhatsApp > 100 && (
                    <p className="text-red-500 text-sm">La tasa de conversión debe ser menor o igual a 100%</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="precio-producto-wa" className="text-white/80">
                    Precio del Producto (S/)
                  </Label>
                  <Input
                    id="precio-producto-wa"
                    type="number"
                    value={inputValues.precioProducto}
                    onChange={(e) => handleInputChange('precioProducto', e.target.value, 'shared')}
                    className="bg-primary-dark/50 border-primary-light/30 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="costo-producto-wa" className="text-white/80">
                    Costo del Producto (S/)
                  </Label>
                  <Input
                    id="costo-producto-wa"
                    type="number"
                    value={inputValues.costoProducto}
                    onChange={(e) => handleInputChange('costoProducto', e.target.value, 'shared')}
                    className="bg-primary-dark/50 border-primary-light/30 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="gasto-operativo-wa" className="text-white/80">
                    Gasto Operativo/Pedido (S/)
                  </Label>
                  <Input
                    id="gasto-operativo-wa"
                    type="number"
                    value={inputValues.gastoOperativo}
                    onChange={(e) => handleInputChange('gastoOperativo', e.target.value, 'shared')}
                    className="bg-primary-dark/50 border-primary-light/30 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="tasa-entrega-wa" className="text-white/80">
                    Tasa de Entrega (%)
                  </Label>
                  <Input
                    id="tasa-entrega-wa"
                    type="number"
                    value={inputValues.tasaEntrega}
                    onChange={(e) => handleInputChange('tasaEntrega', e.target.value, 'whatsapp')}
                    min="0"
                    max="100"
                    className="bg-primary-dark/50 border-primary-light/30 text-white"
                  />
                  {whatsappData.tasaEntrega > 100 && (
                    <p className="text-red-500 text-sm">La tasa de entrega debe ser menor o igual a 100%</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="comision-courier-wa" className="text-white/80">
                    Comisión Courier (S/)
                  </Label>
                  <Input
                    id="comision-courier-wa"
                    type="number"
                    value={inputValues.comisionCourier}
                    onChange={(e) => handleInputChange('comisionCourier', e.target.value, 'shared')}
                    className="bg-primary-dark/50 border-primary-light/30 text-white"
                  />
                </div>
              </div>
              <Button
                onClick={calculateResults}
                className="bg-accent hover:bg-accent/90 text-black w-full sm:w-auto"
              >
                Calcular Rentabilidad
              </Button>
              <Button
                onClick={clearAllData}
                variant="outline"
                className="border-red-500/30 text-red-500 hover:bg-red-500/10 ml-2"
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
        <Card className="bg-primary-medium/20 border-blue-500/30 hover:bg-primary-medium/30 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/60 text-sm">CPA REAL</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {calcResults.cpaReal !== null && !isNaN(calcResults.cpaReal) ? `S/ ${calcResults.cpaReal.toFixed(2)}` : "--"}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary-medium/20 border-green-500/30 hover:bg-primary-medium/30 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/60 text-sm">ROAS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {calcResults.roas !== null && !isNaN(calcResults.roas) ? `${calcResults.roas.toFixed(2)}x` : "--"}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary-medium/20 border-yellow-500/30 hover:bg-primary-medium/30 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/60 text-sm">ROI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {calcResults.roi !== null && !isNaN(calcResults.roi) ? `${calcResults.roi.toFixed(1)}%` : "--"}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary-medium/20 border-purple-500/30 hover:bg-primary-medium/30 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/60 text-sm">MARGEN NETO</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-white">
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
                  {calcResults.roi > 100 ? "🚀 Rentabilidad excelente" :
                    calcResults.roi > 50 ? "👍 Rentabilidad buena" :
                      "⚠️ Rentabilidad baja"}
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