import { GROQ_API_URL, GROQ_MODEL, type ChatMessage, type GroqResponse } from "./config";

/**
 * Envía el historial completo de la conversación a la API de Groq usando fetch nativo.
 * - async/await para manejo asíncrono
 * - Cabeceras Authorization: Bearer y Content-Type configuradas manualmente
 * - Captura y normaliza errores HTTP con mensajes claros
 * - Devuelve el contenido más el objeto usage con métricas de tokens
 */
export async function sendMessage(messages: ChatMessage[]): Promise<GroqResponse> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      "La clave de API no está configurada. " +
      "Asegúrate de definir NEXT_PUBLIC_GROQ_API_KEY en el archivo .env"
    );
  }

  let response: Response;

  try {
    response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: messages.map(({ role, content }) => ({ role, content })),
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });
  } catch (networkError) {
    throw new Error(
      "No se pudo conectar con el servidor de Groq. " +
      "Verifica tu conexión a internet e inténtalo de nuevo."
    );
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const serverMessage = errorBody.error?.message || "";

    switch (response.status) {
      case 401:
        throw new Error(
          "La clave de API no es válida o ha expirado. " +
          "Revisa tu NEXT_PUBLIC_GROQ_API_KEY en el archivo .env"
        );
      case 429:
        throw new Error(
          "Has superado el límite de peticiones. " +
          "Espera unos momentos y vuelve a intentarlo."
        );
      case 500:
      case 502:
      case 503:
        throw new Error(
          "El servidor de Groq está teniendo problemas temporales. " +
          "Por favor, inténtalo de nuevo en unos segundos."
        );
      default:
        throw new Error(
          serverMessage || `Error del servidor (código ${response.status}). Inténtalo de nuevo.`
        );
    }
  }

  const data = await response.json();

  if (!data.choices?.[0]?.message?.content) {
    throw new Error(
      "La respuesta de Groq no tiene el formato esperado. " +
      "Intenta enviar tu mensaje nuevamente."
    );
  }

  // Devolver contenido + objeto usage completo con métricas
  return {
    content: data.choices[0].message.content,
    usage: {
      prompt_tokens: data.usage?.prompt_tokens ?? 0,
      completion_tokens: data.usage?.completion_tokens ?? 0,
      total_tokens: data.usage?.total_tokens ?? 0,
      queue_time: data.usage?.queue_time,
      prompt_time: data.usage?.prompt_time,
      completion_time: data.usage?.completion_time,
      total_time: data.usage?.total_time,
    },
    model: data.model || GROQ_MODEL,
  };
}