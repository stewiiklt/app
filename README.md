# 🍽️ FoodieFriends — Social Restaurant Review Prototype

> **"See what your friends are eating, discover where to go next."**  
> An AI-assisted prototype created for the *Introduction to AI* course at **OsloMet – Oslo Metropolitan University**. The project began as a web app and now includes an Android-first mobile prototype built around the same Scandinavian food-community concept.

## Project layout

- `src/FoodieFriends.Web/` — original React web app.
- `src/FoodieFriends.Mobile/` — Expo / React Native Android-first prototype.
- `src/FoodieFriends.Api/` — ASP.NET Core API, backed by SQLite by default.
- `src/FoodieFriends.Core/` and `src/FoodieFriends.Infrastructure/` — domain and data layers.
- `Documentation/` — product specifications and prototype workflows.

---

## 📖 Documentation
Detailed specifications and architecture design:
- 📄 [FoodieFriends Full Production SDD](Documentation/FoodieFriends_SDD_Full.md)
- 📄 [FoodieFriends Prototype SDD](Documentation/FoodieFriends_SDD_Prototype.md)
- 📄 [FoodieFriends Android SDD](Documentation/FoodieFriends_Android_SDD.md)
- 📄 [Android prototype build and VibeOff workflow](Documentation/ANDROID_PROTOTYPE_WORKFLOW.md)

---

## 🚀 Quick Start

### Prerequisites
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)

### 1. Automatic One-Click Launch (PowerShell)
You can start both the backend API and the frontend client together:
```powershell
./run-dev.ps1
```

---

### 2. Manual Launch

#### Backend (.NET Web API)
```powershell
cd src/FoodieFriends.Api
dotnet run
```
*API will run at `http://localhost:5000` (or `http://localhost:5200`).*
*Database uses SQLite (`foodiefriends.db`) out-of-the-box with pre-seeded Scandinavian data. Can easily be pointed to PostgreSQL in `appsettings.json`.*

#### Frontend (React + Vite + Tailwind CSS)
```powershell
cd src/FoodieFriends.Web
npm install
npm run dev
```
*Frontend will run at `http://localhost:5173`.*

### Android-first mobile prototype

```powershell
cd src/FoodieFriends.Mobile
npm install
npm run web       # browser preview
npm run start     # scan the QR code with Expo Go on Android
```

The mobile prototype defaults to clearly labeled fictional demo fixtures. Likes and saved places are local demo state, and the review form previews a submission unless API mode is explicitly configured. The typed API client can connect to the local backend; configure `EXPO_PUBLIC_DATA_MODE=api` and `EXPO_PUBLIC_API_URL` for that mode. A phone must use the computer's LAN IP for the API URL rather than `localhost`. The demo fixtures are the intended data source for VibeOff screenshots.

Run `npm run typecheck` to check the mobile TypeScript project. For an Android emulator, `npm run android` asks Expo to open the app on the configured emulator.

---

## 🌟 Key Features

1. **🌍 Scandinavian Geo-Focus:**
   - 25 major municipalities across 5 countries (Norway, Sweden, Denmark, Finland, Iceland).
   - First-run country & city picker with flags.
2. **📰 Chronological Social Feed:**
   - Real-time stream of friends' visits with ratings (1–10 stars), photos, and price tags.
   - Friend "Want to Try" bookmark announcements.
   - Monthly trending restaurants pinned for your active city.
3. **🍽️ Restaurant Profiles & Smart Prioritization:**
   - Friends' reviews surfaced first before general public reviews.
   - "New" badge for restaurants opened within the last 6 months.
   - Links to website and menus.
4. **✍️ Multi-visit Review System:**
   - Automatic visit counter tracking (e.g. `Amazing sushi (#2)`).
   - Privacy controls: Public vs. Friends-only reviews.
   - Mutual-friend comment visibility algorithm.
5. **🏆 Dual Rankings:**
   - Overall community score vs. Friends-only score per municipality.
   - Category-based rankings (Italian, Nordic, Burgers, Fine Dining, etc.).
6. **👥 Hudd-style Friend Finder:**
   - Search by username + intelligent "Suggested Foodies" based on mutual connections.
7. **🔄 User Switcher for Testing:**
   - Built-in persona switcher in the navigation bar to test the social graph and privacy controls from different user perspectives!
