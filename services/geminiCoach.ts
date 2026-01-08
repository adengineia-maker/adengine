import { GoogleGenerativeAI } from "@google/generative-ai";
import { SimulationParams, SimulationTotals, DailyData } from "../types";

// Initialize Gemini
const apiKey = import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env.VITE_API_KEY ||
    import.meta.env.VITE_GOOGLE_API_KEY;

if (!apiKey) {
    const errorMsg = "CRITICAL CONFIGURATION ERROR: API Key is missing. Please set VITE_GEMINI_API_KEY in your .env file.";
    console.error(errorMsg);
    throw new Error(errorMsg);
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });

interface CoachInput {
    simulationParams: SimulationParams;
    dailyData: DailyData[];
}

export const analyzeSimulation = async (input: CoachInput): Promise<string> => {


    try {
        // Calculate totals for the prompt
        const totalSpend = input.dailyData.reduce((acc, day) => acc + day.spend, 0);
        const totalRevenue = input.dailyData.reduce((acc, day) => acc + day.revenue, 0);
        const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
        const conversions = input.dailyData.reduce((acc, day) => acc + day.conversions, 0);
        const cpa = conversions > 0 ? totalSpend / conversions : 0;

        const systemPrompt = `
      Actúa como un Estratega Senior de Growth Marketing. Tu tarea es analizar los datos de una simulación de Meta Ads.

      DATOS DE LA SIMULACIÓN:
      - Presupuesto Diario: $${input.simulationParams.budget}
      - CPM: $${input.simulationParams.cpm}
      - CTR: ${input.simulationParams.ctr}%
      - CVR (Conversión): ${input.simulationParams.cvr}%
      - AOV (Ticket Promedio): $${input.simulationParams.aov}
      
      RESULTADOS OBTENIDOS:
      - Gasto Total: $${totalSpend.toFixed(2)}
      - Ingresos Totales: $${totalRevenue.toFixed(2)}
      - ROAS: ${roas.toFixed(2)}x
      - CPA: $${cpa.toFixed(2)}
      - Conversiones: ${conversions}

      INSTRUCCIONES DE ANÁLISIS:
      1. Si el ROAS es bajo (< 2), DEBES sugerir cambios específicos en el CPM (buscar audiencias más baratas) o CTR (mejorar creativos).
      2. Si el ROAS es alto (> 4), sugiere escalar el presupuesto.
      3. Proporciona 3 consejos tácticos breves y accionables.
      4. Sé alentador pero realista.

      FORMATO DE RESPUESTA (Markdown):
      - Usa **negritas** para conceptos clave.
      - Usa listas para los consejos.
      - Mantén la respuesta concisa.
    `;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error calling Gemini Coach:", error);
        return "❌ Error al conectar con el Coach IA. Por favor verifica tu conexión o intenta de nuevo.";
    }
};
