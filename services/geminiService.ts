// SERVICES / geminiService.ts
// LIMPIEZA PROFUNDA: SDK Eliminado para evitar crashes en producción.
// TODO: Conectar con backend n8n.

export const generateAdScript = async (
  productName: string,
  targetAudience: string,
  keyBenefits: string,
  platform: string,
  strategy: string
): Promise<string> => {
  console.log("⚠️ [MOCK MODE] generateAdScript llamado. Esperando integración con n8n.");
  return `[MOCK_RESULT] Guion para ${productName}.\n(La IA está desactivada temporalmente mientras migramos a n8n).`;
};

export const performResearch = async (context: string): Promise<string> => {
  console.log("⚠️ [MOCK MODE] performResearch llamado. Esperando integración con n8n.");
  return `[MOCK_RESULT] Investigación de mercado simulada.\n(La IA está desactivada temporalmente mientras migramos a n8n).`;
};

export const auditLandingPageContent = async (lpContent: string): Promise<string> => {
  console.log("⚠️ [MOCK MODE] auditLandingPageContent llamado. Esperando integración con n8n.");
  return `[MOCK_RESULT] Auditoría simulada.\n(La IA está desactivada temporalmente mientras migramos a n8n).`;
}

export const chatWithAgent = async (history: { role: string, content: string }[], newMessage: string): Promise<string> => {
  console.log("⚠️ [MOCK MODE] chatWithAgent llamado. Esperando integración con n8n.");
  return "Hola. Estoy en modo de mantenimiento mientras nos movemos a un cerebro más potente en n8n. ¡Vuelve pronto!";
};