# 🚀 Android Release & Google Play Store Launch Guide

This guide walks you through building the **Signed Android App Bundle (`.aab`)** for **LinguaBridge AI** and publishing it to the **Google Play Store**.

---

## 📋 Prerequisites Checklist
1. **Google Play Console Account**: A registered Google Play Developer account ([play.google.com/console](https://play.google.com/console) — one-time $25 registration fee).
2. **Deployed Frontend URL**: Your frontend deployed on Vercel, Netlify, or Render (e.g. `https://linguabridge-ai.vercel.app`).
3. **Backend API URL**: Your backend deployed on Render or Railway with `GEMINI_API_KEY` configured.

---

## 🛠️ Method 1: Instant AAB Generation via PWABuilder (Recommended)
Google and Microsoft support **PWABuilder** to package PWA applications directly into compliant Android App Bundles (`.aab`) without needing complex local Android SDK setups.

### Step 1: Deploy Frontend
Deploy the `frontend/` directory to Vercel:
```bash
cd frontend
npx vercel
```
Ensure your deployed domain loads `https://your-domain.vercel.app` and displays the manifest and icon.

### Step 2: Generate Signed `.aab`
1. Navigate to **[PWABuilder.com](https://www.pwabuilder.com)**.
2. Enter your deployed URL (e.g., `https://your-domain.vercel.app`) and click **Start**.
3. PWABuilder will audit your Web App Manifest, Service Worker, and Security (LinguaBridge is already pre-configured for 100% score).
4. Click **Package for Stores** -> select **Google Play (Android)**.
5. In the configuration modal:
   - **Package ID:** `ai.linguabridge.app`
   - **App Name:** `LinguaBridge AI`
   - **Launcher Name:** `LinguaBridge`
   - **Theme color:** `#0B1020`
   - **Navigation bar color:** `#0B1020`
6. Under **Signing Key**, choose:
   - *Generate New Key* (PWABuilder creates your release keystore and signs the bundle automatically).
   - **Important:** Download and save the generated `.keystore` or zip file safely for future updates!
7. Click **Generate Package**.
8. Download the ZIP file containing your signed **`app-release-bundle.aab`**.

---

## 🛠️ Method 2: Command-Line Generation via Bubblewrap (Google's CLI)

If you have Java and Android SDK installed on your workstation, you can generate the bundle via terminal:

```bash
# 1. Install Google's official Bubblewrap CLI
npm install -g @bubblewrap/cli

# 2. Initialize project from your deployed manifest
bubblewrap init --manifest="https://your-domain.vercel.app/manifest.json"

# 3. Build signed release bundle
bubblewrap build
```
This will prompt you to create a release keystore and output an `app-release-bundle.aab`.

---

## 📲 Step-by-Step Google Play Console Submission

### 1. Create App
1. Go to [Google Play Console](https://play.google.com/console).
2. Click **Create app** (top right).
3. Fill in details:
   - **App name:** `LinguaBridge AI — Translator`
   - **Default language:** English (United States)
   - **App or game:** App
   - **Free or paid:** Free
4. Accept the declarations and click **Create app**.

### 2. Set Up Store Listing
Go to **Grow > Store presence > Main store listing** in the left sidebar.
Copy and paste the exact text from [`PLAY_STORE_LISTING.md`](PLAY_STORE_LISTING.md):
- **Short description:** `Fast, context-aware AI translation preserving formatting, lists & punctuation.`
- **Full description:** *(Paste the formatted description from `PLAY_STORE_LISTING.md`)*
- **App icon:** Upload 512 × 512 PNG (`frontend/public/icon.svg` or exported PNG).
- **Feature graphic:** Upload 1024 × 500 banner graphic.
- **Phone screenshots:** Upload at least 2 screenshots showing the translation workspace and history panel.

### 3. Complete App Content Tasks
In the left sidebar, navigate to **Policy > App content** and complete the questionnaires:
- **Privacy Policy:** Enter `https://your-domain.vercel.app/privacy.html`.
- **Ads:** Select *"No, my app does not contain ads"*.
- **App access:** Select *"All functionality is available without special access"*.
- **Content ratings:** Complete the IARC questionnaire using the guidelines in `PLAY_STORE_LISTING.md` (Expected: PEGI 3 / Everyone).
- **Target audience:** Select 13 and older.
- **Data safety:** Fill according to Section 4 of `PLAY_STORE_LISTING.md`.
- **Government apps:** Select *"No"*.

### 4. Upload App Bundle (`.aab`) & Release
1. In the left sidebar, select **Release > Production** (or **Testing > Closed testing** if required by Google for new personal accounts).
2. Click **Create new release**.
3. Under **App bundles**, upload your **`app-release-bundle.aab`** file.
4. Set **Release name:** `1.0.0`.
5. Enter **Release notes:**
   ```text
   Initial release of LinguaBridge AI:
   - Multilingual AI translation with Google Gemini
   - Strict format and list preservation
   - Instant local caching
   - Web Speech text-to-speech
   - Searchable history and favorites
   ```
6. Click **Next**, review release summary, and click **Save**.

### 5. Submit for Review
1. Click **Review release**.
2. Click **Start rollout to Production** (or submit to closed testing).
3. Google's review team will review your application (typically takes 1 to 3 business days).
4. Once approved, your application will be live for millions of users on the **Google Play Store**!
