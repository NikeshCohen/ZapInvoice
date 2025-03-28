"use server";

import { SYSTEM_PROMPT } from "@/constants/prompt";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

const selectedModel = google("gemini-2.0-flash-001");

export async function generateInvoiceData(userPrompt: string) {
  try {
    const prompt = `${SYSTEM_PROMPT}

Based on this context: ${userPrompt}

Generate ONLY a JSON object matching the schema. No other text.`
      .trim()
      .replace(/\n\s+/g, "\n");

    const response = await generateText({
      model: selectedModel,
      prompt,
      temperature: 0.2,
    });

    // Clean the response text
    let cleanedText = response.text;
    if (cleanedText.includes("```")) {
      cleanedText = cleanedText.replace(/```json\n?|```\n?/g, "");
    }

    // Just check if it's valid JSON
    const parsedData = JSON.parse(cleanedText);

    console.log(parsedData);

    return {
      success: true,
      data: parsedData,
    };
  } catch (error) {
    console.error("Generation error:", error);

    if (error instanceof SyntaxError) {
      return {
        success: false,
        error: "Invalid JSON generated. Please try again.",
      };
    }

    return {
      success: false,
      error: "Failed to generate invoice data. Please try again.",
    };
  }
}
