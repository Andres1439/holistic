import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Target, TrendingUp, DollarSign, Users } from "lucide-react";
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
  // Calcular métricas
  const totalInversion = campaigns.reduce((sum, c) => sum + c.inversion, 0);
  const totalConversiones = campaigns.reduce((sum, c) => sum + c.conversiones, 0);
  const totalVentas = campaigns.reduce((sum, c) => sum + c.ventas, 0);
  const avgCPA = totalConversiones > 0 ? totalInversion / totalConversiones : 0;
  const avgROAS = totalInversion > 0 ? totalVentas / totalInversion : 0;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Gestión de Campañas</h1>
        <p className="text-gray-600">Ingresa y monitorea tus campañas publicitarias</p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
          <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <CardDescription className="text-blue-700 text-sm font-semibold">INVERSIÓN TOTAL</CardDescription>
              <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">S/ {totalInversion.toFixed(2)}</div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <ArrowUp className="h-4 w-4 mr-1" />
              {campaigns.length} campañas
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
          <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <CardDescription className="text-green-700 text-sm font-semibold">CONVERSIONES</CardDescription>
              <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{totalConversiones}</div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              Total acumulado
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
          <CardHeader className="pb-3 bg-gradient-to-r from-violet-50 to-violet-100">
            <div className="flex items-center justify-between">
              <CardDescription className="text-violet-700 text-sm font-semibold">CPA PROMEDIO</CardDescription>
              <div className="h-10 w-10 bg-violet-500 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">S/ {avgCPA.toFixed(2)}</div>
            <div className="flex items-center text-violet-600 text-sm font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              Promedio general
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
          <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-purple-100">
            <div className="flex items-center justify-between">
              <CardDescription className="text-purple-700 text-sm font-semibold">ROAS GENERAL</CardDescription>
              <div className="h-10 w-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{avgROAS.toFixed(1)}x</div>
            <div className="flex items-center text-purple-600 text-sm font-medium">
              <ArrowUp className="h-4 w-4 mr-1" />
              Retorno promedio
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulario de campañas - MOVIDO ARRIBA */}
      <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
          <CardTitle className="text-gray-900 font-semibold">Nueva Campaña</CardTitle>
          <CardDescription className="text-gray-600">Ingresa los datos de tu campaña publicitaria</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <CampaignForm onAddCampaign={campaign => setCampaigns([campaign, ...campaigns])} />
        </CardContent>
      </Card>

      {/* Gráfico de barras y Platform Cards en columnas con mismo tamaño forzado */}
      <div className="w-full flex flex-col md:flex-row gap-6 min-h-[500px] h-[500px]">
        {/* Gráfico de barras - Comparación por plataforma */}
        <div className="flex-1 h-full min-h-[500px] flex flex-col">
          <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden h-full flex flex-col">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100">
              <CardTitle className="text-indigo-900 font-semibold">Inversión por Plataforma</CardTitle>
              <CardDescription className="text-indigo-700">Comparación de inversión publicitaria por plataforma</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col justify-between h-full">
              <div className="flex-1 h-full flex items-end justify-around gap-6 w-full">
                {/* Gráfico de barras profesional */}
                <div className="flex flex-col items-center flex-1">
                  <div className="relative w-full mb-4">
                    <div className="w-full h-24 bg-gradient-to-t from-blue-400 to-blue-500 rounded-t-lg shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-600 to-blue-400 opacity-20"></div>
                      <div className="absolute top-2 right-2 text-xs font-semibold text-white bg-blue-600 px-2 py-1 rounded">
                        S/ {campaigns.filter((c) => c.plataforma === "Facebook").reduce((sum, c) => sum + c.inversion, 0).toFixed(0)}
                      </div>
                    </div>
                  </div>
                  <span className="text-blue-700 text-sm font-medium">Facebook</span>
                  <span className="text-xs text-gray-500 mt-1">
                    {campaigns.filter((c) => c.plataforma === "Facebook").length} campañas
                  </span>
                </div>

                <div className="flex flex-col items-center flex-1">
                  <div className="relative w-full mb-4">
                    <div className="w-full h-32 bg-gradient-to-t from-green-400 to-green-500 rounded-t-lg shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-green-600 to-green-400 opacity-20"></div>
                      <div className="absolute top-2 right-2 text-xs font-semibold text-white bg-green-600 px-2 py-1 rounded">
                        S/ {campaigns.filter((c) => c.plataforma === "Google").reduce((sum, c) => sum + c.inversion, 0).toFixed(0)}
                      </div>
                    </div>
                  </div>
                  <span className="text-green-700 text-sm font-medium">Google</span>
                  <span className="text-xs text-gray-500 mt-1">
                    {campaigns.filter((c) => c.plataforma === "Google").length} campañas
                  </span>
                </div>

                <div className="flex flex-col items-center flex-1">
                  <div className="relative w-full mb-4">
                    <div className="w-full h-16 bg-gradient-to-t from-violet-400 to-violet-500 rounded-t-lg shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-violet-600 to-violet-400 opacity-20"></div>
                      <div className="absolute top-2 right-2 text-xs font-semibold text-white bg-violet-600 px-2 py-1 rounded">
                        S/ {campaigns.filter((c) => c.plataforma === "TikTok").reduce((sum, c) => sum + c.inversion, 0).toFixed(0)}
                      </div>
                    </div>
                  </div>
                  <span className="text-violet-700 text-sm font-medium">TikTok</span>
                  <span className="text-xs text-gray-500 mt-1">
                    {campaigns.filter((c) => c.plataforma === "TikTok").length} campañas
                  </span>
                </div>
              </div>

              {/* Eje Y simulado */}
              <div className="flex justify-between text-xs text-gray-500 px-4 border-t border-gray-200 pt-2">
                <span>S/ 0</span>
                <span>S/ {Math.max(...[
                  campaigns.filter((c) => c.plataforma === "Facebook").reduce((sum, c) => sum + c.inversion, 0),
                  campaigns.filter((c) => c.plataforma === "Google").reduce((sum, c) => sum + c.inversion, 0),
                  campaigns.filter((c) => c.plataforma === "TikTok").reduce((sum, c) => sum + c.inversion, 0)
                ]).toFixed(0)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Platform Cards en columna, mismo alto forzado */}
        <div className="flex-1 h-full min-h-[500px] flex flex-col gap-4">
          <div className="h-full flex flex-col gap-4 flex-1">
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden flex-1 flex flex-col min-h-0">
              <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">F</span>
                  </div>
                  <div>
                    <CardTitle className="text-blue-900 font-semibold">FACEBOOK ADS</CardTitle>
                    <CardDescription className="text-blue-700">Campañas de Facebook</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2 flex-1 flex flex-col justify-between min-h-0">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  S/ {campaigns.filter((c) => c.plataforma === "Facebook").reduce((sum, c) => sum + c.inversion, 0).toFixed(2)}
                </div>
                <div className="text-blue-700 text-sm font-medium">
                  Campañas activas: {campaigns.filter((c) => c.plataforma === "Facebook").length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden flex-1 flex flex-col min-h-0">
              <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-green-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">G</span>
                  </div>
                  <div>
                    <CardTitle className="text-green-900 font-semibold">GOOGLE ADS</CardTitle>
                    <CardDescription className="text-green-700">Campañas de Google</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2 flex-1 flex flex-col justify-between min-h-0">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  S/ {campaigns.filter((c) => c.plataforma === "Google").reduce((sum, c) => sum + c.inversion, 0).toFixed(2)}
                </div>
                <div className="text-green-700 text-sm font-medium">
                  Campañas activas: {campaigns.filter((c) => c.plataforma === "Google").length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden flex-1 flex flex-col min-h-0">
              <CardHeader className="pb-2 bg-gradient-to-r from-violet-50 to-violet-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">T</span>
                  </div>
                  <div>
                    <CardTitle className="text-violet-900 font-semibold">TIKTOK ADS</CardTitle>
                    <CardDescription className="text-violet-700">Campañas de TikTok</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2 flex-1 flex flex-col justify-between min-h-0">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  S/ {campaigns.filter((c) => c.plataforma === "TikTok").reduce((sum, c) => sum + c.inversion, 0).toFixed(2)}
                </div>
                <div className="text-violet-700 text-sm font-medium">
                  Campañas activas: {campaigns.filter((c) => c.plataforma === "TikTok").length}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tabla de campañas */}
      {campaigns.length > 0 && (
        <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardTitle className="text-gray-900 font-semibold">Campañas Registradas</CardTitle>
            <CardDescription className="text-gray-600">Lista de todas las campañas activas</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <CampaignTable campaigns={campaigns} onDeleteCampaign={deleteCampaign} />
          </CardContent>
        </Card>
      )}
    </div>
  );
} 