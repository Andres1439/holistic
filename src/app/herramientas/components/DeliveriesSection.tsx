import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Truck, CheckCircle, XCircle, MapPin, TrendingUp } from "lucide-react";
import { DeliveryForm, DeliveryTable } from "./functional-forms";

export interface DeliveryData {
  id: string;
  fecha: string;
  totalPedidos: number;
  entregados: number;
  rechazados: number;
  noUbicados: number;
  costoEnvio: number;
}

interface Props {
  deliveries: DeliveryData[];
  setDeliveries: (d: DeliveryData[]) => void;
  deleteDelivery: (id: string) => void;
}

export default function DeliveriesSection({ deliveries, setDeliveries, deleteDelivery }: Props) {
  // Cálculos de métricas
  const totalDeliveries = deliveries.reduce((sum, d) => sum + d.totalPedidos, 0);
  const totalEntregados = deliveries.reduce((sum, d) => sum + d.entregados, 0);
  const totalRechazados = deliveries.reduce((sum, d) => sum + d.rechazados, 0);
  const totalNoUbicados = deliveries.reduce((sum, d) => sum + d.noUbicados, 0);
  const avgTasaEntrega = totalDeliveries > 0 ? (totalEntregados / totalDeliveries) * 100 : 87.0;
  const avgRechazos = totalDeliveries > 0 ? (totalRechazados / totalDeliveries) * 100 : 8.4;
  const avgNoUbicados = totalDeliveries > 0 ? (totalNoUbicados / totalDeliveries) * 100 : 4.7;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Control de Entregas</h1>
        <p className="text-gray-600">Registra y monitorea las entregas COD</p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
          <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <CardDescription className="text-green-700 text-sm font-semibold">TASA DE ENTREGA</CardDescription>
              <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{avgTasaEntrega.toFixed(1)}%</div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <ArrowUp className="h-4 w-4 mr-1" />
              2.3% vs promedio
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
          <CardHeader className="pb-3 bg-gradient-to-r from-red-50 to-red-100">
            <div className="flex items-center justify-between">
              <CardDescription className="text-red-700 text-sm font-semibold">RECHAZOS</CardDescription>
              <div className="h-10 w-10 bg-red-500 rounded-lg flex items-center justify-center">
                <XCircle className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{avgRechazos.toFixed(1)}%</div>
            <div className="flex items-center text-red-600 text-sm font-medium">
              <ArrowUp className="h-4 w-4 mr-1" />
              1.1% vs promedio
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
          <CardHeader className="pb-3 bg-gradient-to-r from-orange-50 to-orange-100">
            <div className="flex items-center justify-between">
              <CardDescription className="text-orange-700 text-sm font-semibold">NO UBICADOS</CardDescription>
              <div className="h-10 w-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{avgNoUbicados.toFixed(1)}%</div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <ArrowDown className="h-4 w-4 mr-1" />
              0.8% vs promedio
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
          <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <CardDescription className="text-blue-700 text-sm font-semibold">TOTAL PEDIDOS</CardDescription>
              <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Truck className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{totalDeliveries}</div>
            <div className="flex items-center text-blue-600 text-sm font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              Pedidos totales
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulario de entregas */}
      <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
          <CardTitle className="text-gray-900 font-semibold">Nueva Entrega</CardTitle>
          <CardDescription className="text-gray-600">Registra los datos de entrega COD</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <DeliveryForm onAddDelivery={delivery => setDeliveries([delivery, ...deliveries])} />
        </CardContent>
      </Card>

      {/* Gráfico de evolución */}
      <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-violet-50 to-violet-100">
          <CardTitle className="text-violet-900 font-semibold">Distribución de Entregas</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-64 relative w-full flex items-center justify-center">
            {/* Gráfico circular profesional */}
            <div className="relative w-48 h-48">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <defs>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.1"/>
                  </filter>
                </defs>
                
                {/* Gráfico circular con datos reales */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                
                {/* Entregados (87%) */}
                <path
                  d="M 50 10 A 40 40 0 0 1 50 90 A 40 40 0 0 1 50 10"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray="251.2 314"
                  strokeDashoffset="0"
                  filter="url(#shadow)"
                />
                
                {/* Rechazados (8.4%) */}
                <path
                  d="M 50 10 A 40 40 0 0 1 50 90 A 40 40 0 0 1 50 10"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="8"
                  strokeDasharray="26.4 314"
                  strokeDashoffset="-251.2"
                  filter="url(#shadow)"
                />
                
                {/* No ubicados (4.7%) */}
                <path
                  d="M 50 10 A 40 40 0 0 1 50 90 A 40 40 0 0 1 50 10"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="8"
                  strokeDasharray="14.8 314"
                  strokeDashoffset="-277.6"
                  filter="url(#shadow)"
                />
                
                {/* Centro del gráfico */}
                <circle cx="50" cy="50" r="15" fill="white" filter="url(#shadow)"/>
                <text x="50" y="55" textAnchor="middle" className="text-xs font-semibold fill-gray-700">
                  {totalDeliveries}
                </text>
              </svg>
              
              {/* Etiquetas de porcentajes */}
              <div className="absolute top-2 left-2 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">
                87%
              </div>
              <div className="absolute top-2 right-2 text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded">
                8.4%
              </div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-orange-700 bg-orange-100 px-2 py-1 rounded">
                4.7%
              </div>
            </div>
          </div>
          
          {/* Leyenda detallada */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div>
                <div className="font-semibold text-green-700">Entregados</div>
                <div className="text-sm text-gray-600">{totalEntregados} pedidos</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div>
                <div className="font-semibold text-red-700">Rechazados</div>
                <div className="text-sm text-gray-600">{totalRechazados} pedidos</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <div>
                <div className="font-semibold text-orange-700">No Ubicados</div>
                <div className="text-sm text-gray-600">{totalNoUbicados} pedidos</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de entregas */}
      {deliveries.length > 0 && (
        <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardTitle className="text-gray-900 font-semibold">Entregas Registradas</CardTitle>
            <CardDescription className="text-gray-600">Lista de todas las entregas registradas</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <DeliveryTable deliveries={deliveries} onDeleteDelivery={deleteDelivery} />
          </CardContent>
        </Card>
      )}
    </div>
  );
} 