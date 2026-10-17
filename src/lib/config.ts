export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
}

/** Estructura del objeto usage que devuelve la API de Groq */
export interface GroqUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  queue_time?: number;
  prompt_time?: number;
  completion_time?: number;
  total_time?: number;
}

/** Información completa de la respuesta de Groq */
export interface GroqResponse {
  content: string;
  usage: GroqUsage;
  model: string;
}

/** Métricas acumuladas de la sesión */
export interface SessionMetrics {
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalTokens: number;
  requestCount: number;
  lastModel: string;
  lastResponseTime: number;
}

export const GROQ_MODEL = "allam-2-7b";
export const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";