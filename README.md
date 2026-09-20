<div align="center">
  <h1>🏠 HomeGuard AI</h1>
  <p>AI-Powered Home Safety Visual Screening</p>
</div>

HomeGuard AI is an intelligent home safety application that uses AI to analyze images of your home and identify potential safety hazards. Upload photos of your living spaces and get instant feedback on safety risks with severity ratings and actionable recommendations.

## ✨ Features

- **AI-Powered Hazard Detection**: Uses Google Gemini AI to analyze images and identify safety hazards
- **Real-time Analysis**: Get instant feedback on potential risks in your home
- **Severity Scoring**: Hazards are categorized by severity (Low, Medium, High, Critical)
- **Category Breakdown**: View safety scores across different hazard categories
- **Scan History**: Track your previous scans and compare results over time
- **Firebase Integration**: Secure cloud storage for scan data and history
- **Modern UI**: Beautiful, responsive interface built with React and TailwindCSS

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: TailwindCSS 4, Lucide Icons
- **AI**: Google Gemini AI (@google/genai)
- **Backend**: Express.js
- **Database**: Firebase (Firestore)
- **Animations**: Framer Motion
- **Charts**: Recharts

## 📋 Prerequisites

- Node.js (v18 or higher)
- Bun (recommended) or npm
- Google Gemini API Key
- Firebase project with Firestore enabled

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tanya-garg10/HomeGuard-AI-AI-Powered-Home-Safety-Visual-Screening.git
   cd homeguard ai
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```
   GEMINI_API_KEY="your_gemini_api_key_here"
   APP_URL="http://localhost:3000"
   ```

4. **Configure Firebase**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Firestore Database
   - Copy your Firebase config and update it in `src/services/firebase.ts`

## 🏃 Running the App

**Development mode:**
```bash
bun run dev
# or
npm run dev
```

The app will be available at `http://localhost:3000`

**Production build:**
```bash
bun run build
bun run start
# or
npm run build
npm run start
```

## � Deployment

### Deploy on Render

1. **Push your code to GitHub** (if not already done)
2. **Create a new Web Service on Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `homeguard ai` repository

3. **Configure the service**:
   - **Name**: homeguard-ai
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

4. **Add Environment Variables** in Render dashboard:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `OPENAI_API_KEY`: Your OpenAI API key (optional)
   - `APP_URL`: Your Render service URL (e.g., `https://homeguard-ai.onrender.com`)
   - `NODE_ENV`: `production`

5. **Deploy**: Click "Create Web Service"

The `render.yaml` file in the repository will automatically configure most settings.

### Alternative Deployment Options

**Vercel**:
- Connect your GitHub repository to Vercel
- Add environment variables in Vercel dashboard
- Vercel will auto-detect and deploy

**Railway**:
- Deploy from GitHub
- Configure environment variables in Railway dashboard

**Cloud Run**:
```bash
gcloud run deploy --source .
```

## �📱 Usage

1. **Upload an Image**: Click the upload zone or drag and drop an image of your home
2. **AI Analysis**: The AI will analyze the image for safety hazards
3. **View Results**: See detected hazards with severity ratings and recommendations
4. **Track History**: View your scan history and compare results over time
5. **Compare Scans**: Compare different scans to see improvements

## 🔒 Security

- All scan data is stored securely in Firebase
- API keys are never exposed to the client
- Images are processed securely and not stored permanently

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue on GitHub.
