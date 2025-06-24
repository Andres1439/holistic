import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, History, Target, Truck, AlertTriangle } from "lucide-react";
import { CampaignTable, DeliveryTable } from "./functional-forms";
import { CampaignData } from "./CampaignsSection";
import { DeliveryData } from "./DeliveriesSection";

interface Props {
  campaigns: CampaignData[];
  deliveries: DeliveryData[];
  deleteCampaign: (id: string) => void;
  deleteDelivery: (id: string) => void;
  clearHistory: () => void;
}

export default function HistorySection({ campaigns, deliveries, deleteCampaign, deleteDelivery, clearHistory }: Props) {
  // Calcular métricas del historial
  const totalCampaigns = campaigns.length;
  const totalDeliveries = deliveries.length;
  const totalInversion = campaigns.reduce((sum, c) => sum + c.inversion, 0);
  const totalEntregados = deliveries.reduce((sum, d) => sum + d.entregados, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Historial de Datos</h1>
          <p className="text-gray-600">Revisa todos los registros ingresados</p>
        </div>
        <Button
          onClick={clearHistory}
          variant="outline"
          className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-900 mt-4 sm:mt-0 font-medium transition-all duration-300"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Limpiar Historial
        </Button>
      </div>

      {/* Métricas del historial */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
          <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <CardDescription className="text-blue-700 text-sm font-semibold">TOTAL CAMPAÑAS</CardDescription>
              <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{totalCampaigns}</div>
            <div className="text-blue-600 text-sm font-medium">Campañas registradas</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
          <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <CardDescription className="text-green-700 text-sm font-semibold">TOTAL ENTREGAS</CardDescription>
              <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Truck className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{totalDeliveries}</div>
            <div className="text-green-600 text-sm font-medium">Entregas registradas</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
          <CardHeader className="pb-3 bg-gradient-to-r from-violet-50 to-violet-100">
            <div className="flex items-center justify-between">
              <CardDescription className="text-violet-700 text-sm font-semibold">INVERSIÓN TOTAL</CardDescription>
              <div className="h-10 w-10 bg-violet-500 rounded-lg flex items-center justify-center">
                <History className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">S/ {totalInversion.toFixed(2)}</div>
            <div className="text-violet-600 text-sm font-medium">Inversión acumulada</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
          <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-purple-100">
            <div className="flex items-center justify-between">
              <CardDescription className="text-purple-700 text-sm font-semibold">ENTREGAS EXITOSAS</CardDescription>
              <div className="h-10 w-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Truck className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{totalEntregados}</div>
            <div className="text-purple-600 text-sm font-medium">Entregas completadas</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de historial */}
      <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
          <CardTitle className="text-gray-900 font-semibold">Registros Detallados</CardTitle>
          <CardDescription className="text-gray-600">Explora el historial completo de campañas y entregas</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="campanas" className="w-full animate-fade-in">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="campanas" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 rounded-md transition-all duration-300 font-medium"
              >
                <Target className="h-4 w-4 mr-2" />
                Campañas
              </TabsTrigger>
              <TabsTrigger 
                value="entregas-hist" 
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 rounded-md transition-all duration-300 font-medium"
              >
                <Truck className="h-4 w-4 mr-2" />
                Entregas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="campanas" className="mt-6">
              {campaigns.length > 0 ? (
                <CampaignTable campaigns={campaigns} onDeleteCampaign={deleteCampaign} />
              ) : (
                <Card className="bg-gray-50 border-gray-200 rounded-xl">
                  <CardContent className="p-8 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="h-12 w-12 bg-gray-300 rounded-lg flex items-center justify-center">
                        <Target className="h-6 w-6 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="text-gray-700 font-semibold text-lg">No hay campañas registradas</h3>
                        <p className="text-gray-500">Agrega tu primera campaña para ver el historial aquí</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="entregas-hist" className="mt-6">
              {deliveries.length > 0 ? (
                <DeliveryTable deliveries={deliveries} onDeleteDelivery={deleteDelivery} />
              ) : (
                <Card className="bg-gray-50 border-gray-200 rounded-xl">
                  <CardContent className="p-8 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="h-12 w-12 bg-gray-300 rounded-lg flex items-center justify-center">
                        <Truck className="h-6 w-6 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="text-gray-700 font-semibold text-lg">No hay entregas registradas</h3>
                        <p className="text-gray-500">Agrega tu primera entrega para ver el historial aquí</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Advertencia de limpieza */}
      {(campaigns.length > 0 || deliveries.length > 0) && (
        <Card className="bg-orange-50 border-orange-200 rounded-xl">
          <CardContent className="p-4 flex items-center text-orange-700">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span className="font-medium">
              Al limpiar el historial se eliminarán permanentemente todos los registros. Esta acción no se puede deshacer.
            </span>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 