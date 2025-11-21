
import { GoogleGenAI } from "@google/genai";
import { CaseFormData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateArchiveStory = async (formData: CaseFormData): Promise<ReadableStream<string>> => {
  // Use gemini-3-pro-preview for maximum context window and reasoning capability
  const model = 'gemini-3-pro-preview';
  
  const prompt = `
    You are an obsessive archivist and horror novelist compiling a forbidden case file.
    
    TASK: Write a documentary-style horror NOVELLA based on these sealed records.
    
    Target Location: ${formData.location}
    Time Period (Origin): ${formData.era}
    Catalyst for Isolation: ${formData.catalyst}
    
    OUTPUT LANGUAGE: ${formData.language} (The entire story must be written in ${formData.language}).

    CRITICAL INSTRUCTION: EXTREME LENGTH REQUIRED (MINIMUM 4000 WORDS)
    - The user has complained that previous versions were too short.
    - DO NOT SUMMARIZE. DO NOT SKIM OVER TIME PERIODS.
    - If 50 years pass, do not say "50 years passed." Describe the changing of the seasons, the rotting of the wood, the specific births and deaths in between.
    - You are paid by the word. The more detailed, the better.
    - Describe smells, textures, temperatures, sounds, and specific medical symptoms in exhausting detail.

    STRUCTURE & FORMATTING:
    - You MUST divide the story into exactly 8 sections.
    - You MUST use the delimiter "|||SECTION|||" between each section.
    - Do NOT use subheadings (like ## Title) within the text blocks. Just pure narrative.

    SECTION BREAKDOWN & MICRO-TASKS (Follow these to ensure length):

    1. Opening (GOAL: 500 Words)
       - Do not just describe the house. Describe the weeds choking the porch. Describe the specific type of dust on the windows.
       - Describe the silence of the valley in a way that feels claustrophobic.
       - Explicitly state: "This is not folklore. This is not legend. This happened."
       - End this section with |||SECTION|||

    2. First generations (GOAL: 600 Words)
       - Describe the arrival in ${formData.era}. The specific wagon or vehicle used.
       - Detail the Catalyst (${formData.catalyst}) not as a summary, but as a specific scene with dialogue. What exactly was said?
       - Describe the building of the farmhouse nail by nail.
       - End this section with |||SECTION|||

    3. Rise of the closed bloodline (GOAL: 700 Words)
       - Describe the first marriage within the family. The uneasy feeling of the ceremony.
       - Describe the birth of the first child with a "minor" defect (polydactyly or pale skin). Describe the parents' reaction in dialogue.
       - List the specific "Rules" of the farm.
       - End this section with |||SECTION|||

    4. Descent (GOAL: 1500 Words - THE CORE HORROR)
       - THIS MUST BE THE LONGEST SECTION.
       - Do not summarize the decline. Show us a specific dinner scene 30 years later.
       - Describe the deformities medically: elongated limbs, translucent skin, extra joints. 
       - Describe the loss of language. How do they communicate now? Grunts? Clicks?
       - Include a "Journal Entry" or written record found on site that shows their madness.
       - Describe the smell of the house.
       - End this section with |||SECTION|||

    5. Intervention (GOAL: 600 Words)
       - An outsider arrives (Census taker, doctor, or hiker). Give this character a name and backstory.
       - Describe their walk up the driveway.
       - Describe the moment they make contact. The sheer horror of what they see.
       - Describe the violence or the tragic interaction in slow motion.
       - End this section with |||SECTION|||

    6. Cover-up (GOAL: 500 Words)
       - Officials arrive. Describe their uniforms/suits.
       - Describe the process of scrubbing the house. The burning of photographs.
       - Describe the relocation of the survivors to a specific facility (e.g., "Ward 4 at St. Jude's").
       - End this section with |||SECTION|||

    7. Aftermath (GOAL: 400 Words)
       - Return to the present day.
       - Nature has reclaimed the spot. Describe the moss, the trees growing through the floorboards.
       - Describe the specific symbols left carved in the wood.
       - End this section with |||SECTION|||

    8. Closing chill (GOAL: 300 Words)
       - Reveal that the headcount didn't match the records.
       - Suggest one survivor escaped.
       - Where are they now? A crowded city? A subway station?
       - Final haunting sentence.
       - End this section with |||SECTION|||
  `;

  try {
    const responseStream = await ai.models.generateContentStream({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are a verbose, obsessive narrator who hates summarization. You describe every single detail. You never rush. Your goal is to write a masterpiece of slow-burn horror.",
        temperature: 0.85,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
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
