import { GoogleGenAI } from "@google/genai";


const apiKey = import.meta.env.VITE_GEMINI_API_KEY ||
  import.meta.env.VITE_API_KEY ||
  import.meta.env.VITE_GOOGLE_API_KEY;
// Note: In a real production app, ensure this is handled securely. 
// For this demo, we assume the environment variable is injected.
if (!apiKey) {
  const errorMsg = "CRITICAL CONFIGURATION ERROR: API Key is missing. Please set VITE_GEMINI_API_KEY in your .env file.";
  console.error(errorMsg);
  // Fail fast behavior is vital for security
  throw new Error(errorMsg);
}

const ai = new GoogleGenAI({ apiKey });


export const generateAdScript = async (
  productName: string,
  targetAudience: string,
  keyBenefits: string,
  platform: string,
  strategy: string
): Promise<string> => {
  // API Key presence is guaranteed by module-level check

  try {
    const prompt = `
      Actúa como un director creativo de clase mundial. Crea un guion de anuncio de alta conversión para el siguiente producto (responde en español):
      
      Producto: ${productName}
      Público Objetivo: ${targetAudience}
      Beneficios Clave: ${keyBenefits}
      Estrategia Creativa: ${strategy}
      Plataforma: ${platform}
      
      Formato de salida:
      - Gancho/Hook (0-3s): [Visual] + [Audio]
      - Problema/Agitación: [Visual] + [Audio]
      - Solución/Intro Producto: [Visual] + [Audio]
      - Prueba Social/Autoridad: [Visual] + [Audio]
      - Llamada a la Acción (CTA): [Visual] + [Audio]
      
      Mantenlo impactante, atractivo y adecuado para la cultura de la plataforma elegida.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    return response.text || "No se generó contenido.";
  } catch (error) {
    console.error("Error generating script:", error);
    return "Error al generar el guion. Por favor intenta de nuevo.";
  }
};

export const performResearch = async (context: string): Promise<string> => {

  try {
    const prompt = `
      Actúa como un investigador de mercado experto. Analiza el siguiente texto (reseñas, competidores, artículos, etc.) y extrae insights profundos para marketing (responde en español):
      
      1. 🚩 Puntos de Dolor (Pain Points): Qué frustra a los usuarios.
      2. 🎯 Deseos Profundos: Qué es lo que realmente quieren lograr.
      3. 🗣️ Voz del Cliente (VOC): Frases exactas y lenguaje que usan.
      4. 🎣 Ángulos de Marketing: Ideas para ganchos y creativos.
      5. 💡 Oportunidades: Brechas en el mercado o debilidades de la competencia detectadas.
      
      Texto a analizar:
      ${context}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    return response.text || "No se generó análisis.";
  } catch (error) {
    console.error("Error performing research:", error);
    return "Error al realizar la investigación.";
  }
};

export const auditLandingPageContent = async (lpContent: string): Promise<string> => {

  try {
    const prompt = `
       Actúa como un experto en CRO (Optimización de Tasa de Conversión). Audita el siguiente contenido de texto de una landing page (responde en español):
       
       "${lpContent.substring(0, 5000)}"
       
       Provee:
       1. Puntuación sobre 10 en claridad.
       2. 3 mejoras específicas para el titular y el CTA.
       3. Identifica elementos de persuasión faltantes (escasez, prueba social, etc.).
     `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    return response.text || "No se generó auditoría.";
  } catch (error) {
    console.error("Error auditing LP:", error);
    return "Error al auditar la landing page.";
  }
}

export const chatWithAgent = async (history: { role: string, content: string }[], newMessage: string): Promise<string> => {


  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: history.map(h => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }]
      }))
    });

    const result = await chat.sendMessage({
      message: [{ text: newMessage }]
    });
    return result.text || "Sin respuesta";
  } catch (error) {
    console.error("Error in chat:", error);
    return "Lo siento, hubo un error al procesar tu mensaje.";
  }
};