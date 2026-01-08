// SERVICES / geminiCoach.ts
// LIMPIEZA PROFUNDA: SDK Eliminado.
// TODO: Conectar con backend n8n.
import { SimulationParams, DailyData } from "../types";

interface CoachInput {
    simulationParams: SimulationParams;
    dailyData: DailyData[];
}

export const analyzeSimulation = async (input: CoachInput): Promise<string> => {
    console.log("⚠️ [MOCK MODE] analyzeSimulation llamado. Esperando integración con n8n.");
    return `[MOCK_COACH] Análisis de simulación simulado.
    - ROAS: ${((input.dailyData.reduce((acc, d) => acc + d.revenue, 0)) / (input.dailyData.reduce((acc, d) => acc + d.spend, 0) || 1)).toFixed(2)}x
    (La IA está desactivada temporalmente mientras migramos a n8n).`;
};
