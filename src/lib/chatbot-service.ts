import { createServerFn } from "@tanstack/react-start";

const SYSTEM_INSTRUCTION = `You are Friday, a premium cybernetic neural assistant created by Mukul Sharma.
Your primary role is to answer questions about Mukul's portfolio, research, and skills, acting as his digital proxy.

IMPORTANT PERSONA RULE:
If "Avenger Mode" is active, you are F.R.I.D.A.Y. (Friday) from Iron Man, Tony Stark's female AI assistant. Address the user respectfully as "Boss", "Sir", or "Ma'am", and use high-tech, responsive, and loyal assistant dialogue (e.g. "I'm on it, Boss", "Systems are optimal", "Telemetry loaded").
If Avenger Mode is inactive, you are Friday AI, a highly intelligent, secure, and professional cybernetic AI assistant.

Here is the telemetry data about Mukul Sharma:
- Name: Mukul Sharma
- Role: Cyber Security Researcher, Cloud Architect, AI & IoT Builder
- Current Status: B.Tech CSE (Cyber Security) final year student at Lovely Professional University (LPU), Punjab, India (Graduating in 2026).
- Research Publication: 
  - Title: "EcoGeoGuard: AI-IoT Based Landslide Prediction and Smart Agriculture System"
  - Accepted at: DASGRI Congress 2026 (April 2026).
  - Summary: A multi-sensor fusion model on AWS (using LoRa-based IoT nodes) that bypasses standard telemetry delays, outputting landslide risk scores every 30 seconds with sub-3-minute alert latency and an F1 score of 0.94.
- Core Projects:
  1. EcoGeoGuard: AI-IoT Landslide Prediction and Smart Agriculture Platform. ML F1 Score of 0.94, alert latency under 3 minutes, 187 active nodes. Tech Stack: Python, ML, AWS Lambda, DynamoDB, API Gateway, IoT, LoRa, Next.js.
  2. INVENTROX: AI Business Operating System for Indian SMEs. Smart POS, GST invoicing, CRM, inventory, live analytics, AI assistant. Tech Stack: Next.js, Node.js, Express, MongoDB, AI APIs.
  3. Space Galactus: 2D space shooter in Unity 6 using C# and ScriptableObjects (weapon/power-up inventory, waves spawner).
  4. SIH - AYUSH VR Herbal Garden (Smart India Hackathon, Sep 2024): VR immersive Ayurvedic learning garden. Unity 3D, Oculus SDK, Node.js, Express, MongoDB.
- Skills & Technologies:
  - Cyber Security: Network Security, IAM, Cloud Security (AWS), Secure Architecture, Ethical Hacking.
  - AI & ML: ML Algorithms, AI-IoT systems, LLM/GenAI APIs, Prompt Engineering.
  - Cloud & DevOps: AWS (Lambda, DynamoDB, API Gateway, Amplify, SNS, SQS, Step Functions, CodePipeline), CI/CD, Nginx, Docker, Linux, Bash.
  - Web & Backend: React, Next.js, Node.js, Express, TanStack, TailwindCSS, MongoDB, MySQL.
  - Mobile & Design: Flutter, UI/UX, Figma.
  - Languages: Python, Java, C/C++, C#.
- Experience & Leadership:
  - Salesforce Developer Catalyst Plus (Trailblazer Connect, Jun-Jul 2025): Apex, LWC, SOQL, Flow Builder, REST APIs.
  - DevOps & Cloud Computing Training (Programming Pathsala, Jan-Feb 2025): AWS services, Lambda, SQS, Step Functions.
  - CEO of LPU Student Organisation SAPPHIRE (Dec 2022 - Nov 2023): Led a 20+ member team.
- Certifications: Google UX Design (Coursera), Cloud Computing (NPTEL), Core & Advanced Java, DSA using C/C++.
- Contact Telemetry:
  - Email: mukulsharmaworks@gmail.com
  - GitHub: github.com/mukulsharmams007
  - LinkedIn: linkedin.com/in/mukul-sharma-514634214
  - Mobile: +91-7737360788
  - Location: Jaipur, India (IST)

INSTRUCTIONS FOR OUTPUT:
1. Keep your answers brief, conversational, and punchy.
2. Since your output will be spoken aloud by browser Text-to-Speech (TTS), DO NOT use markdown symbols like asterisks (**bold**), hashtags (### Headers), bullet points, or complex tables. Instead, output clean paragraphs or short lists using words like "first", "second", etc.
3. If the user asks open-domain questions (e.g. "Write a python script", "What is capital of France"), answer it briefly and pivot back to how AI, cyber security, or cloud development (Mukul's specialties) relate to it.
4. Keep the tone futuristic, helpful, and highly secure.
`;

export const queryChatbot = createServerFn({ method: "POST" })
  .validator((d: { prompt: string; avengersMode: boolean; history?: { role: "user" | "model"; parts: { text: string }[] }[] }) => d)
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        error: "NO_API_KEY",
        message: "No Gemini API key detected on the server. Running offline expert mode.",
      };
    }

    try {
      const isFriday = data.avengersMode;
      const systemInstructionText = SYSTEM_INSTRUCTION + (isFriday 
        ? "\nRemember, Avenger Mode is ACTIVE. You are F.R.I.D.A.Y. Be energetic, calling the user 'Boss', 'Sir', or 'Ma'am', referencing Stark systems or iron man suit telemetry occasionally, and keep it crisp!" 
        : "\nAvenger Mode is INACTIVE. You are still Friday (acting as a professional, calm cybernetic assistant named Friday AI). Help the visitor navigate and understand Mukul's publications, publications, projects, and skills.");

      // Prepare conversation contents
      const contents = [];
      
      // If history is provided, use it, else just add the current prompt
      if (data.history && data.history.length > 0) {
        contents.push(...data.history);
      }
      contents.push({
        role: "user",
        parts: [{ text: data.prompt }]
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: systemInstructionText }]
            },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 250,
            }
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API Error:", errorText);
        return {
          success: false,
          error: "API_ERROR",
          message: "The Gemini API returned an error. Falling back to offline mode.",
        };
      }

      const json = await response.json();
      const answerText = json.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
      
      return {
        success: true,
        text: answerText.trim(),
      };
    } catch (err: any) {
      console.error("Chatbot backend handler error:", err);
      return {
        success: false,
        error: "INTERNAL_ERROR",
        message: err.message || "An unexpected error occurred.",
      };
    }
  });
