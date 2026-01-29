// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export async function generateSummary(text) {
//   try {
//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash",
//     });

//     const result = await model.generateContent(
//       text +
//         " Make short and important notes or points. Also add a few extra important points to make it very easy to understand."
//     );

//     return result.response.text();
//   } catch (error) {
//     console.error("Gemini Error:", error);
//     throw new Error("Failed to generate summary");
//   }
// }


import axios from "axios";

export async function generateSummary(text) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY missing");
  }

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      {
        model: "gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant.
Summarize the given content into short, clear bullet points.
Keep language simple and easy to understand.`
          },
          {
            role: "user",
            content: text.slice(0, 6000)
          }
        ],
        temperature: 0.4,
        max_tokens: 800
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;

  } catch (error) {
    console.error(
      "❌ Gemini Summary Error:",
      error.response?.data || error.message
    );
    throw new Error("Summary generation failed");
  }
}



