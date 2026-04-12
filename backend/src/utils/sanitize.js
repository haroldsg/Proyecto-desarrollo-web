import sanitizeHtml from 'sanitize-html'

/**
 * Sanitiza un mensaje de chat:
 * - Elimina todas las etiquetas HTML y scripts
 * - Bloquea URLs (http, https, ftp, www.)
 * - Trunca al límite de caracteres indicado
 */
export const sanitizeMessage = (text, maxLength = 300) => {
  if (!text || typeof text !== 'string') return ''

  // 1. Eliminar toda etiqueta HTML (sin excepciones)
  let clean = sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} })

  // 2. Bloquear URLs
  clean = clean.replace(/https?:\/\/\S+/gi, '[enlace eliminado]')
  clean = clean.replace(/ftp:\/\/\S+/gi, '[enlace eliminado]')
  clean = clean.replace(/www\.\S+/gi, '[enlace eliminado]')

  // 3. Truncar
  clean = clean.trim().slice(0, maxLength)

  return clean
}
