# 🌐 Mukul Sharma — Cyber Security · Cloud · AI/IoT Portfolio

```
=============================================================================
███╗   ███╗██╗   ██╗██╗  ██╗██╗   ██╗██╗     ██████╗  ██████╗ ██████╗ ████████╗
████╗ ████║██║   ██║██║ ██╔╝██║   ██║██║     ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝
██╔████╔██║██║   ██║█████╔╝ ██║   ██║██║     ██████╔╝██║   ██║██████╔╝   ██║
██║╚██╔╝██║██║   ██║██╔═██╗ ██║   ██║██║     ██╔═══╝ ██║   ██║██╔══██╗   ██║
██║ ╚═╝ ██║╚██████╔╝██║  ██╗╚██████╔╝███████╗██║     ╚██████╔╝██║  ██║   ██║
╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝
=============================================================================
             [SYSTEM: NOMINAL] // [THEME: CYBERPUNK HUD ACTIVE]
```

Welcome to the codebase of **Mukul Sharma's Portfolio** — an immersive, terminal-inspired, futuristic dashboard showcasing engineering skills across Cyber Security, Cloud Architecture, AI/ML, and IoT systems.

---

## ⚡ Key Features of the Portfolio UI

- **⚡ Loading Boot Sequence**: A simulated hardware initialization check compiling system logs, loading local environments, and authenticating security levels.
- **🛡️ Avengers Mode**: A S.H.I.E.L.D.-themed secret mode that switches the terminal interface to a holographic Stark-Tech layout, booting J.A.R.V.I.S. HUD alerts and customized Director archives.
- **📈 Telemetry HUD**: Fixed monitoring interface featuring live FPS calculation, real-time scroll tracker, cursor coordinate tracking, and a dynamic audio spectrum visualizer.
- **🌀 Wireframe Matrix**: An interactive, rotating 3D wireframe globe indicating active server grids and node connectivity.

---

## 👨‍💻 About Mukul Sharma

- **Education**: B.Tech in Computer Science & Engineering (Specialization in **Cyber Security**) at **Lovely Professional University (LPU)**, Punjab (2022 – 2026).
- **Primary Focus**: Cloud Architecture, IoT Node Fusion, Predictive Machine Learning, and Enterprise Application Security.
- **Leadership**: Former CEO of **Student Organisation SAPPHIRE** at LPU, leading a 20+ member committee executing university-wide tech and management initiatives.

---

## 🛠️ The Tech Stack & Architecture

This application is built with modern web technologies:

- **Framework**: [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) (React 19 + Vite 8) for SSR (Server-Side Rendering) capabilities.
- **Routing**: [TanStack Router](https://tanstack.com/router/v1) for robust file-based client-side and server-side routing.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) for micro-animations, glassmorphic UI panels, scanlines, and glow filters.
- **State Management**: [TanStack Query v5](https://tanstack.com/query/v5) (React Query) for caching and asynchronous state hydration.
- **Icons**: [Lucide React](https://lucide.dev/) for holographic vectors.
- **Package Management**: [Bun](https://bun.sh/) for ultra-fast installs and build execution.

---

## 🚀 Featured Projects & Research

### 1. **EcoGeoGuard — AI-IoT Landslide Prediction & Smart Agriculture**

- _Scope_: Personal Research Project & Paper (Accepted & Presented orally at **DASGRI Congress 2026**).
- _Overview_: Real-time multi-sensor telemetry fusion (vibration, tilt, rainfall, soil moisture) feeding into a serverless machine learning risk-assessment pipeline.
- _Stack_: Python, ML (Algorithms), AWS Lambda, DynamoDB, API Gateway, LoRa, Next.js.
- _Performance_: Under 3-minute emergency SMS/App alert latency with `0.94` F1 ML prediction accuracy.

### 2. **INVENTROX — AI Business Operating System**

- _Scope_: SME SaaS Product.
- _Overview_: Consolidated ERP suite built for Indian SMEs, packaging smart POS, GST invoicing, automated CRM, analytics, and an interactive plain-language AI assistant.
- _Stack_: Next.js, Node.js, Express, MongoDB Atlas, GenAI LLM APIs.

### 3. **Space Galactus**

- _Scope_: LPU Academic Team Project (Team of 3).
- _Overview_: 2D top-down physics-based space arcade shooter. Includes wave spawners, escalation logic, boss-battle loops, and ScriptableObject weapon inventories.
- _Stack_: Unity 6, C#, 2D Physics engine, Unity New Input System.

### 4. **AYUSH VR Herbal Garden (SIH)**

- _Scope_: Smart India Hackathon.
- _Overview_: Virtual Reality simulation for interactive Ayurvedic botany education.
- _Stack_: Unity 3D, Oculus SDK, Blender, Node.js, Express, MongoDB.

---

## 🔧 Dev Setup & Local Launch

Ensure you have [Bun](https://bun.sh/) or Node.js installed.

### 1. Clone & Setup

```bash
# Clone the repository
git clone https://github.com/mukulsharmams007/Mukul-Portfolio.git
cd Mukul-Portfolio

# Install dependencies using Bun (recommended) or npm
bun install
# or
npm install
```

### 2. Live Development Server

Launch the local Hot-Module-Replacement (HMR) server:

```bash
bun run dev
# or
npm run dev
```

Open your browser to `http://localhost:3000` (or specified terminal port).

### 3. Lint & Code Formatting

Verify code quality and automatically clean files:

```bash
# Lint check
bun run lint

# Prettier format
bun run format
```

### 4. Compile & Build Production

Build the optimized application bundle powered by Vite & Nitro Server:

```bash
bun run build
# or
npm run build
```

Preview the production server locally:

```bash
bun run preview
# or
npm run preview
```

---

## 📡 Directory Structure

```
├── .tanstack/             # TanStack Router cache and build files
├── public/                # Static public assets (fonts, video telemetry output)
├── src/
│   ├── assets/            # CSS, images, and visual components
│   ├── components/        # React Components
│   │   ├── portfolio/     # Custom holographic UI components (HUD, Spectrum, FX)
│   │   └── ui/            # Reusable primitive UI buttons, overlays
│   ├── hooks/             # Custom React state hooks
│   ├── lib/               # Utility functions, helpers, and error handlers
│   ├── routes/            # File-based TanStack Start routes page system
│   │   ├── __root.tsx     # Base App Shell layout wrapper
│   │   ├── index.tsx      # Main terminal entry-point route
│   │   └── ...            # Secondary routes (about, projects, contact, resume)
│   ├── server.ts          # SSR build entry point with custom Nitro integration
│   ├── start.ts           # Client hydration start script
│   └── styles.css         # Styling system & custom neon keyframe animations
├── package.json           # App scripts and core dependencies
├── tsconfig.json          # TypeScript compilation settings
└── vite.config.ts         # Lovable & TanStack compilation settings
```

---

## 🌐 Connected Ecosystems

This project is connected directly to **[Lovable.dev](https://lovable.dev)**.

> [!WARNING]
> Do **not** amend, squash, or force-push commits to the primary deployment branches of this repository as it will overwrite and disconnect project history synchronized in the Lovable design editor. Keep the branch history linear and consistent.

---

_Created by [Mukul Sharma](mailto:mukulsharmaworks@gmail.com). Powered by Cyber Security, Cloud-Native architecture, and a love for immersive UI._
