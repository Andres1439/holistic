// cloudflare-worker-scraper.js
// 🚀 CLOUDFLARE WORKER PARA SCRAPERAPI

function addCorsHeaders(response) {
  const newHeaders = new Headers(response.headers)
  newHeaders.set('Access-Control-Allow-Origin', '*')
  newHeaders.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  newHeaders.set('Access-Control-Allow-Headers', 'Content-Type')
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  })
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }

    const url = new URL(request.url)

    // ... (test-scraperapi, check-scraperapi-key, diagnose-scraperapi, scrape-product) ...
    // (No cambios en esas rutas, puedes dejar igual que tu versión actual)

    // Ruta para análisis de competidores
    if (url.pathname === '/analyze-competitors' && request.method === 'POST') {
      try {
        const body = await request.json()
        const urls = body.urls
        const customInstructions = body.customInstructions

        if (!urls || urls.length === 0) {
          const response = Response.json({
            success: false,
            error: 'URLs requeridas'
          }, { status: 400 })
          return addCorsHeaders(response)
        }

        // Extraer datos de productos
        const extractProductData = (html, url) => {
          const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || 'Sin título'
          const description = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i)?.[1] || 'Sin descripción'
          return {
            url: url,
            title: title,
            description: description,
            html_length: html.length
          }
        }

        // Scrapear todas las URLs
        const SCRAPERAPI_KEY = env.SCRAPERAPI_KEY
        const scrapePromises = urls.map(async (url) => {
          try {
            const params = new URLSearchParams({
              api_key: SCRAPERAPI_KEY,
              url: url,
              render: 'true',
              country_code: 'us',
              premium: 'true',
              session_number: Math.floor(Math.random() * 1000).toString(),
              timeout: '30000'
            })
            const response = await fetch(`http://api.scraperapi.com?${params}`)
            if (!response.ok) {
              return {
                success: false,
                url: url,
                error: `Error ${response.status}: ${response.statusText}`
              }
            }
            const html = await response.text()
            const productData = extractProductData(html, url)
            return {
              success: true,
              url: url,
              data: productData
            }
          } catch (error) {
            return {
              success: false,
              url: url,
              error: error.message
            }
          }
        })

        const scrapeResults = await Promise.all(scrapePromises)
        const successfulScrapes = scrapeResults.filter(result => result.success)
        const failedScrapes = scrapeResults.filter(result => !result.success)

        if (successfulScrapes.length === 0) {
          const response = Response.json({
            success: false,
            error: 'No se pudo extraer información de ningún producto',
            details: failedScrapes.map(f => `${f.url}: ${f.error}`).join('\n')
          }, { status: 400 })
          return addCorsHeaders(response)
        }

        // Generar análisis con OpenAI
        const OPENAI_API_KEY = env.NEXT_PUBLIC_OPENAI_API_KEY
        if (!OPENAI_API_KEY) {
          const response = Response.json({
            success: false,
            error: 'OpenAI API key no configurada'
          }, { status: 500 })
          return addCorsHeaders(response)
        }

        const productAnalysis = successfulScrapes.map(result => {
          const data = result.data
          return `Producto: ${data.title}\nURL: ${data.url}\nDescripción: ${data.description}`
        }).join('\n\n')

        // PROMPT CON INSTRUCCIONES PERSONALIZADAS
        let prompt = `Eres un experto en marketing digital y análisis de competidores. Analiza los siguientes productos competidores y genera:

1. Un análisis competitivo detallado
2. Copy parafraseado y optimizado para cada producto
3. Recomendaciones de posicionamiento

IMPORTANTE:
- Responde SIEMPRE en español.
- NO uses formato Markdown, ni negritas, ni listas, ni encabezados.
- Escribe todo en texto plano, usando solo saltos de línea normales.

Productos a analizar:
${productAnalysis}`

        // Agregar instrucciones personalizadas si existen
        if (customInstructions && customInstructions.trim()) {
          prompt += `\n\nINSTRUCCIONES PERSONALIZADAS DEL USUARIO:
${customInstructions.trim()}

Aplica estas instrucciones específicas al generar el análisis y copy.`
        }

        prompt += `\n\nGenera un análisis estructurado y copy persuasivo, SOLO en texto plano.`

        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 2000,
            temperature: 0.7
          })
        })

        if (!openaiResponse.ok) {
          const errorResponse = Response.json({
            success: false,
            error: 'Error al generar análisis con OpenAI'
          }, { status: 500 })
          return addCorsHeaders(errorResponse)
        }

        const openaiData = await openaiResponse.json()
        const analysis = openaiData.choices?.[0]?.message?.content || 'No se pudo generar análisis'

        const analysisResponse = Response.json({
          success: true,
          analysis: analysis,
          stats: {
            total_urls: urls.length,
            successful_scrapes: successfulScrapes.length,
            failed_scrapes: failedScrapes.length
          },
          custom_instructions_used: customInstructions ? true : false,
          timestamp: new Date().toISOString()
        })
        return addCorsHeaders(analysisResponse)

      } catch (error) {
        const errorResponse = Response.json({
          success: false,
          error: error.message
        }, { status: 500 })
        return addCorsHeaders(errorResponse)
      }
    }

    // Ruta para generar copy de Facebook
    if (url.pathname === '/generate-facebook-copy' && request.method === 'POST') {
      try {
        const body = await request.json()
        const text = body.text
        const style = body.style || 'facebook'

        if (!text) {
          const response = Response.json({
            success: false,
            error: 'Texto requerido'
          }, { status: 400 })
          return addCorsHeaders(response)
        }

        const OPENAI_API_KEY = env.NEXT_PUBLIC_OPENAI_API_KEY
        if (!OPENAI_API_KEY) {
          const response = Response.json({
            success: false,
            error: 'OpenAI API key no configurada'
          }, { status: 500 })
          return addCorsHeaders(response)
        }

        // PROMPT SOLO TEXTO PLANO
        const prompt = `Eres un experto en marketing digital y copywriting para redes sociales. Convierte el siguiente texto en 3 versiones de copy optimizado para Facebook.

IMPORTANTE:
- Responde SIEMPRE en español.
- NO uses formato Markdown, ni negritas, ni listas, ni encabezados.
- Escribe todo en texto plano, usando solo saltos de línea normales.

Texto original: "${text}"

Genera 3 versiones diferentes:
1. Copy Emocional (que conecte con sentimientos)
2. Copy con Prueba Social (que genere confianza)
3. Copy Educativo (que informe y valore)

Cada versión debe incluir:
- Emojis relevantes
- Call-to-action claro
- Hashtags estratégicos
- Máximo 200 caracteres por versión

Responde SOLO en texto plano.`

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1000,
            temperature: 0.8
          })
        })

        if (!response.ok) {
          const errorResponse = Response.json({
            success: false,
            error: 'Error al generar copy con OpenAI'
          }, { status: 500 })
          return addCorsHeaders(errorResponse)
        }

        const data = await response.json()
        const facebookCopy = data.choices?.[0]?.message?.content || 'No se pudo generar copy'

        const copyResponse = Response.json({
          success: true,
          facebook_copy: facebookCopy,
          original_text: text,
          timestamp: new Date().toISOString()
        })
        return addCorsHeaders(copyResponse)

      } catch (error) {
        const errorResponse = Response.json({
          success: false,
          error: error.message
        }, { status: 500 })
        return addCorsHeaders(errorResponse)
      }
    }

    // ... (resto de rutas: test-scraperapi, check-scraperapi-key, diagnose-scraperapi, scrape-product, notFound) ...
    // (Puedes dejar igual que tu versión actual)

    const notFoundResponse = Response.json({ error: 'Ruta no encontrada' }, { status: 404 })
    return addCorsHeaders(notFoundResponse)
  }
} 