"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"

interface CampaignData {
  id: string
  fecha: string
  plataforma: string
  tipo: string
  inversion: number
  conversiones: number
  ventas: number
}

interface DeliveryData {
  id: string
  fecha: string
  totalPedidos: number
  entregados: number
  rechazados: number
  noUbicados: number
  costoEnvio: number
}

export function CampaignForm({ onAddCampaign }: { onAddCampaign: (data: CampaignData) => void }) {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0],
    plataforma: "",
    tipo: "",
    inversion: "",
    conversiones: "",
    ventas: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.plataforma && formData.tipo && formData.inversion && formData.conversiones) {
      const newCampaign: CampaignData = {
        id: Date.now().toString(),
        fecha: formData.fecha,
        plataforma: formData.plataforma,
        tipo: formData.tipo,
        inversion: Number.parseFloat(formData.inversion),
        conversiones: Number.parseInt(formData.conversiones),
        ventas: Number.parseFloat(formData.ventas) || 0,
      }
      onAddCampaign(newCampaign)
      setFormData({
        fecha: new Date().toISOString().split("T")[0],
        plataforma: "",
        tipo: "",
        inversion: "",
        conversiones: "",
        ventas: "",
      })
    }
  }

  const handleClear = () => {
    setFormData({
      fecha: new Date().toISOString().split("T")[0],
      plataforma: "",
      tipo: "",
      inversion: "",
      conversiones: "",
      ventas: "",
    })
  }

  return (
    <Card className="bg-primary-medium/20 border-primary-light/20 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-white">Registrar Datos de Campaña</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="fecha" className="text-white/80">
                Fecha
              </Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className="bg-primary-dark/50 border-primary-light/30 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="plataforma" className="text-white/80">
                Plataforma
              </Label>
              <Select
                value={formData.plataforma}
                onValueChange={(value) => setFormData({ ...formData, plataforma: value })}
              >
                <SelectTrigger className="bg-primary-dark/50 border-primary-light/30 text-white">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent className="bg-primary-dark border-primary-light/30">
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tipo" className="text-white/80">
                Tipo de Campaña
              </Label>
              <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                <SelectTrigger className="bg-primary-dark/50 border-primary-light/30 text-white">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent className="bg-primary-dark border-primary-light/30">
                  <SelectItem value="Conversion">Conversión</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Trafico">Tráfico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="inversion" className="text-white/80">
                Inversión (S/)
              </Label>
              <Input
                id="inversion"
                type="number"
                step="0.01"
                value={formData.inversion}
                onChange={(e) => setFormData({ ...formData, inversion: e.target.value })}
                className="bg-primary-dark/50 border-primary-light/30 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="conversiones" className="text-white/80">
                Conversiones
              </Label>
              <Input
                id="conversiones"
                type="number"
                value={formData.conversiones}
                onChange={(e) => setFormData({ ...formData, conversiones: e.target.value })}
                className="bg-primary-dark/50 border-primary-light/30 text-white"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="ventas" className="text-white/80">
              Ventas Generadas (S/)
            </Label>
            <Input
              id="ventas"
              type="number"
              step="0.01"
              value={formData.ventas}
              onChange={(e) => setFormData({ ...formData, ventas: e.target.value })}
              className="bg-primary-dark/50 border-primary-light/30 text-white"
            />
          </div>
          <div className="flex space-x-4">
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-black">
              <Plus className="h-4 w-4 mr-2" />
              Guardar Datos
            </Button>
            <Button
              type="button"
              onClick={handleClear}
              variant="outline"
              className="border-accent/30 text-accent hover:bg-accent hover:text-black"
            >
              Limpiar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export function DeliveryForm({ onAddDelivery }: { onAddDelivery: (data: DeliveryData) => void }) {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0],
    totalPedidos: "",
    entregados: "",
    rechazados: "",
    noUbicados: "",
    costoEnvio: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.totalPedidos && formData.entregados) {
      const newDelivery: DeliveryData = {
        id: Date.now().toString(),
        fecha: formData.fecha,
        totalPedidos: Number.parseInt(formData.totalPedidos),
        entregados: Number.parseInt(formData.entregados),
        rechazados: Number.parseInt(formData.rechazados) || 0,
        noUbicados: Number.parseInt(formData.noUbicados) || 0,
        costoEnvio: Number.parseFloat(formData.costoEnvio) || 0,
      }
      onAddDelivery(newDelivery)
      setFormData({
        fecha: new Date().toISOString().split("T")[0],
        totalPedidos: "",
        entregados: "",
        rechazados: "",
        noUbicados: "",
        costoEnvio: "",
      })
    }
  }

  return (
    <Card className="bg-primary-medium/20 border-primary-light/20 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-white">Registrar Datos de Entrega</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="fecha-entrega" className="text-white/80">
                Fecha
              </Label>
              <Input
                id="fecha-entrega"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className="bg-primary-dark/50 border-primary-light/30 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="total-pedidos" className="text-white/80">
                Total de Pedidos
              </Label>
              <Input
                id="total-pedidos"
                type="number"
                value={formData.totalPedidos}
                onChange={(e) => setFormData({ ...formData, totalPedidos: e.target.value })}
                className="bg-primary-dark/50 border-primary-light/30 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="pedidos-entregados" className="text-white/80">
                Pedidos Entregados
              </Label>
              <Input
                id="pedidos-entregados"
                type="number"
                value={formData.entregados}
                onChange={(e) => setFormData({ ...formData, entregados: e.target.value })}
                className="bg-primary-dark/50 border-primary-light/30 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="rechazos" className="text-white/80">
                Rechazos en Puerta
              </Label>
              <Input
                id="rechazos"
                type="number"
                value={formData.rechazados}
                onChange={(e) => setFormData({ ...formData, rechazados: e.target.value })}
                className="bg-primary-dark/50 border-primary-light/30 text-white"
              />
            </div>
            <div>
              <Label htmlFor="no-ubicados" className="text-white/80">
                No Ubicados
              </Label>
              <Input
                id="no-ubicados"
                type="number"
                value={formData.noUbicados}
                onChange={(e) => setFormData({ ...formData, noUbicados: e.target.value })}
                className="bg-primary-dark/50 border-primary-light/30 text-white"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="costo-envio" className="text-white/80">
              Costo de Envío Total (S/)
            </Label>
            <Input
              id="costo-envio"
              type="number"
              step="0.01"
              value={formData.costoEnvio}
              onChange={(e) => setFormData({ ...formData, costoEnvio: e.target.value })}
              className="bg-primary-dark/50 border-primary-light/30 text-white"
            />
          </div>
          <Button type="submit" className="bg-accent hover:bg-accent/90 text-black">
            <Plus className="h-4 w-4 mr-2" />
            Guardar Datos de Entrega
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export function CampaignTable({
  campaigns,
  onDeleteCampaign,
}: { campaigns: CampaignData[]; onDeleteCampaign: (id: string) => void }) {
  return (
    <Card className="bg-primary-medium/20 border-primary-light/20 animate-fade-in">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary-light/20">
                <th className="text-left text-white/60 text-sm font-medium py-4 px-6">FECHA</th>
                <th className="text-left text-white/60 text-sm font-medium py-4 px-6">PLATAFORMA</th>
                <th className="text-left text-white/60 text-sm font-medium py-4 px-6">TIPO</th>
                <th className="text-left text-white/60 text-sm font-medium py-4 px-6">INVERSIÓN</th>
                <th className="text-left text-white/60 text-sm font-medium py-4 px-6">CONVERSIONES</th>
                <th className="text-left text-white/60 text-sm font-medium py-4 px-6">VENTAS</th>
                <th className="text-left text-white/60 text-sm font-medium py-4 px-6">CPA</th>
                <th className="text-left text-white/60 text-sm font-medium py-4 px-6">ROAS</th>
                <th className="text-left text-white/60 text-sm font-medium py-4 px-6">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => {
                const cpa = campaign.inversion / campaign.conversiones
                const roas = campaign.ventas / campaign.inversion
                return (
                  <tr
                    key={campaign.id}
                    className="border-b border-primary-light/10 hover:bg-primary-medium/10 transition-colors"
                  >
                    <td className="text-white py-4 px-6">{campaign.fecha}</td>
                    <td className="text-white py-4 px-6">{campaign.plataforma}</td>
                    <td className="py-4 px-6">
                      <Badge
                        variant="outline"
                        className={
                          campaign.tipo === "WhatsApp"
                            ? "border-green-500/30 text-green-400"
                            : "border-blue-500/30 text-blue-400"
                        }
                      >
                        {campaign.tipo}
                      </Badge>
                    </td>
                    <td className="text-white py-4 px-6">S/ {campaign.inversion.toFixed(2)}</td>
                    <td className="text-white py-4 px-6">{campaign.conversiones}</td>
                    <td className="text-white py-4 px-6">S/ {campaign.ventas.toFixed(2)}</td>
                    <td className="text-white py-4 px-6">S/ {cpa.toFixed(2)}</td>
                    <td className="text-white py-4 px-6">{roas.toFixed(2)}x</td>
                    <td className="py-4 px-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteCampaign(campaign.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
              {campaigns.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center text-white/60 py-12">
                    No hay campañas registradas aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export function DeliveryTable({
  deliveries,
  onDeleteDelivery,
}: { deliveries: DeliveryData[]; onDeleteDelivery: (id: string) => void }) {
  return (
    <Card className="bg-primary-medium/20 border-primary-light/20 animate-fade-in">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary-light/20">
                <th className="text-left text-white/60 text-sm font-medium py-4 px-6">FECHA</th>
                <th className="text-left text-white/60 text-sm font-medium py-4 px-6">TOTAL PEDIDOS</th>
                <th className="text-left text-white/60 text-sm font-medium py-4 px-6">ENTREGADOS</th>
                <th className="text-left text-white/60 text-sm font-medium py-4 px-6">RECHAZADOS</th>
                <th className="text-left text-white/60 text-sm font-medium py-4 px-6">NO UBICADOS</th>
                <th className="text-left text-white/60 text-sm font-medium py-4 px-6">TASA ENTREGA</th>
                <th className="text-left text-white/60 text-sm font-medium py-4 px-6">COSTO ENVÍO</th>
                <th className="text-left text-white/60 text-sm font-medium py-4 px-6">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery) => {
                const tasaEntrega = (delivery.entregados / delivery.totalPedidos) * 100
                return (
                  <tr
                    key={delivery.id}
                    className="border-b border-primary-light/10 hover:bg-primary-medium/10 transition-colors"
                  >
                    <td className="text-white py-4 px-6">{delivery.fecha}</td>
                    <td className="text-white py-4 px-6">{delivery.totalPedidos}</td>
                    <td className="text-white py-4 px-6">{delivery.entregados}</td>
                    <td className="text-white py-4 px-6">{delivery.rechazados}</td>
                    <td className="text-white py-4 px-6">{delivery.noUbicados}</td>
                    <td className="text-white py-4 px-6">{tasaEntrega.toFixed(1)}%</td>
                    <td className="text-white py-4 px-6">S/ {delivery.costoEnvio.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteDelivery(delivery.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
              {deliveries.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-white/60 py-12">
                    No hay datos de entregas registrados aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
