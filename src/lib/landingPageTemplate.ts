/**
 * Genera el código HTML para una landing page enmascarada
 * @param finalUrl - URL de destino final
 * @param countdown - Segundos de espera
 * @returns Código HTML completo
 */
export function generateLandingPageHTML(finalUrl: string, countdown: number): string {
  // Validar y formatear la URL
  let validUrl = finalUrl.trim();
  
  // Si la URL no empieza con http:// o https://, agregar https://
  if (validUrl && !validUrl.match(/^https?:\/\//)) {
    validUrl = 'https://' + validUrl;
  }
  
  // Validar que sea una URL válida
  let isValidUrl = false;
  try {
    if (validUrl) {
      new URL(validUrl);
      isValidUrl = true;
    }
  } catch (e) {
    isValidUrl = false;
  }

  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="google" value="notranslate">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="format-detection" content="telephone=no">
    <title>Cargando Oferta Especial...</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    animation: {
                        'gradient-x': 'gradient-x 3s ease infinite',
                        'bounce-slow': 'bounce 2s infinite',
                        'pulse-slow': 'pulse 2s infinite',
                    },
                    keyframes: {
                        'gradient-x': {
                            '0%, 100%': { 'background-position': '0% 50%' },
                            '50%': { 'background-position': '100% 50%' },
                        }
                    }
                }
            }
        }
    <\/script>
</head>
<body class="bg-black min-h-screen overflow-hidden font-sans">
    <!-- Fondo de la página original (simulado) -->
    <iframe class="absolute inset-0 w-full h-full border-none" src="about:blank" title="background"></iframe>
    
    <!-- Overlay blur para desktop -->
    <div class="hidden md:block fixed inset-0 bg-black/70 backdrop-blur-sm z-10"></div>
    
    <!-- Modal principal -->
    <div class="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50">
        <!-- Container del modal con borde animado -->
        <div class="relative bg-white rounded-lg sm:rounded-2xl w-full max-w-[260px] sm:max-w-sm shadow-2xl overflow-hidden animate-in zoom-in duration-500">
            <!-- Borde gradiente animado -->
            <div class="absolute inset-0 bg-gradient-to-r from-red-400 via-blue-400 via-yellow-400 to-red-400 bg-[length:400%_400%] animate-gradient-x rounded-lg sm:rounded-2xl">
                <div class="absolute inset-[1.5px] sm:inset-[3px] bg-white rounded-lg sm:rounded-2xl"></div>
            </div>
            
            <!-- Contenido del modal -->
            <div class="relative p-3 sm:p-6 text-center">
                <!-- Icono principal -->
                <div class="w-10 h-10 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-lg sm:text-3xl animate-pulse-slow">
                    🎁
                </div>
                
                <!-- Título -->
                <h2 class="text-xs sm:text-xl font-bold text-gray-800 mb-1.5 sm:mb-3 px-1 leading-tight">
                    ¡Oferta Exclusiva Desbloqueada!
                </h2>
                
                <!-- Descripción -->
                <p class="text-[10px] sm:text-sm text-gray-600 mb-2 sm:mb-6 leading-relaxed px-1">
                    Estás a punto de ser redirigido a una página con una promoción especial. ¡Prepárate!
                </p>
                
                <!-- Contador -->
                <div class="bg-gray-50 rounded-md sm:rounded-xl p-1.5 sm:p-4 mb-2 sm:mb-6">
                    <span class="text-gray-700 font-semibold text-[10px] sm:text-base">
                        Serás redirigido en 
                        <span id="countdown" class="text-red-500 text-xs sm:text-xl font-bold animate-pulse-slow">
                            ${countdown}
                        </span>
                        segundos...
                    </span>
                </div>
                
                <!-- Botón principal -->
                <button id="actionBtn" disabled class="w-full py-1.5 sm:py-4 px-2 sm:px-6 rounded-md sm:rounded-xl font-bold uppercase tracking-wide transition-all duration-300 relative overflow-hidden bg-gray-400 text-white cursor-not-allowed text-[9px] sm:text-base flex items-center justify-center">
                    <span id="btnText" class="relative z-10">Por favor, espera...</span>
                    <span id="hand" class="ml-1 sm:ml-2 text-[10px] sm:text-lg animate-bounce hidden">👉</span>
                </button>
            </div>
        </div>
    </div>

    <script>
        const countdownEl = document.getElementById('countdown');
        const actionBtn = document.getElementById('actionBtn');
        const btnText = document.getElementById('btnText');
        const handEl = document.getElementById('hand');
        const finalUrl = '${validUrl}';
        const isValidUrl = ${isValidUrl};
        
        let secondsLeft = ${countdown};

        const interval = setInterval(() => {
            secondsLeft--;
            countdownEl.textContent = secondsLeft;
            
            if (secondsLeft <= 0) {
                clearInterval(interval);
                actionBtn.disabled = false;
                actionBtn.classList.remove('bg-gray-400', 'cursor-not-allowed');
                actionBtn.classList.add('bg-gradient-to-r', 'from-purple-500', 'to-blue-600', 'hover:-translate-y-1', 'hover:shadow-lg', 'hover:shadow-purple-500/25', 'active:scale-95');
                btnText.textContent = 'IR A LA OFERTA AHORA';
                handEl.classList.remove('hidden');
                
                // Auto-redirect después de mostrar el botón (solo si la URL es válida)
                if (isValidUrl && finalUrl) {
                    setTimeout(() => {
                        try {
                            window.location.href = finalUrl;
                        } catch (e) {
                            console.error('Error al redirigir:', e);
                        }
                    }, 500);
                }
            }
        }, 1000);

        actionBtn.onclick = () => {
            if (!actionBtn.disabled && isValidUrl && finalUrl) {
                try {
                    window.location.href = finalUrl;
                } catch (e) {
                    console.error('Error al redirigir:', e);
                    alert('Error: URL no válida');
                }
            }
        };
    <\/script>
</body>
</html>`
} 