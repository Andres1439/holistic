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
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-2">Historial de Datos</h1>
          <p className="text-primary-medium">Revisa todos los registros ingresados</p>
        </div>
        <Button
          onClick={clearHistory}
          variant="outline"
          className="border-accent/30 text-accent hover:bg-accent hover:text-primary-dark mt-4 sm:mt-0"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Limpiar Historial
        </Button>
      </div>
      <Tabs defaultValue="campanas" className="w-full animate-fade-in">
        <TabsList className="grid w-full grid-cols-2 bg-primary-light/30">
          <TabsTrigger
            value="campanas"
            className="data-[state=active]:bg-accent data-[state=active]:text-white"
          >
            Campañas
          </TabsTrigger>
          <TabsTrigger
            value="entregas-hist"
            className="data-[state=active]:bg-accent data-[state=active]:text-white"
          >
            Entregas
          </TabsTrigger>
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