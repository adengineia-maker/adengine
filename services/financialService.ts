// SERVICES / financialService.ts
// LIMPIEZA PROFUNDA: SDK Eliminado.
// TODO: Conectar con backend n8n.

export const sendMessageToGemini = async (
    history: { role: 'user' | 'model'; parts: { text: string }[] }[],
    newMessage: string,
    attachments: File[] = []
) => {
    console.log("⚠️ [MOCK MODE] sendMessageToGemini llamado. Esperando integración con n8n.");
    console.log("Mensaje recibido:", newMessage);

    return {
        text: "[MOCK_RESULT] Análisis financiero simulado.\n(La IA está desactivada temporalmente mientras migramos a n8n).",
        data: null
    };
};
