import { Section, TerminalCard } from "./Section";
import { Github, Linkedin, Mail, Phone, MapPin, Printer, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Resume() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Section id="resume-page" label="resume.doc" title="> cat resume.md">
      {/* Interactive Controls & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 no-print border-b border-border/40 pb-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-accent transition"
        >
          <ArrowLeft size={14} /> [back to cockpit]
        </Link>
        <div className="flex items-center gap-3">
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded border border-border bg-white/5 hover:border-foreground hover:bg-white/10 transition font-mono text-xs tracking-wider text-foreground"
          >
            [DOWNLOAD ORIGINAL PDF]
          </a>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded border border-accent bg-accent/10 text-accent hover:bg-accent hover:text-background transition font-mono text-xs tracking-wider cursor-pointer"
          >
            <Printer size={14} /> [PRINT OR SAVE AS PDF]
          </button>
        </div>
      </div>

      {/* Main Resume Container */}
      <div className="resume-print-container font-mono text-sm leading-relaxed max-w-4xl mx-auto space-y-8 print:space-y-6 print:p-0">
        {/* Header Block */}
        <header className="border-b border-border/60 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 print:pb-4 print:border-black">
          <div>
            <h1 className="font-serif-display text-4xl sm:text-5xl text-foreground font-semibold tracking-tight print:text-black print:text-3xl">
              Mukul Sharma
            </h1>
            <p className="text-accent font-mono text-xs tracking-[0.2em] uppercase mt-2 print:text-black print:font-bold">
              Cyber Security · Cloud Architect · AI/IoT Systems
            </p>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground print:text-black print:text-[9pt]">
            <a
              href="mailto:mukulsharmaworks@gmail.com"
              className="flex items-center gap-2 hover:text-accent transition print:border-none"
            >
              <Mail size={12} className="print:hidden" /> mukulsharmaworks@gmail.com
            </a>
            <div className="flex items-center gap-2 print:border-none">
              <Phone size={12} className="print:hidden" /> +91-7737360788
            </div>
            <a
              href="https://linkedin.com/in/mukul-sharma-514634214"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-accent transition print:border-none"
            >
              <Linkedin size={12} className="print:hidden" /> linkedin.com/in/mukul-sharma-514634214
            </a>
            <a
              href="https://github.com/MukulS07"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-accent transition print:border-none"
            >
              <Github size={12} className="print:hidden" /> github.com/MukulS07
            </a>
          </div>
        </header>

        {/* 1. Skills Grid */}
        <section className="resume-section">
          <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-accent border-b border-border/30 pb-2 mb-4 print:text-black print:border-black print:font-bold print:text-[10pt]">
            // SKILLS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-x-8 print:gap-y-2">
            <div>
              <ul className="space-y-1.5 text-xs text-muted-foreground print:text-black print:text-[9pt]">
                <li>
                  <strong className="text-foreground print:text-black">Cyber Security:</strong>{" "}
                  Network Security, IAM, Cloud Security (AWS), Secure Architecture, Ethical Hacking
                  (learning)
                </li>
                <li>
                  <strong className="text-foreground print:text-black">AI & ML:</strong> ML
                  Algorithms, AI-IoT, LLM/GenAI APIs, Prompt Engineering
                </li>
                <li>
                  <strong className="text-foreground print:text-black">Mobile & UX:</strong> Flutter
                  (AI-integrated apps), UI/UX Design, Figma
                </li>
                <li>
                  <strong className="text-foreground print:text-black">Languages:</strong> Python
                  (primary), Java, C, C++
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-1.5 text-xs text-muted-foreground print:text-black print:text-[9pt]">
                <li>
                  <strong className="text-foreground print:text-black">Cloud & DevOps:</strong> AWS
                  (Lambda, DynamoDB, API Gateway, Amplify, SNS, SQS, Step Functions, CodePipeline,
                  CloudWatch, IAM), CI/CD, NGINX
                </li>
                <li>
                  <strong className="text-foreground print:text-black">Web / Backend:</strong>{" "}
                  Node.js, React, Next.js, Express.js, MongoDB Atlas, MySQL
                </li>
                <li>
                  <strong className="text-foreground print:text-black">Tools:</strong> Git, GitHub,
                  VS Code, IntelliJ, Salesforce CLI, Unity 3D, Blender
                </li>
                <li>
                  <strong className="text-foreground print:text-black">Soft Skills:</strong>{" "}
                  Problem-Solving, Team Leadership, Project Management, Adaptability, Logical
                  Thinking
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2. Projects */}
        <section className="resume-section">
          <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-accent border-b border-border/30 pb-2 mb-4 print:text-black print:border-black print:font-bold print:text-[10pt]">
            // PROJECTS
          </h2>
          <div className="space-y-4 print:space-y-3">
            {/* Project 1 */}
            <div className="border border-border/35 p-4 rounded bg-black/10 hover:border-accent/40 transition print:border-none print:p-0 print:bg-transparent">
              <div className="flex justify-between items-start flex-wrap gap-1">
                <h3 className="font-sans text-base font-semibold text-foreground print:text-black print:text-[10pt]">
                  Inventrox — AI Inventory & Purchase Management System
                </h3>
                <span className="text-xs text-accent print:text-black print:font-normal">
                  Jun 2026 – Present
                </span>
              </div>
              <p className="text-dim text-[11px] mt-0.5 print:text-black print:text-[9pt] print:italic">
                Personal Project
              </p>
              <ul className="list-disc list-inside text-xs text-muted-foreground mt-2 space-y-1 print:text-black print:text-[9pt]">
                <li>
                  Developed a full-stack AI-powered inventory management platform for SMEs featuring
                  inventory tracking, purchase management, supplier records, and analytics
                  dashboards.
                </li>
                <li>
                  Integrated AI-assisted demand prediction, smart stock alerts, automated service
                  reminders, and weather-aware notifications using cloud APIs.
                </li>
                <li>
                  Implemented secure authentication, responsive UI, REST APIs, and scalable backend
                  architecture with cloud deployment support.
                </li>
              </ul>
              <div className="mt-2 text-xs text-muted-foreground print:text-black print:text-[9pt]">
                <strong className="text-accent print:text-black">// Tech:</strong> Next.js, Node.js,
                Express.js, MongoDB Atlas, Python, AWS, Firebase, REST APIs
              </div>
            </div>

            {/* Project 2 */}
            <div className="border border-border/35 p-4 rounded bg-black/10 hover:border-accent/40 transition print:border-none print:p-0 print:bg-transparent">
              <div className="flex justify-between items-start flex-wrap gap-1">
                <h3 className="font-sans text-base font-semibold text-foreground print:text-black print:text-[10pt]">
                  EcoGeoGuard Website — AI-Powered Disaster Prediction & Smart Farming Platform
                </h3>
                <span className="text-xs text-accent print:text-black print:font-normal">
                  Apr 2026 – Present
                </span>
              </div>
              <p className="text-dim text-[11px] mt-0.5 print:text-black print:text-[9pt] print:italic">
                Academic Project
              </p>
              <ul className="list-disc list-inside text-xs text-muted-foreground mt-2 space-y-1 print:text-black print:text-[9pt]">
                <li>
                  Designed and developed a full-stack web platform that delivers AI-powered
                  landslide risk prediction, smart farming insights, real-time weather updates, and
                  government scheme recommendations for farmers and local communities.
                </li>
                <li>
                  Built secure authentication, interactive dashboards, AI chatbot assistance, live
                  sensor data visualization, and cloud-based APIs to provide actionable
                  recommendations and emergency alerts.
                </li>
                <li>
                  Developed a scalable cloud architecture with responsive UI, real-time data
                  processing, and modular backend services to support future IoT device integration
                  and predictive analytics.
                </li>
              </ul>
              <div className="mt-2 text-xs text-muted-foreground print:text-black print:text-[9pt]">
                <strong className="text-accent print:text-black">// Tech:</strong> Next.js, Node.js,
                Express.js, MongoDB Atlas, Python, AWS, Firebase, REST APIs, AI/ML
              </div>
            </div>

            {/* Force page break for printing before the third project to split pages evenly like the PDF */}
            <div className="page-break print:hidden"></div>

            {/* Project 3 */}
            <div className="border border-border/35 p-4 rounded bg-black/10 hover:border-accent/40 transition print:border-none print:p-0 print:bg-transparent print:mt-4">
              <div className="flex justify-between items-start flex-wrap gap-1">
                <h3 className="font-sans text-base font-semibold text-foreground print:text-black print:text-[10pt]">
                  EcoGeoGuard — AI-IoT Landslide Prediction & Smart Farming
                </h3>
                <span className="text-xs text-accent print:text-black print:font-normal">
                  Dec 2025 – May 2026
                </span>
              </div>
              <p className="text-dim text-[11px] mt-0.5 print:text-black print:text-[9pt] print:italic">
                Personal Research Project
              </p>
              <ul className="list-disc list-inside text-xs text-muted-foreground mt-2 space-y-1 print:text-black print:text-[9pt]">
                <li>
                  Designed and built an end-to-end AI-IoT system that predicts landslides and
                  monitors agricultural parameters using real-time multi-sensor data fusion through
                  an ML pipeline.
                </li>
                <li>
                  Engineered real-time alert delivery via SMS, mobile app, and physical alarms;
                  handled edge computing on hardware and cloud processing on AWS (Lambda, DynamoDB,
                  API Gateway).
                </li>
                <li>
                  Research paper accepted at DASGRI Congress 2026 — first experience writing and
                  submitting a peer-reviewed paper, learning to structure experiments and results
                  clearly.
                </li>
              </ul>
              <div className="mt-2 text-xs text-muted-foreground print:text-black print:text-[9pt]">
                <strong className="text-accent print:text-black">// Tech:</strong> Python, ML
                Algorithms, AWS (Lambda, DynamoDB, API Gateway), IoT, LoRa/GSM
              </div>
            </div>

            {/* Project 4 */}
            <div className="border border-border/35 p-4 rounded bg-black/10 hover:border-accent/40 transition print:border-none print:p-0 print:bg-transparent">
              <div className="flex justify-between items-start flex-wrap gap-1">
                <h3 className="font-sans text-base font-semibold text-foreground print:text-black print:text-[10pt]">
                  Serverless Web Application on AWS
                </h3>
                <span className="text-xs text-accent print:text-black print:font-normal">
                  Feb 2025
                </span>
              </div>
              <p className="text-dim text-[11px] mt-0.5 print:text-black print:text-[9pt] print:italic">
                Personal Cloud Project
              </p>
              <ul className="list-disc list-inside text-xs text-muted-foreground mt-2 space-y-1 print:text-black print:text-[9pt]">
                <li>
                  Built a complete serverless web app from scratch — Lambda for backend logic,
                  DynamoDB for storage, Amplify for the frontend, Step Functions for workflow
                  automation.
                </li>
                <li>
                  Implemented SNS/SQS for async messaging, established a CI/CD pipeline via
                  CodePipeline, and applied IAM least-privilege policies with CloudWatch
                  observability dashboards.
                </li>
              </ul>
              <div className="mt-2 text-xs text-muted-foreground print:text-black print:text-[9pt]">
                <strong className="text-accent print:text-black">// Tech:</strong> AWS (10+
                services), Node.js, Python, Linux, NGINX, Apache
              </div>
            </div>

            {/* Project 5 */}
            <div className="border border-border/35 p-4 rounded bg-black/10 hover:border-accent/40 transition print:border-none print:p-0 print:bg-transparent">
              <div className="flex justify-between items-start flex-wrap gap-1">
                <h3 className="font-sans text-base font-semibold text-foreground print:text-black print:text-[10pt]">
                  SIH — AYUSH VR Herbal Garden
                </h3>
                <span className="text-xs text-accent print:text-black print:font-normal">
                  Sep 2024
                </span>
              </div>
              <p className="text-dim text-[11px] mt-0.5 print:text-black print:text-[9pt] print:italic">
                Smart India Hackathon
              </p>
              <ul className="list-disc list-inside text-xs text-muted-foreground mt-2 space-y-1 print:text-black print:text-[9pt]">
                <li>
                  Built an immersive VR experience for learning about medicinal plants — botanical
                  names, habitats, cultivation, and medicinal uses — as part of a hackathon team.
                </li>
                <li>
                  Developed a full Node.js/Express/MongoDB Atlas backend deployed on Vercel via
                  Next.js; learned Unity 3D and Oculus SDK under hackathon time pressure.
                </li>
              </ul>
              <div className="mt-2 text-xs text-muted-foreground print:text-black print:text-[9pt]">
                <strong className="text-accent print:text-black">// Tech:</strong> Next.js, Node.js,
                Express.js, MongoDB Atlas, Unity 3D, Blender, Oculus SDK, Vercel
              </div>
            </div>
          </div>
        </section>

        {/* 3. Research Publication */}
        <section className="resume-section">
          <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-accent border-b border-border/30 pb-2 mb-4 print:text-black print:border-black print:font-bold print:text-[10pt]">
            // RESEARCH PUBLICATION
          </h2>
          <div className="border border-border/35 p-4 rounded bg-black/10 hover:border-accent/40 transition print:border-none print:p-0 print:bg-transparent">
            <div className="flex justify-between items-start flex-wrap gap-1">
              <strong className="text-foreground print:text-black print:text-[9.5pt]">
                EcoGeoGuard: AI-IoT Based Landslide Prediction and Smart Agriculture System
              </strong>
              <span className="text-xs text-accent print:text-black print:font-normal">
                April 2026
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 print:text-black print:text-[9pt]">
              Mukul Sharma et al. ·{" "}
              <span className="text-accent print:text-black">Accepted at DASGRI Congress 2026</span>
            </p>
          </div>
        </section>

        {/* 4. Training */}
        <section className="resume-section">
          <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-accent border-b border-border/30 pb-2 mb-4 print:text-black print:border-black print:font-bold print:text-[10pt]">
            // TRAINING
          </h2>
          <div className="space-y-3">
            <div className="print:border-none">
              <div className="flex justify-between items-start flex-wrap gap-1 text-xs">
                <span className="text-foreground font-semibold print:text-black print:text-[9.5pt]">
                  DevOps with Cloud Computing Using AWS Services
                </span>
                <span className="text-accent print:text-black print:font-normal">
                  Jan 2025 – Feb 2025
                </span>
              </div>
              <p className="text-dim text-[11px] print:text-black print:text-[9pt] print:italic">
                Programming Pathsala
              </p>
              <ul className="list-disc list-inside text-xs text-muted-foreground mt-1 space-y-0.5 print:text-black print:text-[9pt]">
                <li>
                  Built and deployed a serverless website hands-on using 10+ AWS services including
                  Lambda, Step Functions, DynamoDB, Amplify, SNS, SQS, CloudWatch, IAM, EventBridge,
                  and CodePipeline.
                </li>
                <li>
                  Event-driven patterns learned here — Lambda triggers, SQS queues, Step Functions —
                  directly shaped the architecture of the EcoGeoGuard cloud backend.
                </li>
              </ul>
            </div>

            <div className="print:border-none">
              <div className="flex justify-between items-start flex-wrap gap-1 text-xs">
                <span className="text-foreground font-semibold print:text-black print:text-[9.5pt]">
                  Salesforce Developer Catalyst Plus
                </span>
                <span className="text-accent print:text-black print:font-normal">
                  Jun 2025 – Jul 2025
                </span>
              </div>
              <p className="text-dim text-[11px] print:text-black print:text-[9pt] print:italic">
                Trailblazer Connect (Rank Mountaineer · 29 badges · 25225 points)
              </p>
              <ul className="list-disc list-inside text-xs text-muted-foreground mt-1 space-y-0.5 print:text-black print:text-[9pt]">
                <li>
                  Completed the full Trailmix series covering Apex programming, Lightning Web
                  Components (LWC), data modelling, and REST API integration with hands-on
                  challenges throughout.
                </li>
                <li>
                  Gained experience with declarative automation tools — Flows, Process Builder, and
                  Validation Rules — alongside the programmatic Apex development track.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 5. Certifications */}
        <section className="resume-section">
          <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-accent border-b border-border/30 pb-2 mb-4 print:text-black print:border-black print:font-bold print:text-[10pt]">
            // CERTIFICATIONS
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-muted-foreground print:text-black print:grid-cols-2 print:text-[9pt]">
            <li className="flex justify-between">
              <span>· Google UX Design — Coursera · Google</span>
              <span className="text-accent print:text-black">April 2026</span>
            </li>
            <li className="flex justify-between">
              <span>· Cloud Computing — NPTEL</span>
              <span className="text-accent print:text-black">Jul 2025 – Oct 2025</span>
            </li>
            <li className="flex justify-between">
              <span>· Core & Advanced Java — Programming Pathsala</span>
              <span className="text-accent print:text-black">Jun 2024 – Aug 2024</span>
            </li>
            <li className="flex justify-between">
              <span>· Data Structures & Algorithms using C and C++ — Udemy</span>
              <span className="text-accent print:text-black">Feb 2024 – Mar 2024</span>
            </li>
            <li className="flex justify-between">
              <span>· Design and Analysis of Algorithms — Coursera</span>
              <span className="text-accent print:text-black">Jan 2024 – May 2024</span>
            </li>
          </ul>
        </section>

        {/* 6. Position of Responsibility */}
        <section className="resume-section">
          <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-accent border-b border-border/30 pb-2 mb-4 print:text-black print:border-black print:font-bold print:text-[10pt]">
            // POSITION OF RESPONSIBILITY
          </h2>
          <div className="text-xs">
            <div className="flex justify-between items-start flex-wrap gap-1">
              <strong className="text-foreground print:text-black print:text-[9.5pt]">
                CEO of Student Organization SAPPHIRE
              </strong>
              <span className="text-accent print:text-black print:font-normal">
                Dec 2022 – Nov 2023
              </span>
            </div>
            <p className="text-muted-foreground mt-2 print:text-black print:text-[9pt]">
              Led a 20+ member student-run organisation under LPU's Department of Student
              Organisations — oversaw event planning, member management, and inter-department
              coordination. Developed leadership, communication, and organisational skills by
              managing diverse teams and representing the organisation at university-level events.
            </p>
          </div>
        </section>

        {/* 7. Education */}
        <section className="resume-section">
          <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-accent border-b border-border/30 pb-2 mb-4 print:text-black print:border-black print:font-bold print:text-[10pt]">
            // EDUCATION
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-start flex-wrap gap-1 text-xs">
              <div>
                <strong className="text-foreground print:text-black print:text-[9.5pt]">
                  Lovely Professional University
                </strong>
                <div className="text-muted-foreground print:text-black print:text-[9pt]">
                  Bachelor of Technology - Computer Science and Engineering (Cyber Security)
                </div>
              </div>
              <div className="text-right">
                <span className="text-accent print:text-black print:font-normal">
                  Aug 2022 – Present
                </span>
                <div className="text-dim text-[11px] print:text-black print:text-[9pt]">
                  Punjab, India
                </div>
              </div>
            </div>

            <div className="flex justify-between items-start flex-wrap gap-1 text-xs">
              <div>
                <strong className="text-foreground print:text-black print:text-[9.5pt]">
                  Central Academy School
                </strong>
                <div className="text-muted-foreground print:text-black print:text-[9pt]">
                  Intermediate; Percentage: 72%
                </div>
              </div>
              <div className="text-right">
                <span className="text-accent print:text-black print:font-normal">
                  April 2020 – March 2022
                </span>
                <div className="text-dim text-[11px] print:text-black print:text-[9pt]">
                  Bapu Nagar, Bhilwara
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Section>
  );
}
