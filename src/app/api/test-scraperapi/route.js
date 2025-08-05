// app/api/test-scraperapi/route.js
// 🧪 API ROUTE PARA PROBAR SCRAPERAPI
// Actualizado: 04/08/2025

export async function GET(request) {
  try {
    console.log(`🧪 [${new Date().toISOString()}] Iniciando prueba de ScraperAPI`)

    const SCRAPERAPI_KEY = process.env.SCRAPERAPI_KEY

    if (!SCRAPERAPI_KEY) {
      console.log(`❌ [${new Date().toISOString()}] Error: ScraperAPI key no configurada`)
      return Response.json({
        success: false,
        error: 'ScraperAPI key no configurada',
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    console.log(`✅ [${new Date().toISOString()}] ScraperAPI key encontrada: ${SCRAPERAPI_KEY.substring(0, 10)}...`)

    // URL de prueba simple (HTTPBin para testing)
    const testUrl = 'https://httpbin.org/html'
    
    // Probar múltiples endpoints para encontrar el correcto
    const endpoints = [
      {
        name: 'Endpoint Principal (HTTP)',
        url: 'http://api.scraperapi.com',
        description: 'Endpoint principal con HTTP'
      },
      {
        name: 'Endpoint Principal (HTTPS)',
        url: 'https://api.scraperapi.com',
        description: 'Endpoint principal con HTTPS'
      },
      {
        name: 'Endpoint API v1',
        url: 'https://api.scraperapi.com/api/v1/scrape',
        description: 'Endpoint API v1'
      }
    ]

    for (const endpoint of endpoints) {
      try {
        console.log(`🧪 [${new Date().toISOString()}] Probando ${endpoint.name}: ${endpoint.url}`)

        const params = new URLSearchParams({
          api_key: SCRAPERAPI_KEY,
          url: testUrl,
          render: 'true',
          country_code: 'us',
          premium: 'true',
          session_number: Math.floor(Math.random() * 1000).toString(),
          timeout: '15000'
        })

        console.log(`🔧 [${new Date().toISOString()}] Parámetros: ${params.toString().substring(0, 100)}...`)

        const response = await fetch(`${endpoint.url}?${params}`, {
          method: 'GET',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        })

        console.log(`📊 [${new Date().toISOString()}] Respuesta de ${endpoint.name}:`, {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.log(`❌ [${new Date().toISOString()}] Error en ${endpoint.name}:`, {
            status: response.status,
            errorText: errorText.substring(0, 500)
          })
          continue // Probar siguiente endpoint
        }

        const html = await response.text()
        console.log(`✅ [${new Date().toISOString()}] ${endpoint.name} exitoso: ${html.length} caracteres`)

        // Verificar que sea HTML válido
        if (html.includes('<html') || html.includes('<body')) {
          console.log(`✅ [${new Date().toISOString()}] ${endpoint.name} devuelve HTML válido`)
          
          return Response.json({
            success: true,
            message: `ScraperAPI funciona correctamente con ${endpoint.name}`,
            working_endpoint: endpoint.name,
            endpoint_url: endpoint.url,
            test_url: testUrl,
            html_length: html.length,
            html_preview: html.substring(0, 200),
            timestamp: new Date().toISOString()
          })
        } else {
          console.log(`❌ [${new Date().toISOString()}] ${endpoint.name} no devuelve HTML válido:`, {
            preview: html.substring(0, 200)
          })
        }

      } catch (error) {
        console.log(`❌ [${new Date().toISOString()}] Error en ${endpoint.name}:`, error.message)
        continue // Probar siguiente endpoint
      }
    }

    // Si llegamos aquí, ningún endpoint funcionó
    console.log(`❌ [${new Date().toISOString()}] Todos los endpoints fallaron`)
    
    return Response.json({
      success: false,
      error: 'Todos los endpoints de ScraperAPI fallaron',
      details: 'Se probaron múltiples endpoints pero ninguno devolvió HTML válido',
      endpoints_tested: endpoints.length,
      timestamp: new Date().toISOString()
    }, { status: 500 })

  } catch (error) {
    console.error(`❌ [${new Date().toISOString()}] Error en prueba:`, {
      error: error.message,
      stack: error.stack
    })

    return Response.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 