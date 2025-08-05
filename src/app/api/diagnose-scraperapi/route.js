// app/api/diagnose-scraperapi/route.js
// 🔍 API ROUTE PARA DIAGNÓSTICO DE SCRAPERAPI
// Actualizado: 04/08/2025

export async function GET(request) {
  try {
    console.log(`🔍 [${new Date().toISOString()}] Iniciando diagnóstico de ScraperAPI`)

    const SCRAPERAPI_KEY = process.env.SCRAPERAPI_KEY

    if (!SCRAPERAPI_KEY) {
      return Response.json({
        success: false,
        error: 'ScraperAPI key no configurada',
        diagnosis: {
          env_check: false,
          key_length: 0,
          key_format: 'no_key'
        },
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    // Diagnóstico de la API key
    const keyLength = SCRAPERAPI_KEY.length
    const keyFormat = keyLength > 20 ? 'valid_length' : 'too_short'
    const keyStartsWith = SCRAPERAPI_KEY.startsWith('sk-') ? 'valid_prefix' : 'invalid_prefix'

    console.log(`🔍 [${new Date().toISOString()}] Diagnóstico de API key:`, {
      length: keyLength,
      format: keyFormat,
      prefix: keyStartsWith
    })

    // Probar diferentes endpoints
    const endpoints = [
      {
        name: 'Endpoint Principal',
        url: 'http://api.scraperapi.com',
        test_url: 'https://httpbin.org/html'
      },
      {
        name: 'Endpoint Alternativo',
        url: 'https://api.scraperapi.com/api/v1/scrape',
        test_url: 'https://httpbin.org/html'
      }
    ]

    const results = []

    for (const endpoint of endpoints) {
      try {
        console.log(`🧪 [${new Date().toISOString()}] Probando ${endpoint.name}: ${endpoint.url}`)

        const params = new URLSearchParams({
          api_key: SCRAPERAPI_KEY,
          url: endpoint.test_url,
          render: 'true',
          country_code: 'us',
          premium: 'true',
          session_number: Math.floor(Math.random() * 1000).toString(),
          timeout: '15000'
        })

        const response = await fetch(`${endpoint.url}?${params}`, {
          method: 'GET',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        })

        const html = await response.text()
        
        results.push({
          endpoint: endpoint.name,
          url: endpoint.url,
          status: response.status,
          success: response.ok,
          html_length: html.length,
          is_html: html.includes('<html') || html.includes('<body'),
          error: response.ok ? null : html.substring(0, 200)
        })

        console.log(`✅ [${new Date().toISOString()}] ${endpoint.name}: ${response.status} - ${html.length} chars`)

      } catch (error) {
        console.log(`❌ [${new Date().toISOString()}] Error en ${endpoint.name}:`, error.message)
        
        results.push({
          endpoint: endpoint.name,
          url: endpoint.url,
          status: 'error',
          success: false,
          html_length: 0,
          is_html: false,
          error: error.message
        })
      }
    }

    // Análisis de resultados
    const workingEndpoints = results.filter(r => r.success && r.is_html)
    const bestEndpoint = workingEndpoints.length > 0 ? workingEndpoints[0] : null

    return Response.json({
      success: workingEndpoints.length > 0,
      message: workingEndpoints.length > 0 
        ? 'ScraperAPI funciona correctamente' 
        : 'Todos los endpoints fallaron',
      diagnosis: {
        env_check: true,
        key_length: keyLength,
        key_format: keyFormat,
        key_prefix: keyStartsWith,
        endpoints_tested: endpoints.length,
        working_endpoints: workingEndpoints.length,
        best_endpoint: bestEndpoint ? bestEndpoint.endpoint : null
      },
      results: results,
      recommendation: bestEndpoint ? {
        endpoint: bestEndpoint.endpoint,
        url: bestEndpoint.url
      } : null,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error(`❌ [${new Date().toISOString()}] Error en diagnóstico:`, {
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