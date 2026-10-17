"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Header } from "@/components/header";
import { ChatMessages } from "@/components/chat-messages";
import { ChatInput } from "@/components/chat-input";
import { MetricsPanel } from "@/components/metrics-panel";
import { sendMessage } from "@/lib/groq";
import type { ChatMessage, SessionMetrics } from "@/lib/config";

const STORAGE_KEY_MESSAGES = "groq-chat-messages";
const STORAGE_KEY_METRICS = "groq-chat-metrics";

function loadMessages(): ChatMessage[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_MESSAGES);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignorar errores de parseo
  }
  return [];
}

function loadMetrics(): SessionMetrics {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_METRICS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignorar errores de parseo
  }
  return {
    totalPromptTokens: 0,
    totalCompletionTokens: 0,
    totalTokens: 0,
    requestCount: 0,
    lastModel: "",
    lastResponseTime: 0,
  };
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<SessionMetrics>({
    totalPromptTokens: 0,
    totalCompletionTokens: 0,
    totalTokens: 0,
    requestCount: 0,
    lastModel: "",
    lastResponseTime: 0,
  });
  const [hydrated, setHydrated] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Hidratar desde localStorage al montar el componente
  useEffect(() => {
    setMessages(loadMessages());
    setMetrics(loadMetrics());
    setHydrated(true);
  }, []);

  // Guardar mensajes en localStorage cuando cambien
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    }
  }, [messages, hydrated]);

  // Guardar métricas en localStorage cuando cambien
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY_METRICS, JSON.stringify(metrics));
    }
  }, [metrics, hydrated]);

  // Scroll automático al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Función para borrar toda la conversación
  const clearChat = useCallback(() => {
    setMessages([]);
    setMetrics({
      totalPromptTokens: 0,
      totalCompletionTokens: 0,
      totalTokens: 0,
      requestCount: 0,
      lastModel: "",
      lastResponseTime: 0,
    });
    localStorage.removeItem(STORAGE_KEY_MESSAGES);
    localStorage.removeItem(STORAGE_KEY_METRICS);
  }, []);

  const handleSend = async (content: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const startTime = performance.now();

      // Llamada asíncrona a la API
      const groqResponse = await sendMessage(updatedMessages);

      const responseTime = (performance.now() - startTime) / 1000;

      // Acumular tokens de la respuesta y métricas de la sesión
      setMetrics((prev) => ({
        totalPromptTokens: prev.totalPromptTokens + groqResponse.usage.prompt_tokens,
        totalCompletionTokens: prev.totalCompletionTokens + groqResponse.usage.completion_tokens,
        totalTokens: prev.totalTokens + groqResponse.usage.total_tokens,
        requestCount: prev.requestCount + 1,
        lastModel: groqResponse.model,
        lastResponseTime: responseTime,
      }));

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: groqResponse.content,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          error instanceof Error
            ? `❌ ${error.message}`
            : "❌ Ocurrió un error inesperado. Por favor, inténtalo de nuevo.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <Header onClearChat={clearChat} hasMessages={messages.length > 0} />
      <ChatMessages messages={messages} isLoading={isLoading} />
      <div ref={bottomRef} />
      <MetricsPanel metrics={metrics} />
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}
