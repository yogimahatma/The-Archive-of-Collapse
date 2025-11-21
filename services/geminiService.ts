import { GoogleGenAI } from "@google/genai";
import { CaseFormData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateArchiveStory = async (formData: CaseFormData): Promise<ReadableStream<string>> => {
  // Use gemini-3-pro-preview for maximum context window and reasoning capability
  const model = 'gemini-3-pro-preview';
  
  const prompt = `
    You are an archivist compiling a forbidden case file.
    
    TASK: Write a documentary-style horror story based on these sealed records.
    
    Target Location: ${formData.location}
    Time Period (Origin): ${formData.era}
    Catalyst for Isolation: ${formData.catalyst}
    
    OUTPUT LANGUAGE: ${formData.language} (The entire story must be written in ${formData.language}).

    MANDATORY THEMATIC REQUIREMENTS:
    1. Tone: Documentary YouTube horror narration style. Use "We" or second-person plural. Serious, investigative, melancholic.
    2. Intro: Must explicitly state: "This is not folklore. This is not legend. This happened." near the beginning.
    3. Theme: Obsession with a "pure bloodline" leading to extreme genetic isolation/inbreeding (described clinically, not erotically).
    4. Theme: Progressive physical and biological abnormalities.
    5. Theme: Government/Institutional cover-up.
    6. Theme: Multigenerational tragedy.
    7. Theme: Children as victims.

    CRITICAL LENGTH INSTRUCTION (MINIMUM 4000 WORDS):
    - THIS IS A STRICT REQUIREMENT. The total output must exceed 4000 words.
    - Do not summarize. Expand every single scene. Describe the texture of the wood, the specific smell of the rot, the sound of the wind, the exact medical details of the deformities.
    - Treat this as a complete novella. If you feel you are moving too fast, STOP and describe the environment.

    STRUCTURE & FORMATTING:
    - You MUST divide the story into exactly 8 sections.
    - You MUST use the delimiter "|||SECTION|||" between each section.
    - Do NOT use subheadings (like ## Title) within the text blocks. Just pure narrative.
    - Follow the word count goals for each section below strictly to hit the 4000 word total.

    SECTION BREAKDOWN & GOALS:

    1. Opening (Target: 400+ words)
       - Describe the location (${formData.location}) as it stands today. The rot, the silence.
       - End this section with |||SECTION|||

    2. First generations (Target: 500+ words)
       - How the clan formed in ${formData.era}.
       - Detailed exploration of the Catalyst: ${formData.catalyst}.
       - Why they locked the gates.
       - End this section with |||SECTION|||

    3. Rise of the closed bloodline (Target: 600+ words)
       - The first few decades. Marriages within the family.
       - The implementation of the "Rules".
       - The first subtle genetic defects appearing (polydactyly, pale skin).
       - End this section with |||SECTION|||

    4. Descent (Target: 1200+ words) - ***MOST IMPORTANT SECTION***
       - This is the horror core. Spend a long time here.
       - Increasingly severe abnormalities. Describe specific characters/family members and their deformities.
       - Social and cognitive decline. The loss of language.
       - Growing fear and superstition.
       - End this section with |||SECTION|||

    5. Intervention (Target: 500+ words)
       - The arrival of outsiders (doctor, census taker, or lost hiker).
       - What they saw. The shock.
       - The violence or the tragic interaction.
       - End this section with |||SECTION|||

    6. Cover-up (Target: 400+ words)
       - Federal or institutional suppression.
       - Men in suits arriving. burning the archives.
       - Relocation of survivors to black-site hospitals.
       - End this section with |||SECTION|||

    7. Aftermath (Target: 300+ words)
       - The land reclaimed by nature.
       - Only farmhouse/cemetery/symbols remain.
       - The silence of the valley now.
       - End this section with |||SECTION|||

    8. Closing chill (Target: 200+ words)
       - Hint that one or more descendants might still be alive.
       - They are out there, carrying the bloodline.
       - Final haunting sentence.
       - End this section with |||SECTION|||
  `;

  try {
    const responseStream = await ai.models.generateContentStream({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are an obsessive horror novelist and archivist who refuses to write short summaries. You are paid by the word. You must write EXTREMELY LONG, detailed, slow-burn descriptions.",
        temperature: 0.8, // Slightly lowered to ensure it sticks to the length instructions without getting too derailed
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192, // Maximum allowed for high word count
      }
    });

    return new ReadableStream({
      async start(controller) {
        for await (const chunk of responseStream) {
          const text = chunk.text;
          if (text) {
            controller.enqueue(text);
          }
        }
        controller.close();
      }
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to unearth the story. The archives are sealed.");
  }
};
