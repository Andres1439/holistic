import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { CampaignForm, CampaignTable } from "./functional-forms";

export interface CampaignData {
  id: string;
  fecha: string;
  plataforma: string;
  tipo: string;
  inversion: number;
  conversiones: number;
  ventas: number;
}

export default function CampaignsSection({ campaigns, setCampaigns, deleteCampaign }: {
  campaigns: CampaignData[];
  setCampaigns: (c: CampaignData[]) => void;
  deleteCampaign: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-2">Gestión de Campañas</h1>
        <p className="text-primary-medium">Ingresa y monitorea tus campañas publicitarias</p>
      </div>
      <CampaignForm onAddCampaign={campaign => setCampaigns([campaign, ...campaigns])} />
      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
        <Card className="bg-primary-light/20 border-blue-500/30 hover:bg-primary-light/30 transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <CardTitle className="text-primary-dark">FACEBOOK ADS</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-dark mb-2">
              S/ {campaigns.filter((c) => c.plataforma === "Facebook").reduce((sum, c) => sum + c.inversion, 0).toFixed(2)}
            </div>
            <div className="text-primary-medium text-sm">
              Campañas activas: {campaigns.filter((c) => c.plataforma === "Facebook").length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary-light/20 border-red-500/30 hover:bg-primary-light/30 transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <CardTitle className="text-primary-dark">GOOGLE ADS</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-dark mb-2">
              S/ {campaigns.filter((c) => c.plataforma === "Google").reduce((sum, c) => sum + c.inversion, 0).toFixed(2)}
            </div>
            <div className="text-primary-medium text-sm">
              Campañas activas: {campaigns.filter((c) => c.plataforma === "Google").length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary-light/20 border-pink-500/30 hover:bg-primary-light/30 transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <CardTitle className="text-primary-dark">TIKTOK ADS</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-dark mb-2">
              S/ {campaigns.filter((c) => c.plataforma === "TikTok").reduce((sum, c) => sum + c.inversion, 0).toFixed(2)}
            </div>
            <div className="text-primary-medium text-sm">
              Campañas activas: {campaigns.filter((c) => c.plataforma === "TikTok").length}
            </div>
          </CardContent>
        </Card>
      </div>
      {campaigns.length > 0 && <CampaignTable campaigns={campaigns} onDeleteCampaign={deleteCampaign} />}
    </div>
  );
} 