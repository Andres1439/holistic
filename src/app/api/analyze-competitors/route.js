export async function POST(request) {
  try {
    const { urls } = await request.json()

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Se requiere un array de URLs válidas'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const SCRAPERAPI_KEY = process.env.SCRAPERAPI_KEY
    const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY

    if (!SCRAPERAPI_KEY) {
      return new Response(JSON.stringify({
        success: false,
        error: 'ScraperAPI key no está configurada'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({
        success: false,
        error: 'OpenAI API key no está configurada'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Función para extraer datos de producto del HTML
    const extractProductData = (html, url) => {
      try {
        // Extraer título
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i) || 
                          html.match(/<h1[^>]*>([^<]+)<\/h1>/i) ||
                          html.match(/<h2[^>]*>([^<]+)<\/h2>/i)
        const title = titleMatch ? titleMatch[1].trim() : 'Título no encontrado'

        // Extraer descripción
        const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i) ||
                         html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]+)"/i)
        const description = descMatch ? descMatch[1].trim() : 'Descripción no encontrada'

        // Extraer precio
        const priceMatch = html.match(/\$[\d,]+\.?\d*/g) || 
                          html.match(/[\d,]+\.?\d*\s*(?:USD|EUR|MXN|COP)/gi) ||
                          html.match(/precio[^>]*>([^<]+)</i)
        const price = priceMatch ? priceMatch[0] : 'Precio no encontrado'

        // Extraer características
        const features = []
        const featureMatches = html.match(/<li[^>]*>([^<]+)<\/li>/gi)
        if (featureMatches) {
          features.push(...featureMatches.slice(0, 5).map(match => 
            match.replace(/<[^>]*>/g, '').trim()
          ))
        }

        return {
          url,
          title,
          description,
          price,
          features: features.slice(0, 5)
        }
      } catch (error) {
        return {
          url,
          title: 'Error al extraer datos',
          description: 'No se pudieron extraer datos del producto',
          price: 'N/A',
          features: []
        }
      }
    }

    // Scraping de todos los productos
    const scrapePromises = urls.map(async (url) => {
      try {
        const scraperUrl = `https://api.scraperapi.com/api/v1/scrape`
        const params = new URLSearchParams({
          api_key: SCRAPERAPI_KEY,
          url: url,
          render: 'true',
          premium: 'true',
          session_number: Math.floor(Math.random() * 1000)
        })

        const response = await fetch(`${scraperUrl}?${params}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          let errorMessage = `Error de ScraperAPI: ${response.status}`
          
          // Manejar errores específicos
          if (response.status === 404) {
            errorMessage = 'URL no encontrada (404): La página no existe o no es accesible'
          } else if (response.status === 403) {
            errorMessage = 'Acceso denegado (403): El sitio web bloquea el scraping'
          } else if (response.status === 429) {
            errorMessage = 'Límite de requests alcanzado (429): Intenta más tarde'
          }
          
          return {
            url,
            success: false,
            error: errorMessage
          }
        }

        const html = await response.text()
        
        if (html.includes('error') || html.includes('blocked') || html.includes('not found')) {
          return {
            url,
            success: false,
            error: 'El sitio web devolvió una página de error o está bloqueado'
          }
        }

        const productData = extractProductData(html, url)
        
        return {
          url,
          success: true,
          data: productData,
          html: html.substring(0, 1000) // Solo los primeros 1000 caracteres para el análisis
        }

      } catch (error) {
        return {
          url,
          success: false,
          error: `Error de scraping: ${error.message}`
        }
      }
    })

    const scrapeResults = await Promise.all(scrapePromises)
    const successfulScrapes = scrapeResults.filter(result => result.success)
    const failedScrapes = scrapeResults.filter(result => !result.success)

    if (successfulScrapes.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No se pudo extraer información de ningún producto',
        details: failedScrapes.map(result => ({
          url: result.url,
          error: result.error
        }))
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Generar copy parafraseado con OpenAI
    const productAnalysis = successfulScrapes.map(result => {
      const data = result.data
      return `
PRODUCTO: ${data.title}
URL: ${data.url}
DESCRIPCIÓN: ${data.description}
PRECIO: ${data.price}
CARACTERÍSTICAS: ${data.features.join(', ')}
      `.trim()
    }).join('\n\n')

    const prompt = `Eres un experto en marketing digital y análisis de competidores.

Analiza los siguientes productos de competidores y genera copy parafraseado optimizado para marketing:

${productAnalysis}

Genera 3 versiones diferentes de copy basado en estos productos:

1. VERSIÓN COMPETITIVA: Destaca ventajas competitivas y diferenciación
2. VERSIÓN BENEFICIOS: Enfocada en beneficios y valor para el cliente
3. VERSIÓN URGENCIA: Con elementos de escasez y llamadas a la acción

Cada versión debe incluir:
- Título llamativo con emojis
- Descripción atractiva basada en los productos analizados
- Call-to-action claro
- Hashtags relevantes (máximo 5)
- Longitud optimizada para redes sociales

Formato de respuesta:
=== VERSIÓN 1: COMPETITIVA ===
[Título con emojis]

[Descripción atractiva]

[Call-to-action]

#hashtag1 #hashtag2 #hashtag3

=== VERSIÓN 2: BENEFICIOS ===
[Título con emojis]

[Descripción atractiva]

[Call-to-action]

#hashtag1 #hashtag2 #hashtag3

=== VERSIÓN 3: URGENCIA ===
[Título con emojis]

[Descripción atractiva]

[Call-to-action]

#hashtag1 #hashtag2 #hashtag3`

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto copywriter especializado en análisis de competidores y marketing digital. Tu objetivo es crear copy que destaque ventajas competitivas basadas en análisis de productos reales.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.8,
        top_p: 1,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      })
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      return new Response(JSON.stringify({
        success: false,
        error: `Error de OpenAI: ${errorData.error?.message || 'Error desconocido'}`,
        scrape_results: {
          successful: successfulScrapes.length,
          failed: failedScrapes.length,
          total: scrapeResults.length
        }
      }), {
        status: openaiResponse.status,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const openaiData = await openaiResponse.json()
    const paraphrasedCopy = openaiData.choices[0]?.message?.content || 'No se pudo generar copy parafraseado'

    return new Response(JSON.stringify({
      success: true,
      paraphrased_copy: paraphrasedCopy,
      analyzed_competitors: scrapeResults.length,
      successful_extractions: successfulScrapes.length,
      failed_extractions: failedScrapes.length,
      competitor_details: scrapeResults.map(result => ({
        url: result.url,
        success: result.success,
        error: result.error,
        data: result.data
      })),
      usage_stats: {
        prompt_tokens: openaiData.usage?.prompt_tokens,
        completion_tokens: openaiData.usage?.completion_tokens,
        total_tokens: openaiData.usage?.total_tokens
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error en análisis de competidores:', error)
    return new Response(JSON.stringify({
      success: false,
      error: 'Error interno del servidor'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

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