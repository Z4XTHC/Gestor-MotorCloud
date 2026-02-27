{
  /** Burbuja Chat - Tendra la funcionalidad de ser un
   *  asistente de AI para ayudar a los usuarios con sus consultas y tareas dentro de la aplicación,
   *  que sean de respuestas rapidas y sencillas. Incluye información de Preguntas y Respuestas ya pre configuradas,
   * también ayudar al usuario a como utilizar esta plataforma en caso de alguna duda que pueda llegar a surgir durante su uso.
   *
   * Estara conectado a la API de OpenAI para proporcionar respuestas inteligentes y contextuales, sacandolo desde
   * el Backend.
   *
   * Versión: 1.0
   *
   */
}

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import axiosInstance from "../../api/axiosConfig";
import { useAuth } from "../../contexts/AuthContext";
import { Bot } from "lucide-react";

type Message = { role: "user" | "assistant" | "system"; text: string };

export function BurbujaChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      text: "¡Hola soy Axio! Tu asistente virtual de MangoSoft. Estoy aquí para ayudarte con cualquier duda o consulta que tengas sobre el uso de la plataforma. Ya sea que necesites ayuda para crear órdenes, configurar usuarios o subir documentos, no dudes en preguntarme. ¡Estoy aquí para hacer tu experiencia más fácil y eficiente!",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [guideSteps, setGuideSteps] = useState<string[] | null>(null);
  const { user } = useAuth();
  const userRole =
    user?.role ||
    (user?.cliente_id
      ? "cliente"
      : user?.tecnico_id
        ? "tecnico"
        : user?.admin
          ? "admin"
          : "user");

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  const suggestionsByRole: Record<string, string[]> = {
    admin: [
      "¿Cómo crear una orden?",
      "¿Dónde configuro usuarios?",
      "¿Cómo gestionar técnicos?",
      "FAQ: Cómo subir documentos",
    ],
    tecnico: [
      "¿Cómo crear una orden?",
      "FAQ: Procedimiento técnico",
      "¿Cómo asigno reportes de servicio?",
    ],
    cliente: [
      "¿Cómo crear una auditoria flash 72hs?",
      "¿Cómo ver el estado de mi orden?",
      "FAQ: Cómo revisar mis documentos",
    ],
    user: [
      "¿Cómo crear una auditoria flash 72hs?",
      "FAQ: Cómo revisar mis documentos",
    ],
  };

  const quickSuggestions =
    suggestionsByRole[userRole] || suggestionsByRole.user;

  async function send() {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages((m) => [...m, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/openai/asistente", {
        question: userText,
        history: messages,
        role: userRole,
      });
      const answer =
        res.data?.answer || "No obtuve respuesta. Intentá de nuevo.";
      setMessages((m) => [...m, { role: "assistant", text: answer }]);

      // Guardar log en backend (async, no bloquear UX)
      axiosInstance
        .post("/api/openai/asistente/log", {
          question: userText,
          answer,
          history: messages,
          role: userRole,
        })
        .catch((e) =>
          console.warn("No se pudo guardar el chat", e?.message || e),
        );
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Error contactando al servicio de AI." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function parseSteps(text: string): string[] {
    // Busca sección 'Pasos sugeridos:' y extrae líneas numeradas
    const marker = "Pasos sugeridos:";
    const recursosMarker = "Recursos:";
    let pasosText = null;

    if (text.includes(marker)) {
      const after = text.split(marker)[1];
      pasosText = after.split(recursosMarker)[0];
    }

    if (!pasosText) return [];
    // dividir por números '1.' '2.' etc.
    const parts = pasosText
      .split(/\d+\./)
      .map((p) => p.trim())
      .filter(Boolean);
    return parts;
  }

  function renderAssistantMessage(text: string) {
    const marker = "Pasos sugeridos:";
    const recursosMarker = "Recursos:";
    let intro = text;
    let pasos: string[] = [];
    let recursos: string[] = [];

    if (text.includes(marker)) {
      const [before, after] = text.split(marker);
      intro = before.trim();
      if (after.includes(recursosMarker)) {
        const [p, r] = after.split(recursosMarker);
        pasos = parseSteps(text);
        recursos = r
          .split(/[-\n]/)
          .map((s) => s.replace(/\s*-\s*/, "").trim())
          .filter(Boolean);
      } else {
        pasos = parseSteps(text);
      }
    } else if (text.includes(recursosMarker)) {
      const [before, after] = text.split(recursosMarker);
      intro = before.trim();
      recursos = after
        .split(/[-\n]/)
        .map((s) => s.replace(/\s*-\s*/, "").trim())
        .filter(Boolean);
    }

    return (
      <div className="prose text-sm">
        {intro && <p className="mb-2">{intro}</p>}
        {pasos && pasos.length > 0 && (
          <div className="mb-2">
            <strong className="block">Pasos sugeridos:</strong>
            <ol className="pl-5 list-decimal text-sm">
              {pasos.map((p, i) => (
                <li key={i} className="mb-1">
                  {p}
                </li>
              ))}
            </ol>
          </div>
        )}
        {recursos && recursos.length > 0 && (
          <div className="mb-2">
            <strong className="block">Recursos:</strong>
            <ul className="pl-5 list-disc text-sm">
              {recursos.map((r, i) => (
                <li key={i} className="mb-1 text-blue-700">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
        {text.includes("¿Querés que") && pasos && pasos.length > 0 && (
          <div className="mt-2">
            <button
              onClick={() => {
                const ps = pasos.map((s) => s.replace(/\n/g, " ").trim());
                setGuideSteps(ps);
                // scroll la lista para mostrar la guía
                setTimeout(
                  () =>
                    listRef.current?.scrollTo({ top: 0, behavior: "smooth" }),
                  100,
                );
              }}
              className="mt-1 px-3 py-1 bg-primary hover:bg-primary-dark text-white rounded-md text-sm"
            >
              Mostrar pasos en pantalla
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg flex items-center justify-center"
          aria-label="Abrir ayuda"
        >
          <Bot />
        </button>
      </div>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[100vh] max-h-[70vh] bg-white dark:bg-dark-surface border-primary border-2 rounded-xl shadow-xl shadow-primary flex flex-col overflow-hidden">
          <div className="p-3 border-b flex items-center justify-between">
            <strong>Asistente Axio</strong>
            <button onClick={() => setOpen(false)} className="text-gray-500">
              ✕
            </button>
          </div>

          <div className="p-3 overflow-y-auto flex-1 space-y-3">
            {guideSteps && (
              <div className="p-3 mb-2 bg-blue-100 border-l-4 border-blue-400 rounded">
                <strong className="block mb-2">Guía rápida</strong>
                <ol className="pl-5 list-decimal text-sm">
                  {guideSteps.map((s, idx) => (
                    <li key={idx} className="mb-1">
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "text-right" : "text-left"}
              >
                {m.role === "assistant" ? (
                  <div className="inline-block bg-gray-100 px-3 py-2 rounded-md max-w-full">
                    {renderAssistantMessage(m.text)}
                  </div>
                ) : (
                  <div className="inline-block bg-primary-lighter text-gray-900 px-3 py-1 rounded-md">
                    {m.text}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-3 border-t space-y-2">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
                placeholder="Escribí tu pregunta..."
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <button
                onClick={send}
                disabled={loading}
                className="px-3 py-2 bg-primary hover:bg-primary-dark text-white rounded-md"
              >
                {loading ? "..." : "Enviar"}
              </button>
            </div>

            <div className="flex gap-2 text-xs">
              {quickSuggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setInput(s);
                  }}
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
