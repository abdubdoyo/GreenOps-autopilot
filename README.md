# 🌿 GreenOps Autopilot

**Carbon-Aware Compute Scheduler for AI & Data Workloads**

GreenOps Autopilot is a high-performance optimization engine designed to slash the carbon footprint of cloud compute. By dynamically routing workloads to the cleanest global datacenters and optimizing execution timing, it enables a reduction of compute-linked carbon intensity by up to **99%** without compromising on performance or budget.

---

## 🚀 The Problem
AI training and data processing are massive carbon emitters. Most developers default to the closest or cheapest cloud region (like `us-east-1`), unaware that the grid intensity in Virginia is often **50x higher** than in regions like Montréal or Stockholm.

## ✨ Core Features

### 1. Carbon-Aware Job Planner
Input your job requirements—hardware (GPU/CPU), runtime, deadline, and cost constraints. The engine calculates the environmental and financial impact of your execution options.

### 2. Multi-Dimension Optimization Engine
Our custom deterministic optimizer scores regions based on:
- **Live Grid Intensity** (gCO₂eq/kWh)
- **Hourly Compute Costs**
- **Datacenter Availability & Reliability**
- **Temporal Peaks** (Moving jobs to off-peak green windows)

### 3. AI Strategic Analysis (Powered by Gemini 2.5 Flash)
Every plan includes a qualitative analysis from our AI layer. It explains the "Why" behind the recommendation, identifies trade-offs, and provides real-world equivalencies (e.g., "This saving is equal to 45 trees growing for a year").

### 4. Persistent Execution Pipeline
A built-in "To-Do" list for your compute jobs. Plan your work, add it to the pipeline, and track verified carbon savings in real-time on your dashboard.

### 5. Dynamic Analytics Dashboard
Zero-mock data. The dashboard calculates your total CO₂ saved, jobs analyzed, and cost delta dynamically from your verified execution history.

---

## 🛠️ How it Works

### Deterministic Logistics
- **Energy Modeling**: Converts hardware TDP (Thermal Design Power) and runtime into kWh.
- **Cost Indexing**: Tracks regional price variations across AWS, GCP, and Azure.
- **Constraint Satisfaction**: Ensures every recommendation stays within your Budget and Deadline.

### Intelligence Layer
- **Live Grid Data**: Integrated with carbon intensity feeds (Electricity Maps) to track where the world's grid is cleanest *right now*.
- **Generative Explainability**: Uses Gemini 2.5 Flash to transform raw data into a human-readable sustainability strategy.

---

## 📊 Carbon Calculation Methodology

GreenOps Autopilot uses a scientifically-backed formula to estimate the environmental impact of every job. 

### The Formula
$$CO_2\text{ (kg)} = \left( \frac{\text{Wattage} \times \text{Runtime} \times \text{PUE}}{1000} \right) \times \left( \frac{\text{Grid Intensity}}{1000} \right)$$

### Key Variables
1.  **Hardware Wattage (TDP)**: The Thermal Design Power of the chosen hardware (e.g., 400W for an Nvidia A100 GPU).
2.  **Runtime Hours**: The total duration of the compute job.
3.  **PUE (Power Usage Effectiveness)**: A measure of datacenter energy efficiency. We assume a standard **1.12** for ultra-efficient modern cloud datacenters.
4.  **Grid Intensity (gCO₂eq/kWh)**: The amount of carbon emitted per kilowatt-hour of electricity generated in a specific region, sourced from live grid data.

---

## 💻 Tech Stack
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Turbopack)
- **Styling**: Vanilla CSS (Premium Industrial/Glassmorphism Theme)
- **AI**: [Google Gemini 2.5 Flash](https://ai.google.dev/)
- **Grid Data**: [Electricity Maps API](https://www.electricitymaps.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Storage**: Browser `localStorage` for persistent queue management

---

## 🚦 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/your-repo/greenops-autopilot.git
cd greenops-autopilot
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```bash
# Required for AI Strategic Analysis
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to start planning.

---

*Built for a greener cloud. Powered by data, driven by AI.*
