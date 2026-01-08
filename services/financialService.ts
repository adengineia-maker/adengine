import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants/financialConstants";
import * as XLSX from 'xlsx';

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
    if (!aiClient) {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY ||
            import.meta.env.VITE_API_KEY ||
            import.meta.env.VITE_GOOGLE_API_KEY;

        if (!apiKey) {
            const errorMsg = "CRITICAL CONFIGURATION ERROR: API Key is missing. Please set VITE_GEMINI_API_KEY in your .env file.";
            console.error(errorMsg);
            throw new Error(errorMsg);
        }
        aiClient = new GoogleGenAI({ apiKey: apiKey });
    }
    return aiClient;
};

// Helper to read file as Base64 (for images/PDF)
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            const base64Data = base64String.split(',')[1];
            resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// Helper to read file as Text (for CSV)
const fileToText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
    });
};

// Helper to read Excel as CSV string
const excelToCSV = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                // Read the first sheet
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                // Convert to CSV
                const csv = XLSX.utils.sheet_to_csv(worksheet);
                resolve(csv);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
};

export const sendMessageToGemini = async (
    history: { role: 'user' | 'model'; parts: { text: string }[] }[],
    newMessage: string,
    attachments: File[] = []
) => {
    const client = getClient();
    // Using Gemini 3.0 Pro Preview for cutting-edge analysis
    const model = 'gemini-3-pro-preview';

    const chat = client.chats.create({
        model: model,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.2, // Low temperature for deterministic financial analysis
            topK: 40,
        },
        history: history,
    });

    const requestParts: any[] = [];
    let combinedTextContext = newMessage;

    // Process attachments
    if (attachments && attachments.length > 0) {
        let fileContextAccumulator = "";

        for (const attachment of attachments) {
            const isImage = attachment.type.startsWith('image/');
            const isPDF = attachment.type === 'application/pdf';
            const isExcel = attachment.name.endsWith('.xlsx') || attachment.name.endsWith('.xls') || attachment.type.includes('spreadsheet');
            const isCSV = attachment.type === 'text/csv' || attachment.name.endsWith('.csv');

            if (isImage || isPDF) {
                // Add native parts for images/PDFs
                const base64Data = await fileToBase64(attachment);
                requestParts.push({
                    inlineData: {
                        mimeType: attachment.type,
                        data: base64Data
                    }
                });
            } else if (isExcel || isCSV) {
                // Convert data files to text context
                let fileContent = "";
                if (isExcel) {
                    fileContent = await excelToCSV(attachment);
                } else {
                    fileContent = await fileToText(attachment);
                }
                fileContextAccumulator += `\n\n--- CONTENIDO DEL ARCHIVO: ${attachment.name} ---\n${fileContent}\n-----------------------------------------------`;
            } else {
                // Fallback for text files
                try {
                    const textContent = await fileToText(attachment);
                    fileContextAccumulator += `\n\n--- CONTENIDO DEL ARCHIVO: ${attachment.name} ---\n${textContent}\n-----------------------------------------------`;
                } catch (e) {
                    console.warn(`Could not read file ${attachment.name} as text.`);
                }
            }
        }

        // Append all file text context to the message
        if (fileContextAccumulator) {
            combinedTextContext += `\n\nINFORMACIÓN ADJUNTA DE ARCHIVOS DE DATOS:${fileContextAccumulator}`;
        }
    }

    // Add the text part (User message + Data Context)
    requestParts.push({ text: combinedTextContext });

    try {
        const result = await chat.sendMessage({ message: requestParts });
        const responseText = result.text || "No pude generar una respuesta.";

        // Extract JSON if present
        const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
        let parsedData = null;

        if (jsonMatch && jsonMatch[1]) {
            try {
                parsedData = JSON.parse(jsonMatch[1]);
            } catch (e) {
                console.error("Failed to parse JSON from Gemini response", e);
            }
        }

        // Clean text response 
        const cleanText = responseText.replace(/```json\s*[\s\S]*?\s*```/, '').trim();

        return {
            text: cleanText || "Datos analizados correctamente.",
            data: parsedData
        };

    } catch (error) {
        console.error("Error calling Gemini:", error);
        throw error;
    }
};
