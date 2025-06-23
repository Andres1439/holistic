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
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">Gestión de Campañas</h1>
        <p className="text-blue-700">Ingresa y monitorea tus campañas publicitarias</p>
      </div>
      <CampaignForm onAddCampaign={campaign => setCampaigns([campaign, ...campaigns])} />
      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
        <Card className="bg-white border border-gray-200 shadow hover:border-blue-400 transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <CardTitle className="text-blue-900">FACEBOOK ADS</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 mb-2">
              S/ {campaigns.filter((c) => c.plataforma === "Facebook").reduce((sum, c) => sum + c.inversion, 0).toFixed(2)}
            </div>
            <div className="text-blue-700 text-sm">
              Campañas activas: {campaigns.filter((c) => c.plataforma === "Facebook").length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200 shadow hover:border-red-400 transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <CardTitle className="text-blue-900">GOOGLE ADS</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 mb-2">
              S/ {campaigns.filter((c) => c.plataforma === "Google").reduce((sum, c) => sum + c.inversion, 0).toFixed(2)}
            </div>
            <div className="text-blue-700 text-sm">
              Campañas activas: {campaigns.filter((c) => c.plataforma === "Google").length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200 shadow hover:border-pink-400 transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <CardTitle className="text-blue-900">TIKTOK ADS</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 mb-2">
              S/ {campaigns.filter((c) => c.plataforma === "TikTok").reduce((sum, c) => sum + c.inversion, 0).toFixed(2)}
            </div>
            <div className="text-blue-700 text-sm">
              Campañas activas: {campaigns.filter((c) => c.plataforma === "TikTok").length}
            </div>
          </CardContent>
        </Card>
      </div>
      {campaigns.length > 0 && <CampaignTable campaigns={campaigns} onDeleteCampaign={deleteCampaign} />}
    </div>
  );
} 