# 📱 Google Play Store Listing Package — LinguaBridge AI

Use the exact metadata, descriptions, and questionnaire answers below when creating your listing in the [Google Play Console](https://play.google.com/console).

---

## 1. 🏷️ App Title & Short Descriptions

### App Name (Limit: 30 characters)
```text
LinguaBridge AI — Translator
```
*(Exact length: 28 characters)*

### Short Description (Limit: 80 characters)
```text
Fast, context-aware AI translation preserving formatting, lists & punctuation.
```
*(Exact length: 78 characters)*

---

## 2. 📝 Full Description (Limit: 4000 characters)

```text
Break language barriers instantly with LinguaBridge AI — the next-generation multilingual translator powered by Google Gemini.

Whether you are translating professional business emails, academic research, travel directions, or daily conversations, LinguaBridge AI ensures your text is translated naturally while strictly preserving the original structure, numbered lists, bullet points, and punctuation.

🌟 WHY CHOOSE LINGUABRIDGE AI?

✓ FORMAT PRESERVATION:
Never lose your line breaks, numbered steps (1. 2. 3.), or bullet points (- * •) again. LinguaBridge AI understands document layout and keeps your formatting intact.

✓ CONTEXT-AWARE INTELLIGENCE:
Powered by advanced Gemini AI, LinguaBridge understands polysemic words and ambiguous phrasing based on surrounding context.

✓ AUTOMATIC LANGUAGE DETECTION:
Not sure what language you are reading? Select Auto-Detect to instantly classify the source language with high-confidence accuracy.

✓ MULTILINGUAL SPEECH (TTS):
Listen to natural voice pronunciations in target accents with playback controls (Play, Pause, Resume, Stop) and customizable speeds (0.75x, 1x, 1.25x, 1.5x).

✓ INSTANT LOCAL CACHING:
Frequently used translations load with 0ms latency from an offline-ready local cache, saving mobile data and API quota.

✓ SEARCHABLE HISTORY & FAVORITES:
Easily browse previous translations, filter by date (Today, This Week, Older), star your favorite phrases, and export your history to CSV, JSON, or TXT.

✓ PRIVATE & SECURE:
Your translation history and favorites remain on your device. All requests are securely encrypted via TLS/HTTPS with server-side protection.

🌐 SUPPORTED LANGUAGES:
English, Tamil (தமிழ்), Hindi (हिन्दी), Telugu (తెలుగు), Malayalam (മലയാളം), Kannada (ಕನ್ನಡ), Bengali (বাংলা), Marathi (मराठी), Gujarati (ગુજરાતી), Punjabi (ਪੰਜਾਬੀ), Spanish (Español), French (Français), German (Deutsch), Italian (Italiano), Portuguese (Português), Arabic (العربية), Japanese (日本語), Korean (한국어), Chinese (简体中文), Russian (Русский), Dutch, Turkish, Vietnamese, Polish, Indonesian, Urdu, and more!

Download LinguaBridge AI today and experience intelligent, structure-preserving translation right from your pocket!
```

---

## 3. 🎨 Graphic Assets Checklist

| Asset Type | Required Dimensions | Format | Usage |
| :--- | :--- | :--- | :--- |
| **App Icon** | 512 × 512 px | 32-bit PNG (with alpha) | Google Play Store logo. Ready at `frontend/public/icon.svg` |
| **Feature Graphic** | 1024 × 500 px | JPEG or 24-bit PNG | Top banner of your Play Store listing page |
| **Phone Screenshots** | Min 2, max 8 screenshots | 16:9 or 9:16 aspect ratio (e.g. 1080 × 2400) | Main Translation screen, History, Speech audio playback, Dark mode |
| **7-Inch Tablet Screenshots** | Min 1 screenshot | 1200 × 1920 px | Split two-panel landscape view |
| **10-Inch Tablet Screenshots**| Min 1 screenshot | 1600 × 2560 px | Wide workspace layout |

---

## 4. 🔒 Data Safety Form Answers (Mandatory)

When completing the **Data Safety** section in Google Play Console, provide these exact answers:

1. **Does your app collect or share any user data?**
   - Select: **Yes** (Only the text sent for translation).
2. **Is data collected, shared, or both?**
   - **Collected** (transmitted to backend/Gemini API for processing).
   - **Not shared** with third-party advertisers or data brokers.
3. **Is user data encrypted in transit?**
   - Select: **Yes** (All requests use HTTPS/TLS).
4. **Do you provide a way for users to request data deletion?**
   - Select: **Yes** (Users can delete history or clear cache instantly in app).
5. **Data types collected:**
   - Category: **App activity** -> **In-app search history / Text inputs**
   - Purpose: **App functionality**
   - Ephemeral processing: **Yes** (Backend processes query and returns translation without persistent user profile tracking).

---

## 5. 🔞 Content Rating (IARC)

- Category: **Utility / Productivity Tool**
- Violence, Blood, Sexual Content: **None**
- Offensive Language: **None** (General utility)
- Miscellaneous: Does the app share physical location? **No**. Does it allow purchasing digital goods? **No**.
- Expected Rating: **PEGI 3 / Everyone (All ages)**.

---

## 6. 🌐 Privacy Policy URL

Google Play Console requires a public URL pointing to your privacy policy.
When your app is deployed (e.g., on Vercel or Render):
```text
https://your-domain.vercel.app/privacy.html
```
*(Pre-built compliant policy is located at `frontend/public/privacy.html`)*.
