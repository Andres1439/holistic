import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ShoppingCart, Users, Menu, BarChart3, Zap, Shield, Calculator, Pause } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"
import Navbar from "@/components/Navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section - Meta Style */}
      <section className="relative overflow-hidden bg-white min-h-[90vh] flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 animate-fade-in-left-to-right">
          <div className="text-center">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-6 sm:mb-8 transition-all duration-300 hover:scale-105 hover:bg-blue-200">
              🚀 Plataforma Todo-en-Uno
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-blue-900 mb-6 transition-all duration-700 hover:scale-105 leading-tight">
              {(() => {
                const first = "Creamos el futuro del ";
                const second = "comercio digital";
                return (
                  <>
                    {first.replace('del', '').split("").map((char, i) => (
                      <span
                        key={"first-" + i}
                        className="inline-block animate-fade-in-opacity"
                        style={{ animationDelay: `${i * 0.04}s`, minWidth: "0.05em" }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </span>
                    ))}
                    <span
                      className="inline-block animate-fade-in-opacity whitespace-nowrap"
                      style={{ animationDelay: `${first.length * 0.04}s`, minWidth: "0.05em" }}
                    >
                      del
                    </span>
                    <br />
                    <span className="block mt-2">
                      {second.split("").map((char, i) => (
                        <span
                          key={"second-" + i}
                          className="inline-block animate-fade-in-opacity text-blue-900"
                          style={{ animationDelay: `${(i + first.length) * 0.04}s`, minWidth: "0.05em" }}
                        >
                          {char === " " ? "\u00A0" : char}
                        </span>
                      ))}
                    </span>
                  </>
                );
              })()}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed transition-opacity duration-500 px-4">
              Conectamos marcas con clientes a través de tecnología inteligente, automatización avanzada y experiencias
              excepcionales que transforman negocios.
            </p>

            <div className="pt-4">
              <Link href="/herramientas">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base sm:text-lg px-8 sm:px-12 py-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-200 rounded-full"
                >
                  Nuestra Plataforma
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section - Meta Style */}
      <section className="py-16 sm:py-24 bg-white animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-6 transition-all duration-500 hover:text-accent">
              Mantente al día con las últimas innovaciones
            </h2>
            <Link href="#blog">
              <Button
                variant="outline"
                className="border-accent/30 text-accent hover:bg-accent hover:text-black rounded-full px-8 py-3"
              >
                Ver más en Blog
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {/* Card 1 */}
            <Card className="bg-white border border-gray-200 shadow hover:border-blue-400 transition-all duration-500 hover:scale-105 group overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-accent/20 to-primary-light/20 flex items-center justify-center">
                <Shield className="h-16 w-16 text-accent" />
              </div>
              <CardHeader className="p-6">
                <CardTitle className="text-blue-900 group-hover:text-blue-500 transition-colors duration-300 text-xl">
                  Nuevas medidas de seguridad para ecommerce
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Implementamos protocolos avanzados de seguridad para proteger las transacciones de tus clientes.
                </CardDescription>
                <Link href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mt-4">
                  Leer más <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </CardHeader>
            </Card>

            {/* Card 2 */}
            <Card className="bg-white border border-gray-200 shadow hover:border-blue-400 transition-all duration-500 hover:scale-105 group overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <Zap className="h-16 w-16 text-blue-400" />
              </div>
              <CardHeader className="p-6">
                <CardTitle className="text-blue-900 group-hover:text-blue-500 transition-colors duration-300 text-xl">
                  IA generativa para contenido automático
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Crea contenido para redes sociales y marketing con nuestra nueva herramienta de IA generativa.
                </CardDescription>
                <Link href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mt-4">
                  Leer más <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </CardHeader>
            </Card>

            {/* Card 3 */}
            <Card className="bg-white border border-gray-200 shadow hover:border-blue-400 transition-all duration-500 hover:scale-105 group overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-green-500/20 to-teal-500/20 flex items-center justify-center">
                <BarChart3 className="h-16 w-16 text-green-400" />
              </div>
              <CardHeader className="p-6">
                <CardTitle className="text-blue-900 group-hover:text-blue-500 transition-colors duration-300 text-xl">
                  Analytics predictivo con machine learning
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Predice tendencias de ventas y comportamiento de clientes con nuestros algoritmos avanzados.
                </CardDescription>
                <Link href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mt-4">
                  Leer más <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Tools Section - Meta Product Style */}
      <section id="servicios" className="py-16 sm:py-24 bg-white animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-6 transition-all duration-500 hover:text-blue-500">
              Accede a las herramientas más avanzadas y potencia tu negocio
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Card - Dashboard */}
            <Card className="bg-white border border-gray-200 shadow hover:border-blue-400 transition-all duration-500 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary-medium/30 to-primary-light/30 border-accent/20 backdrop-blur-sm hover:scale-105 transition-all duration-500">
                <div className="absolute inset-0 bg-primary-dark/20 rounded-lg flex items-center justify-center">
                  <img src="/img2.jpg" alt="Dashboard" className="w-full h-56 sm:h-72 md:h-80 lg:h-96 object-cover rounded-t-2xl shadow-2xl" />
                </div>
              </div>
              <CardHeader className="p-8">
                <CardTitle className="text-2xl mb-4 text-blue-900">Dashboard Completo</CardTitle>
                <CardDescription className="text-gray-600 text-lg mb-6">
                  Visualiza todas tus métricas importantes: inversión, conversiones, CPA y ROAS en tiempo real con
                  gráficos interactivos y análisis predictivo.
                </CardDescription>
                <Link href="/herramientas">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full">
                    Explorar Dashboard
                  </Button>
                </Link>
              </CardHeader>
            </Card>

            {/* Right Card - Calculator */}
            <Card className="bg-white border border-gray-200 shadow hover:border-blue-400 transition-all duration-500 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary-medium/30 to-primary-light/30 border-accent/20 backdrop-blur-sm hover:scale-105 transition-all duration-500">
                <div className="absolute inset-0 bg-primary-dark/20 rounded-lg flex items-center justify-center">
                  <img src="/img3.jpg" alt="Calculadora" className="w-full h-56 sm:h-72 md:h-80 lg:h-96 object-cover rounded-t-2xl shadow-2xl" />
                </div>
              </div>
              <CardHeader className="p-8">
                <CardTitle className="text-2xl mb-4 text-blue-900">Calculadora de Rentabilidad</CardTitle>
                <CardDescription className="text-gray-600 text-lg mb-6">
                  Calcula automáticamente CPA real, ROAS, ROI y margen neto de tus campañas para optimizar tu inversión
                  publicitaria con precisión.
                </CardDescription>
                <Link href="/herramientas">
                  <Button
                    variant="outline"
                    className="border-blue-300 text-blue-700 bg-white hover:bg-blue-100 hover:text-blue-900 rounded-full"
                  >
                    Usar Calculadora
                  </Button>
                </Link>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section - Meta Values Style */}
      <section id="nosotros" className="py-16 sm:py-24 bg-white animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-6 transition-all duration-500 hover:text-blue-500">
                Mantente al día sobre nuestras acciones
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Nos comprometemos a impulsar el crecimiento de empresarios digitales y generar un impacto positivo en el
                ecosistema del ecommerce.
              </p>
              <Link href="#nosotros">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full">
                  Más información
                </Button>
              </Link>
            </div>

            {/* Right Content - Values */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4 group">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                  <Shield className="h-8 w-8 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2 group-hover:text-blue-500 transition-colors duration-300">
                    Seguridad y confianza digital
                  </h3>
                  <p className="text-gray-600">
                    Protegemos tu negocio y el de tus clientes con los más altos estándares de seguridad y privacidad de
                    datos.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                  <Users className="h-8 w-8 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2 group-hover:text-blue-500 transition-colors duration-300">
                    Datos y privacidad
                  </h3>
                  <p className="text-gray-600">
                    Te damos control total sobre tu información y la de tus clientes, protegiendo la privacidad en cada
                    interacción.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                  <Zap className="h-8 w-8 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2 group-hover:text-blue-500 transition-colors duration-300">
                    Innovación responsable
                  </h3>
                  <p className="text-gray-600">
                    Desarrollamos tecnología pensando en el futuro, priorizando el crecimiento sostenible y ético de los
                    negocios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section - Meta Leadership Style */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Image */}
            <div className="relative">
              <div className="aspect-square bg-blue-50 rounded-2xl flex items-center justify-center">
                <img src="/img1.jpg" alt="Equipo" className="w-full h-72 sm:h-96 md:h-[32rem] lg:h-[38rem] object-cover rounded-3xl" />
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-6 transition-all duration-500 hover:text-blue-500">
                Conoce a nuestro equipo
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                El equipo de liderazgo de Holistic guía la empresa a medida que evolucionamos la tecnología de ecommerce
                y la inteligencia artificial para crear la próxima evolución del comercio digital.
              </p>
              <Link href="#equipo">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full">
                  Conoce a nuestro equipo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-6 transition-all duration-500 hover:text-blue-500">
            ¿Listo para transformar tu negocio digital?
          </h2>
          <p className="text-lg sm:text-xl text-blue-700 mb-8 px-4 leading-relaxed">
            Únete a miles de empresarios que ya están maximizando sus resultados con la plataforma más avanzada del
            mercado.
          </p>
          <Link href="/herramientas">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base sm:text-lg px-8 sm:px-12 py-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-200 rounded-full"
            >
              Comenzar Ahora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 sm:col-span-2 md:col-span-2">
              <div className="flex items-center mb-4 group">
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <ShoppingCart className="h-5 w-5 text-blue-700" />
                </div>
                <span className="ml-3 text-xl font-bold text-blue-700 group-hover:text-blue-500 transition-colors duration-300">
                  Holistic
                </span>
              </div>
              <p className="text-gray-600 max-w-md mb-4 text-sm sm:text-base">
                La plataforma integral para ecommerce y social media que impulsa tu negocio digital.
              </p>
              <div className="text-blue-700 space-y-1 text-sm sm:text-base">
                <p>📧 victor.minas@unmsm.edu.pe</p>
                <p>📞 51 982 295 611</p>
                <p>📍 Gaviotas 122 - Surquillo</p>
              </div>
            </div>
            <div>
              <h3 className="text-blue-900 font-semibold mb-4 text-base sm:text-lg">Servicios</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-blue-700 hover:text-blue-900 transition-colors duration-300 text-sm sm:text-base"
                  >
                    Tienda Online
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-blue-700 hover:text-blue-900 transition-colors duration-300 text-sm sm:text-base"
                  >
                    Social Media
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-blue-700 hover:text-blue-900 transition-colors duration-300 text-sm sm:text-base"
                  >
                    Marketing Automation
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-blue-700 hover:text-blue-900 transition-colors duration-300 text-sm sm:text-base"
                  >
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-blue-900 font-semibold mb-4 text-base sm:text-lg">Empresa</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-blue-700 hover:text-blue-900 transition-colors duration-300 text-sm sm:text-base"
                  >
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-blue-700 hover:text-blue-900 transition-colors duration-300 text-sm sm:text-base"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-blue-700 hover:text-blue-900 transition-colors duration-300 text-sm sm:text-base"
                  >
                    Carreras
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-blue-700 hover:text-blue-900 transition-colors duration-300 text-sm sm:text-base"
                  >
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-blue-700 text-sm sm:text-base">© 2024 Holistic. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
