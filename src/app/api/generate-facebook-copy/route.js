export async function POST(request) {
  try {
    const { text, style = 'facebook' } = await request.json()

    if (!text || !text.trim()) {
      return new Response(JSON.stringify({
        success: false,
        error: 'El texto es requerido'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY

    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({
        success: false,
        error: 'OpenAI API key no está configurada'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Prompt optimizado para Facebook
    const prompt = `Eres un experto en marketing digital y copywriting para redes sociales. 
    
Tu tarea es convertir el siguiente texto en copy optimizado para Facebook que sea:
- Atractivo y llamativo
- Con emojis relevantes
- Estructurado para máxima engagement
- Con call-to-action claro
- Optimizado para el algoritmo de Facebook

Texto original: "${text}"

Genera 3 versiones diferentes del copy:
1. VERSIÓN EMOCIONAL: Enfocada en beneficios y emociones
2. VERSIÓN SOCIAL PROOF: Con elementos de urgencia y escasez
3. VERSIÓN EDUCATIVA: Enfocada en resolver problemas

Cada versión debe tener:
- Título llamativo con emojis
- Descripción atractiva
- Call-to-action claro
- Hashtags relevantes (máximo 5)
- Longitud optimizada para Facebook (máximo 2000 caracteres)

Formato de respuesta:
=== VERSIÓN 1: EMOCIONAL ===
[Título con emojis]

[Descripción atractiva]

[Call-to-action]

#hashtag1 #hashtag2 #hashtag3

=== VERSIÓN 2: SOCIAL PROOF ===
[Título con emojis]

[Descripción atractiva]

[Call-to-action]

#hashtag1 #hashtag2 #hashtag3

=== VERSIÓN 3: EDUCATIVA ===
[Título con emojis]

[Descripción atractiva]

[Call-to-action]

#hashtag1 #hashtag2 #hashtag3`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'Eres un experto copywriter especializado en marketing digital para redes sociales, especialmente Facebook. Tu objetivo es crear copy que genere engagement y conversiones.'
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

    if (!response.ok) {
      const errorData = await response.json()
      return new Response(JSON.stringify({
        success: false,
        error: `Error de OpenAI: ${errorData.error?.message || 'Error desconocido'}`
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const data = await response.json()
    const generatedCopy = data.choices[0]?.message?.content || 'No se pudo generar el copy'

    return new Response(JSON.stringify({
      success: true,
      copy: generatedCopy,
      usage: {
        prompt_tokens: data.usage?.prompt_tokens,
        completion_tokens: data.usage?.completion_tokens,
        total_tokens: data.usage?.total_tokens
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error generando copy de Facebook:', error)
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