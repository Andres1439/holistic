import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
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
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-2">Control de Entregas</h1>
        <p className="text-primary-medium">Registra y monitorea las entregas COD</p>
      </div>
      <DeliveryForm onAddDelivery={delivery => setDeliveries([delivery, ...deliveries])} />
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
        <Card className="bg-primary-light/20 border-green-500/30 hover:bg-primary-light/30 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardDescription className="text-primary-medium text-sm">TASA DE ENTREGA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-dark mb-1">{avgTasaEntrega.toFixed(1)}%</div>
            <div className="flex items-center text-green-700 text-sm">
              <ArrowUp className="h-4 w-4 mr-1" />
              2.3% vs promedio
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary-light/20 border-yellow-500/30 hover:bg-primary-light/30 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardDescription className="text-primary-medium text-sm">RECHAZOS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-dark mb-1">{avgRechazos.toFixed(1)}%</div>
            <div className="flex items-center text-yellow-700 text-sm">
              <ArrowUp className="h-4 w-4 mr-1" />
              1.1% vs promedio
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary-light/20 border-red-500/30 hover:bg-primary-light/30 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardDescription className="text-primary-medium text-sm">NO UBICADOS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-dark mb-1">{avgNoUbicados.toFixed(1)}%</div>
            <div className="flex items-center text-green-700 text-sm">
              <ArrowDown className="h-4 w-4 mr-1" />
              0.8% vs promedio
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Chart */}
      <Card className="bg-primary-light/20 border-primary-medium/20 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-primary-dark">Evolución de Entregas - Últimos 30 días</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 relative">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <path
                d="M 20 160 L 80 155 L 140 150 L 200 145 L 260 140 L 320 135 L 380 130"
                stroke="#10B981"
                strokeWidth="3"
                fill="none"
                className="drop-shadow-lg"
              />
              <defs>
                <linearGradient id="deliveryGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path
                d="M 20 160 L 80 155 L 140 150 L 200 145 L 260 140 L 320 135 L 380 130 L 380 200 L 20 200 Z"
                fill="url(#deliveryGradient)"
              />
            </svg>
            <div className="absolute bottom-4 left-4 text-primary-medium text-sm">17 nov</div>
            <div className="absolute bottom-4 right-4 text-primary-medium text-sm">19 nov</div>
          </div>
        </CardContent>
      </Card>
      {deliveries.length > 0 && <DeliveryTable deliveries={deliveries} onDeleteDelivery={deleteDelivery} />}
    </div>
  );
} 