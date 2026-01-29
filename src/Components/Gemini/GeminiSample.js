// import {
//   GoogleGenerativeAI,
//   HarmCategory,
//   HarmBlockThreshold,
// } from "@google/generative-ai";

// const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey);

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash", // ✅ FIX
// });

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 64,
//   maxOutputTokens: 2048, 
// };

// export async function run(text) {
//   try {
//     const chatSession = model.startChat({
//       generationConfig,
//       history: [],
//     });

//     const result = await chatSession.sendMessage(
//       text +
//         " Make short and important notes or points. Also add a few extra important points to make it very easy to understand."
//     );

//     return result.response.text();
//   } catch (error) {
//     console.error("Gemini Error:", error);
//     return "Error generating response.";
//   }
// }
