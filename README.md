# 💡 WhatIf.AI — Real-Time Decision Support Tool Powered by AI Agents

**WhatIf.AI** is a customizable, AI-powered assistant built to help individuals and organizations solve real-world problems — instantly. Whether you're planning a trip or decoding complex cybersecurity frameworks like STIGs, WhatIf.AI helps you ask better “what if” questions and get meaningful answers, fast.

---

## 🚀 Live Demo

🌐 [Watch Demo Video](https://your-demo-link.com)  
📦 GitHub Repo: [whatif-frontend-new](https://github.com/your-org/whatif-frontend-new)

---

## ⚡ Key Features

### ✨ Interactive AI Scenarios
- Ask “What if…” questions via voice or text
- Auto-generates intelligent scenario cards in real-time

### 🛡️ STIG Clarifier (Built with Google AI)
- Upload a STIG ID (e.g. `V-71991`)
- Our AI agent **Chuck** explains the STIG in plain English with examples
- Goal: save engineers hours of manual interpretation

### 🎙️ Voice-Driven Interface *(Partially Functional)*
- Users can speak their prompts using speech-to-text
- Avatar photo uploader + scenario builder
- (Some TTS/audio feedback mocked for demo)

### 🔐 Powered By Google Cloud
- Firebase Auth for secure login
- Firestore for storing scenarios
- Google Cloud TTS & Speech APIs
- AI agent logic built with Generative AI SDK

---

##  Technical Stack

| Frontend          | Backend                  | AI & Cloud               |
|------------------|--------------------------|--------------------------|
| React (Vite)     | FastAPI (Python)         | Google Cloud GenAI SDK   |
| React-Bootstrap  | Firebase Firestore       | Google TTS / STT APIs    |
| CSS Modules      | REST API Architecture    | Multi-agent AI Design    |

---

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/your-org/whatif-frontend-new.git
cd whatif-frontend-new

# Install dependencies
npm install

# Start the dev server
npm run dev


⚠️ Known Issues
🔧 STIG Clarifier still in early development — output is partially mocked

🎤 Audio input and feedback available only in some browsers

🔥 Firebase token occasionally expires during speech testing

👥 Multi-agent coordination being finalized

👩🏽‍💻 Authors
Sherie Chandler
Lead AI Architect, Frontend Developer, GitOps Lead

Designed and built the STIG AI Clarifier (Chuck the Chatbot)

Integrated Photo Agent using Google Vision AI

Developed core frontend UI (Dashboard, About, Contact)

Led major Git cleanup and project restructuring

Conceptualized the multi-agent framework

Chiu-Ssu Hsieh 
Backend Developer, AI Workflow Engineer

Built backend APIs for Scenario Generation, TTS, and NLU

Integrated Gemini AI and Google Cloud services

Set up Firebase Auth, Firestore, and Storage

Enhanced scenario rendering and UI responsiveness
Powered by Google Developer tools

🙌 Special Thanks

Google Cloud team for enabling GenAI innovation


🏁 Final Thoughts
WhatIf.AI isn’t just a demo — it’s a prototype of a smarter way to think.
From national security compliance to business strategy and healthcare workflows,
our goal is to replace time-consuming guesswork with rapid, explainable AI assistance.


