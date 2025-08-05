// app/api/scrape-product/route.js
// 🚀 API ROUTE PARA NEXT.JS 15 + APP ROUTER
// Actualizado: 04/08/2025

export async function POST(request) {
  let url = 'No URL provided'
  
  try {
    // Obtener datos del request
    const body = await request.json()
    url = body.url

    console.log(`🔍 [${new Date().toISOString()}] Iniciando scraping para: ${url}`)

    if (!url) {
      console.log(`❌ [${new Date().toISOString()}] Error: URL requerida`)
      return Response.json(
        { error: 'URL requerida' },
        { status: 400 }
      )
    }

    // Validar formato de URL
    try {
      new URL(url)
    } catch (error) {
      console.log(`❌ [${new Date().toISOString()}] Error: URL inválida - ${url}`)
      return Response.json(
        { error: 'URL inválida' },
        { status: 400 }
      )
    }

    // 🔑 API Key segura (SIN NEXT_PUBLIC_)
    const SCRAPERAPI_KEY = process.env.SCRAPERAPI_KEY

    if (!SCRAPERAPI_KEY) {
      console.log(`❌ [${new Date().toISOString()}] Error: ScraperAPI key no configurada`)
      return Response.json(
        { error: 'ScraperAPI key no configurada en variables de entorno' },
        { status: 500 }
      )
    }

    console.log(`✅ [${new Date().toISOString()}] ScraperAPI key encontrada: ${SCRAPERAPI_KEY.substring(0, 10)}...`)

    // 🌐 Configurar parámetros de ScraperAPI (documentación actualizada)
    const params = new URLSearchParams({
      api_key: SCRAPERAPI_KEY,
      url: url,
      render: 'true',           // JavaScript rendering
      country_code: 'us',       // Proxy desde US
      premium: 'true',          // Proxies premium
      session_number: Math.floor(Math.random() * 1000).toString(),
      timeout: '60000',         // 60 segundos
      retry: '3',               // Reintentos
      keep_headers: 'true',     // Mantener headers
      device_type: 'desktop'    // Tipo de dispositivo
    })

    console.log(`🔧 [${new Date().toISOString()}] Parámetros configurados:`, {
      url: url,
      render: 'true',
      country_code: 'us',
      premium: 'true',
      timeout: '60000',
      retry: '3'
    })

    // 🚀 Request a ScraperAPI (endpoint correcto según documentación)
    const scraperUrl = `http://api.scraperapi.com`
    console.log(`🌐 [${new Date().toISOString()}] Haciendo request a: ${scraperUrl}`)

    const scraperResponse = await fetch(`${scraperUrl}?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    })

    console.log(`📊 [${new Date().toISOString()}] Respuesta recibida:`, {
      status: scraperResponse.status,
      statusText: scraperResponse.statusText,
      headers: Object.fromEntries(scraperResponse.headers.entries())
    })

    // Verificar respuesta
    if (!scraperResponse.ok) {
      const errorText = await scraperResponse.text()
      console.log(`❌ [${new Date().toISOString()}] Error de ScraperAPI:`, {
        status: scraperResponse.status,
        errorText: errorText.substring(0, 500)
      })
      
      // Manejar errores específicos de ScraperAPI
      let errorMessage = `Error de ScraperAPI: ${scraperResponse.status}`
      
      if (scraperResponse.status === 404) {
        errorMessage = 'URL no encontrada (404): La página no existe o no es accesible'
      } else if (scraperResponse.status === 403) {
        errorMessage = 'Acceso denegado (403): El sitio web bloquea el scraping'
      } else if (scraperResponse.status === 429) {
        errorMessage = 'Límite de requests alcanzado (429): Intenta más tarde'
      } else if (scraperResponse.status === 500) {
        errorMessage = 'Error interno de ScraperAPI (500): Problema con el servicio'
      } else if (scraperResponse.status === 401) {
        errorMessage = 'API key inválida (401): Verifica tu ScraperAPI key'
      }
      
      throw new Error(errorMessage)
    }

    const html = await scraperResponse.text()
    console.log(`📄 [${new Date().toISOString()}] HTML recibido: ${html.length} caracteres`)

    // Verificar que el HTML no esté vacío o contenga errores
    if (!html || html.trim().length < 100) {
      console.log(`❌ [${new Date().toISOString()}] HTML muy corto: ${html.length} caracteres`)
      throw new Error('HTML vacío o muy corto recibido')
    }

    // Verificar si el HTML contiene mensajes de error
    const errorKeywords = ['error', 'blocked', 'not found', '404', '403', 'unauthorized', 'forbidden']
    const hasError = errorKeywords.some(keyword => html.toLowerCase().includes(keyword))
    
    if (hasError) {
      console.log(`❌ [${new Date().toISOString()}] HTML contiene errores:`, {
        htmlPreview: html.substring(0, 200)
      })
      throw new Error('El sitio web devolvió una página de error o está bloqueado')
    }

    // Verificar que sea HTML válido
    if (!html.includes('<html') && !html.includes('<body')) {
      console.log(`❌ [${new Date().toISOString()}] HTML no válido:`, {
        htmlPreview: html.substring(0, 200)
      })
      throw new Error('Respuesta no es HTML válido')
    }

    console.log(`✅ [${new Date().toISOString()}] Scraping exitoso: ${html.length} caracteres`)

    // 🎯 Respuesta exitosa
    return Response.json({
      success: true,
      html: html,
      source: 'ScraperAPI',
      url: url,
      timestamp: new Date().toISOString(),
      html_length: html.length,
      status: 'success'
    })

  } catch (error) {
    console.error(`❌ [${new Date().toISOString()}] Error en scraping:`, {
      url: url,
      error: error.message,
      stack: error.stack
    })
    
    return Response.json({
      success: false,
      error: error.message,
      url: url || 'No URL provided',
      timestamp: new Date().toISOString(),
      status: 'error'
    }, { status: 500 })
  }
}

// 🔧 Manejar preflight CORS requests
export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}