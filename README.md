# MockView: AI-Powered Interview Practice Platform

**MockView** is an AI-powered mock interview platform that simulates real-time interviews via voice calls. The AI asks you technical or behavioral questions, listens to your responses, and provides a downloadable feedback report based on your performance.

## ✨ Features

- 🎤 Real-time mock interviews with AI via voice calls  
- 🧠 Intelligent questioning using LLMs  
- 📝 Generates downloadable performance feedback  
- ⏱️ Instant and automated analysis after each session  
- 🔒 Secure, client-friendly interface with no human reviewers  
- 🛠️ No setup required — works in the browser

---

## 🛠️ Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/mockview.git
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Add Environment Variables
Create a file named .env.local in the root directory and add your necessary keys. Example:

```bash
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Google Gemini API
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Vapi.ai Key
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key
```

### 4. Start the Development Server
```bash
npm run dev
```

## 💻 Built With

- **Next.js** – React framework for building web apps  
- **Firebase** – Auth, Firestore, and hosting  
- **Tailwind CSS** – For rapid UI styling  
- **Vapi.ai** – For real-time AI call interface  
- **shadcn/ui** – Prebuilt accessible components  
- **Google Gemini API** – For smart AI questioning and analysis

---

## ☕ Support

If you find this project helpful, consider giving it a ⭐ on GitHub or [buy me a coffee](https://www.buymeacoffee.com/yourusername)!
