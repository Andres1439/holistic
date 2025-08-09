"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Menu, ChevronDown } from "lucide-react"

export default function Navbar() {
  const [isToolsOpen, setIsToolsOpen] = useState(false)

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center group">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <ShoppingCart className="h-5 w-5 text-blue-700" />
              </div>
            </div>
            <div className="ml-3">
              <Link href="/">
                <span className="text-xl font-bold text-blue-700 transition-colors duration-300 group-hover:text-blue-500">
                  HOLISTIC
                </span>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4 lg:space-x-8">
              <Link
                href="/"
                className="text-blue-700 hover:text-blue-500 transition-all duration-300 px-2 lg:px-3 py-2 text-sm font-medium relative group"
              >
                Inicio
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/#servicios"
                className="text-gray-700 hover:text-blue-500 transition-all duration-300 px-2 lg:px-3 py-2 text-sm font-medium relative group"
              >
                Servicios
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              
                             {/* Herramientas con desplegable */}
               <div className="relative group">
                 <button
                   className="text-gray-700 hover:text-blue-500 transition-all duration-300 px-2 lg:px-3 py-2 text-sm font-medium relative flex items-center gap-1"
                   onMouseEnter={() => setIsToolsOpen(true)}
                   onMouseLeave={() => setIsToolsOpen(false)}
                 >
                   Herramientas
                   <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                   <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                 </button>
                 
                 {/* Dropdown Menu */}
                 <div
                   className={`absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 transition-all duration-200 ${
                     isToolsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                   }`}
                   onMouseEnter={() => setIsToolsOpen(true)}
                   onMouseLeave={() => setIsToolsOpen(false)}
                 >
                   <div className="py-1">
                     <Link
                       href="/herramientas"
                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                     >
                       Dashboard
                     </Link>
                     <Link
                       href="/herramientas/pre-landing"
                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                     >
                       Pre-Landing
                     </Link>
                     <Link
                       href="/herramientas/competidores"
                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                     >
                       Competidores
                     </Link>
                   </div>
                 </div>
               </div>

              <Link
                href="/#nosotros"
                className="text-gray-700 hover:text-blue-500 transition-all duration-300 px-2 lg:px-3 py-2 text-sm font-medium relative group"
              >
                Nosotros
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/#contacto"
                className="text-gray-700 hover:text-blue-500 transition-all duration-300 px-2 lg:px-3 py-2 text-sm font-medium relative group"
              >
                Contacto
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-dark hover:bg-primary-medium/20 transition-colors duration-300"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white border-gray-200">
                <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                <div className="flex flex-col space-y-4 mt-8">
                  <Link
                    href="/"
                    className="text-blue-700 hover:text-blue-500 transition-colors duration-300 text-lg font-medium"
                  >
                    Inicio
                  </Link>
                  <Link
                    href="/#servicios"
                    className="text-gray-700 hover:text-blue-500 transition-colors duration-300 text-lg font-medium"
                  >
                    Servicios
                  </Link>
                  
                                     {/* Mobile Herramientas con Select */}
                   <div className="space-y-2">
                     <div className="text-gray-700 text-lg font-medium">Herramientas</div>
                     <Select>
                       <SelectTrigger className="w-full">
                         <SelectValue placeholder="Seleccionar herramienta" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="dashboard">
                           <Link href="/herramientas" className="block w-full">
                             Dashboard
                           </Link>
                         </SelectItem>
                         <SelectItem value="pre-landing">
                           <Link href="/herramientas/pre-landing" className="block w-full">
                             Pre-Landing
                           </Link>
                         </SelectItem>
                         <SelectItem value="competidores">
                           <Link href="/herramientas/competidores" className="block w-full">
                             Competidores
                           </Link>
                         </SelectItem>
                       </SelectContent>
                     </Select>
                   </div>

                  <Link
                    href="/#nosotros"
                    className="text-gray-700 hover:text-blue-500 transition-colors duration-300 text-lg font-medium"
                  >
                    Nosotros
                  </Link>
                  <Link
                    href="/#contacto"
                    className="text-gray-700 hover:text-blue-500 transition-colors duration-300 text-lg font-medium"
                  >
                    Contacto
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
} 