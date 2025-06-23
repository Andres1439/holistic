import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";
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
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">Historial de Datos</h1>
          <p className="text-blue-700">Revisa todos los registros ingresados</p>
        </div>
        <Button
          onClick={clearHistory}
          variant="outline"
          className="border-blue-300 text-blue-700 hover:bg-blue-100 hover:text-blue-900 mt-4 sm:mt-0"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Limpiar Historial
        </Button>
      </div>
      <Tabs defaultValue="campanas" className="w-full animate-fade-in">
        <TabsList className="grid w-full grid-cols-2 bg-blue-50">
          <TabsTrigger value="campanas" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-blue-900">Campañas</TabsTrigger>
          <TabsTrigger value="entregas-hist" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-blue-900">Entregas</TabsTrigger>
        </TabsList>
        <TabsContent value="campanas" className="mt-6">
          <CampaignTable campaigns={campaigns} onDeleteCampaign={deleteCampaign} />
        </TabsContent>
        <TabsContent value="entregas-hist" className="mt-6">
          <DeliveryTable deliveries={deliveries} onDeleteDelivery={deleteDelivery} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 