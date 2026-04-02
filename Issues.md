# Solar Webapp — Issues & Fix Report

> **Repository:** `https://github.com/Junaid7798/Solar-Webapp.git`  
> **Scope:** Full codebase audit with focus on the Admin Panel  
> **Summary:** 4 Critical bugs · 5 Warnings · 4 Improvements

---

## Critical — Breaks Core Functionality

### 1. Admin data is never persisted across devices (localStorage only)

**File:** `src/admin/hooks/usePersistedData.ts`

All admin data — projects, quotations, inventory, reminders, AMC contracts — is stored exclusively in the browser's `localStorage`. Clearing the browser cache, switching devices, or opening an incognito window will wipe everything permanently. There is no real backend or database.

**Current code:**
```ts
// usePersistedData.ts
localStorage.setItem(`asrar_admin_${key}`, JSON.stringify(data));
```

**Fix:** Replace `localStorage` with a real backend. Options include:
- **Supabase** (free tier, Postgres, real-time)
- **Firebase Firestore** (Google, easy setup)
- **A custom Node/Express API** with a database

At minimum, display a banner warning the user that data is device-specific until a backend is integrated.

---

### 2. Admin password is hardcoded in source — visible to anyone

**File:** `src/admin/auth/AdminLogin.tsx`

The fallback admin password `'admin123'` is hardcoded in the source. Even when `VITE_ADMIN_PASSWORD` is set, it is a **Vite environment variable**, which means it gets **bundled into the JavaScript** and is fully readable in the browser's network/source tab. This provides zero real security.

**Current code:**
```ts
// AdminLogin.tsx
const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
// VITE_ vars are embedded in the JS bundle — anyone can read them.
```

**Fix:** Authentication must be handled server-side. The password or token must never reach the client bundle. Implement a `/api/admin/login` endpoint that validates credentials on the server and returns a signed JWT or session cookie.

---

### 3. Leads page shows nothing if `VITE_GOOGLE_SHEETS_URL` is not set

**Files:** `src/admin/pages/Leads/Leads.tsx`, `src/admin/pages/Dashboard/Dashboard.tsx`

Both `Leads.tsx` and `Dashboard.tsx` silently return early if the env var is missing — no error is shown, the page just appears empty with no guidance. Additionally, the **Dashboard reads from a different key than the Profit page writes to**, so profit data never appears on the dashboard.

**Current code:**
```ts
// Leads.tsx + Dashboard.tsx
if (!GOOGLE_SHEETS_URL) return; // silently does nothing — no error, no message

// Dashboard reads:
usePersistedData('finance_data', ...)

// ProfitDashboard writes:
usePersistedData('profit_chart_data', ...)  // ← different key! Never synced.
```

**Fix:**
1. Show a setup prompt/banner when `VITE_GOOGLE_SHEETS_URL` is missing instead of silently returning.
2. Unify the localStorage key — both Dashboard and ProfitDashboard must use the **same key** (e.g. `'finance_data'`).

---

### 4. Quotation "Save" doesn't persist — `onSave` prop is never passed

**Files:** `src/admin/pages/Leads/Leads.tsx`, `src/admin/pages/Quotations/QuotationDrawer.tsx`

`QuotationDrawer` calls `onSave()` to add a new quotation to the persisted list. However, every place that opens the drawer — including the Leads page — does **not** pass the `onSave` prop. Saving a quotation from the Leads page generates a PDF but never adds it to the Quotations list.

**Current code:**
```tsx
// Leads.tsx — opens drawer but never passes onSave:
<QuotationDrawer
  isOpen={isQuoteDrawerOpen}
  onClose={() => setIsQuoteDrawerOpen(false)}
  leadData={selectedLead}
/>
// Missing: onSave={(q) => { /* add q to quotations list */ }}
```

**Fix:** Pass an `onSave` handler that updates the persisted quotations list:
```tsx
<QuotationDrawer
  isOpen={isQuoteDrawerOpen}
  onClose={() => setIsQuoteDrawerOpen(false)}
  leadData={selectedLead}
  onSave={(q) => setQuotations((prev: any[]) => [q, ...prev])}
/>
```

---

## Warnings — Broken Features

### 5. AMC "New AMC Contract" button does nothing

**File:** `src/admin/pages/AMC/AMC.tsx`

The "New AMC Contract" button has no `onClick` handler and no associated modal or drawer. Clicking it has zero effect. The AMC list is also effectively read-only — there is no UI to add, edit, or delete entries.

**Current code:**
```tsx
// AMC.tsx
<button className="...">
  <Plus /> New AMC Contract  {/* ← no onClick, no state, nothing happens */}
</button>
```

**Fix:** Create an `AMCDrawer` component (similar to `ProjectDrawer`) and wire it up with an `isOpen` state, matching the pattern used in Projects and Quotations.

---

### 6. Gallery "Upload" button does nothing

**File:** `src/admin/pages/Gallery/GalleryManager.tsx`

The upload button has no file input and no handler. There is no way to actually upload images. The gallery only displays hardcoded placeholder images from local `/images/` paths.

**Current code:**
```tsx
// GalleryManager.tsx
<button className="...">
  <Upload /> Upload  {/* ← no file input, no handler, no cloud storage */}
</button>
```

**Fix:** Add a hidden `<input type="file" accept="image/*">` and integrate with a storage service (Cloudinary, Firebase Storage, or Supabase Storage) to upload and persist image URLs.

---

### 7. Revenue chart W/M period toggle does nothing

**File:** `src/admin/pages/Dashboard/Dashboard.tsx`

The "W" (weekly) and "M" (monthly) buttons on the Dashboard revenue chart have no state or click handlers. Clicking them changes nothing — the chart always displays the same data regardless of the selected period.

**Current code:**
```tsx
// Dashboard.tsx
<button className="... bg-amber">W</button>
<button className="... bg-depth">M</button>
{/* Neither has onClick — no period switching logic exists */}
```

**Fix:**
```tsx
const [period, setPeriod] = useState<'W' | 'M'>('W');
// Derive revenueData based on `period`
<button onClick={() => setPeriod('W')} className={period === 'W' ? '... bg-amber' : '... bg-depth'}>W</button>
<button onClick={() => setPeriod('M')} className={period === 'M' ? '... bg-amber' : '... bg-depth'}>M</button>
```

---

### 8. Profit page finance data uses a different key than the Dashboard

**Files:** `src/admin/pages/Profit/ProfitDashboard.tsx`, `src/admin/pages/Dashboard/Dashboard.tsx`

The Profit page stores its data under `'profit_chart_data'` while the Dashboard reads from `'finance_data'`. These are two separate, unrelated keys in localStorage, so any data edited on the Profit page will never be reflected on the Dashboard's revenue trend chart or profit stat card.

**Fix:** Pick one key and use it consistently across both files:
```ts
// Both files must use the same key:
usePersistedData('finance_data', [...])
```

---

### 9. Projects page: no way to create a new project

**File:** `src/admin/pages/Projects/Projects.tsx`

The `ProjectDrawer` and `handleSaveProject` only handle **editing** existing projects. The "+" button opens the drawer but there is no "add new" code path — it only opens if `selectedProject` is already set. There is no way to create a brand new project from the UI.

**Fix:** Add an "add mode" to `ProjectDrawer` with a distinct initial state and a separate handler:
```ts
const handleAddProject = (newProject: any) => {
  const id = `PRJ-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
  setProjects((prev: any[]) => [{ ...newProject, id }, ...prev]);
};
```

---

## Improvements — UX and Reliability

### 10. No `.env.example` file — setup is undocumented

The app depends on multiple environment variables but there is no `.env.example` file. A new developer has no way to know what needs to be configured.

**Fix:** Create `.env.example` at the project root:
```env
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
VITE_ADMIN_PASSWORD=your_secure_password
VITE_BUSINESS_NAME=Your Solar Company
VITE_BUSINESS_PHONE=91XXXXXXXXXX
VITE_BUSINESS_TAGLINE=Your Tagline Here
```

---

### 11. CORS will block the Google Sheets fetch in some environments

The app fetches data directly from a Google Apps Script URL in the browser. This works in development but can fail with CORS errors in production depending on the browser, proxy, or deployment environment. The Google Apps Script must explicitly return `Access-Control-Allow-Origin: *` in its response headers.

**Fix:** In your Google Apps Script, ensure:
```js
return ContentService.createTextOutput(JSON.stringify(data))
  .setMimeType(ContentService.MimeType.JSON);
// Google Apps Script sets CORS headers automatically for doGet(),
// but confirm the script is deployed as "Anyone" access.
```
Alternatively, proxy the request through a small backend to avoid browser CORS restrictions entirely.

---

### 12. `usePersistedData` key in `useEffect` dependency array

**File:** `src/admin/hooks/usePersistedData.ts`

The `key` parameter is included in the `useEffect` dependency array. The `isFirstRender` guard correctly prevents writing on mount, but if `key` were ever to change at runtime, the first write for the new key would be skipped. While currently this doesn't cause a bug (keys are always static strings), it is a subtle reliability issue.

**Fix:** Remove `key` from the dependency array or memoize it:
```ts
useEffect(() => {
  if (isFirstRender.current) { isFirstRender.current = false; return; }
  localStorage.setItem(`asrar_admin_${key}`, JSON.stringify(data));
}, [data]); // key is stable, remove it from deps
```

---

### 13. Mobile bottom nav obscures page content on several pages

**File:** Multiple admin pages

The `BottomNav` component is fixed at the bottom of the screen on mobile. `GalleryManager.tsx` correctly adds `pb-20` to prevent content from being hidden behind it, but most other admin pages (`AMC.tsx`, `Reminders.tsx`, `Inventory.tsx`, `Leads.tsx`, etc.) do not, causing the last few items to be hidden behind the nav bar on small screens.

**Fix:** Add `pb-20` (or `pb-24` for safety) to the root container of every admin page, or add it globally to the `AdminLayout` content wrapper.

---

## Quick Reference Summary

| # | Severity | File | Issue |
|---|----------|------|-------|
| 1 | 🔴 Critical | `usePersistedData.ts` | Data stored in localStorage only — lost on browser clear |
| 2 | 🔴 Critical | `AdminLogin.tsx` | Password hardcoded & exposed in JS bundle |
| 3 | 🔴 Critical | `Leads.tsx`, `Dashboard.tsx` | Silent empty state + mismatched finance data keys |
| 4 | 🔴 Critical | `Leads.tsx`, `QuotationDrawer.tsx` | `onSave` prop never passed — quotations not persisted |
| 5 | 🟡 Warning | `AMC.tsx` | "New AMC Contract" button has no handler |
| 6 | 🟡 Warning | `GalleryManager.tsx` | "Upload" button has no handler or file input |
| 7 | 🟡 Warning | `Dashboard.tsx` | W/M period toggle has no state or logic |
| 8 | 🟡 Warning | `ProfitDashboard.tsx` | Different localStorage key than Dashboard reads |
| 9 | 🟡 Warning | `Projects.tsx` | No way to create a new project from UI |
| 10 | 🔵 Info | — | No `.env.example` file |
| 11 | 🔵 Info | `Leads.tsx` | CORS may block Google Sheets fetch in production |
| 12 | 🔵 Info | `usePersistedData.ts` | `key` in `useEffect` deps — subtle reliability issue |
| 13 | 🔵 Info | Multiple pages | Missing `pb-20` causes bottom nav to obscure content |
