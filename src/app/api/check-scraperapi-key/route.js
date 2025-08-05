// app/api/check-scraperapi-key/route.js
// 🔑 API ROUTE PARA VERIFICAR SCRAPERAPI KEY
// Actualizado: 04/08/2025

export async function GET(request) {
  try {
    console.log(`🔑 [${new Date().toISOString()}] Verificando ScraperAPI key`)

    const SCRAPERAPI_KEY = process.env.SCRAPERAPI_KEY

    if (!SCRAPERAPI_KEY) {
      return Response.json({
        success: false,
        error: 'ScraperAPI key no configurada',
        details: 'La variable SCRAPERAPI_KEY no está definida en .env.local',
        solution: 'Agrega SCRAPERAPI_KEY=tu_api_key en el archivo .env.local',
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    // Análisis de la API key
    const keyLength = SCRAPERAPI_KEY.length
    const keyFormat = keyLength > 20 ? 'valid_length' : 'too_short'
    const keyStartsWith = SCRAPERAPI_KEY.startsWith('sk-') ? 'valid_prefix' : 'invalid_prefix'
    const hasSpecialChars = /[^a-zA-Z0-9-_]/.test(SCRAPERAPI_KEY)

    console.log(`🔍 [${new Date().toISOString()}] Análisis de API key:`, {
      length: keyLength,
      format: keyFormat,
      prefix: keyStartsWith,
      hasSpecialChars
    })

    // Verificar formato básico
    const formatIssues = []
    if (keyLength < 20) formatIssues.push('La API key es muy corta')
    if (keyLength > 100) formatIssues.push('La API key es muy larga')
    if (hasSpecialChars) formatIssues.push('La API key contiene caracteres especiales no válidos')
    if (!SCRAPERAPI_KEY.startsWith('sk-')) formatIssues.push('La API key no comienza con "sk-"')

    // Probar con una URL simple
    const testUrl = 'https://httpbin.org/html'
    const scraperUrl = 'http://api.scraperapi.com'
    
    const params = new URLSearchParams({
      api_key: SCRAPERAPI_KEY,
      url: testUrl,
      render: 'true',
      country_code: 'us',
      premium: 'true',
      session_number: Math.floor(Math.random() * 1000).toString(),
      timeout: '10000'
    })

    console.log(`🧪 [${new Date().toISOString()}] Probando API key con URL: ${testUrl}`)

    let testResult = null
    try {
      const response = await fetch(`${scraperUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      })

      const responseText = await response.text()
      
      testResult = {
        status: response.status,
        success: response.ok,
        html_length: responseText.length,
        is_html: responseText.includes('<html') || responseText.includes('<body'),
        error_message: response.ok ? null : responseText.substring(0, 200)
      }

      console.log(`📊 [${new Date().toISOString()}] Resultado de prueba:`, testResult)

    } catch (error) {
      testResult = {
        status: 'error',
        success: false,
        html_length: 0,
        is_html: false,
        error_message: error.message
      }
      console.log(`❌ [${new Date().toISOString()}] Error en prueba:`, error.message)
    }

    // Evaluación final
    const isKeyValid = formatIssues.length === 0
    const isKeyWorking = testResult && testResult.success && testResult.is_html
    const overallSuccess = isKeyValid && isKeyWorking

    return Response.json({
      success: overallSuccess,
      message: overallSuccess 
        ? 'ScraperAPI key es válida y funciona correctamente'
        : 'ScraperAPI key tiene problemas',
      key_analysis: {
        length: keyLength,
        format: keyFormat,
        prefix: keyStartsWith,
        has_special_chars: hasSpecialChars,
        format_issues: formatIssues,
        is_valid_format: isKeyValid
      },
      test_result: testResult,
      is_working: isKeyWorking,
      recommendations: overallSuccess ? [] : [
        'Verifica que la API key esté correctamente copiada',
        'Asegúrate de que tengas créditos disponibles en tu cuenta de ScraperAPI',
        'Verifica que la API key no haya expirado',
        'Contacta soporte de ScraperAPI si el problema persiste'
      ],
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error(`❌ [${new Date().toISOString()}] Error en verificación:`, {
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