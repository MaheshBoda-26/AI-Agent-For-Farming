# Kisan Mitra AI 🌾 (कृषि मित्र)
> An Intelligent, Multi-lingual voice-enabled AI Assistant for Indian Farmers.

Kisan Mitra AI is a next-generation farming advisor designed to bridge the gap between complex agricultural science and local farmers. By leveraging state-of-the-art AI models, real-time weather analytics, and speech synthesizers, it provides actionable farming intelligence in multiple local Indian languages (Hindi, Telugu, English, etc.) via voice and chat.

---

## 📸 Screenshots

### 🖥️ Dashboard Overview
*(Placeholder for Dashboard Screenshot)*
![Dashboard Overview](public/placeholder-dashboard.png)

### 💬 Voice-Enabled AI Chat
*(Placeholder for AI Chatbot Screenshot)*
![AI Chatbot Interface](public/placeholder-chat.png)

### 🔬 Disease & Pest Identification
*(Placeholder for Disease Diagnosis Screenshot)*
![Disease Identification](public/placeholder-disease.png)

### 📈 Live Mandi Market Prices
*(Placeholder for Mandi Prices Screenshot)*
![Mandi Price Trends](public/placeholder-mandi.png)

---

## ✨ Key Features

1. **🎙️ Multi-lingual Voice Interaction:** Speak and listen to the AI in local Indian languages (Hindi, Telugu, English). Powered by **ElevenLabs speech synthesizer** and voice transcription.
2. **🌱 Intelligent Crop Suggestions:** Recommends the best crops to grow based on region, current season (Kharif, Rabi, Zaid), soil type, and average temperature with confidence scores.
3. **🍂 Disease Identification (Vision AI):** Upload a picture of a diseased crop leaf to get instant analysis, risk warnings, and actionable organic/chemical prevention steps.
4. **📈 Real-Time Mandi Prices:** Live modal and min/max prices of commodities across mandis in different Indian states, complete with market trends (increasing, decreasing, stable).
5. **🪲 Pest & Fertilizer Advisories:** Growth stage-specific recommendations for pest control and fertilizer schedules without risky chemical dosages.
6. **📱 SMS & Email Advisories:** Generates smart, 160-character cellular SMS alerts and beautiful HTML emails combining weather alerts and price spikes for offline access.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Vite + React + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **State & Queries:** TanStack React Query + React Router DOM
- **Icons:** Lucide React

### Backend
- **Server:** Node.js + Express
- **Database:** MongoDB (via Mongoose ODM)
- **Email:** Nodemailer (with Ethereal SMTP fallback)

### AI & APIs
- **LLM / Vision:** Google Gemini API (`gemini-2.5-flash` for high-speed reasoning and image analysis)
- **Voice (TTS & STT):** ElevenLabs Voice API
- **Weather:** OpenWeatherMap API

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or Bun
- MongoDB (Running locally on default port `27017` or a remote Atlas connection string)

### Local Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MaheshBoda-26/AI-Agent-For-Farming.git
   cd AI-Agent-For-Farming
   ```

2. **Setup the Backend Server:**
   Navigate to the `server` directory, create a `.env` file, and install dependencies:
   ```bash
   cd server
   npm install
   ```

   Configure your `server/.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/krishi_mitra
   JWT_SECRET=your_secure_jwt_secret_key
   PORT=3001

   # Gemini API Key (Supports native Gemini keys and OpenRouter API keys starting with sk-or-)
   GEMINI_API_KEY=your_gemini_api_key_here

   # Third-Party Integrations
   OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   ```

3. **Setup the Frontend Client:**
   Navigate back to the project root and install client dependencies:
   ```bash
   cd ..
   npm install
   ```

4. **Run the Application:**
   Start both the frontend and backend server concurrently using:
   ```bash
   npm run dev
   ```
   - Frontend client: http://localhost:5173
   - Backend API server: http://localhost:3001

---

## 🌍 Supported Languages
- English
- Hindi (हिंदी)
- Telugu (తెలుగు)
- Bengali (বাংলা)
- Tamil (தமிழ்)
- Marathi (मराठी)
- Gujarati (ગુજરાતી)
- Kannada (ಕನ್ನಡ)
- Malayalam (മലയാളം)
- Punjabi (ਪੰਜਾਬੀ)
- Odia (ଓଡ଼ିଆ)
- *And many other regional scripts.*

---

## 🤝 Contribution Guidelines
Contributions are welcome! Please fork the repository, create a descriptive feature branch, commit your changes, and open a Pull Request.

---

## 📄 License
This project is licensed under the MIT License.
