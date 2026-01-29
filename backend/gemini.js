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


import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateSummary(text) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-pro" // ✅ WORKING MODEL
    });

    const prompt = `
Summarize the following content into short, clear bullet points.
Keep it simple and easy to understand.

CONTENT:
${text.slice(0, 12000)}
`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("❌ Gemini Error FULL:", error);
    throw new Error("Gemini API failed");
  }
}


