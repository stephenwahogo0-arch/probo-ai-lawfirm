
# PROBO LAW FIRM - Worldwide Deployment Blueprint

To reach your goal of a global AI law firm reachable on any device, follow this deployment strategy:

### **1. Frontend Deployment (Vercel)**
- **Why**: Best global CDN for React/Vite apps. Handles PWA assets perfectly.
- **Action**: Connect your GitHub repo to [Vercel](https://vercel.com).
- **Env Vars**:
  - `VITE_SUPABASE_URL`: Your Supabase URL.
  - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key.

### **2. Backend Deployment (Render)**
- **Why**: Excellent support for Python/FastAPI with global regions.
- **Action**: Create a "Web Service" on [Render](https://render.com).
- **Config**:
  - **Build Command**: `pip install -r requirements.txt`
  - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Env Vars**:
  - `SUPABASE_URL`: Your Supabase URL.
  - `SUPABASE_KEY`: Your Supabase Key.
  - `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`: Your production keys.

### **3. Mobile Installation (iPhone/Android)**
Users can install Probo Law Firm without an app store:
1. Open the URL in **Safari** (iPhone) or **Chrome** (Android).
2. Tap **"Share"** (iOS) or the **"Menu"** (Android).
3. Select **"Add to Home Screen"**.
4. The Probo Law Firm icon will appear on their device just like a real app.

### **4. Scanning the QR Code**
- Display the QR code on your marketing materials.
- When scanned, it opens the Vercel URL directly, triggering the "Install" prompt.
