# Solar Webapp — Comprehensive Improvement Guide

> **Scope:** Full codebase review covering architecture, admin panel, frontend, performance, security, UX, and scalability.  
> Every section includes the exact problem, the affected file(s), and a detailed, actionable solution with code.

---

## Table of Contents

1. [Architecture — Replace localStorage with a Real Backend](#1-architecture--replace-localstorage-with-a-real-backend)
2. [Security — Proper Admin Authentication](#2-security--proper-admin-authentication)
3. [Admin — Fix the Mismatched Finance Data Keys](#3-admin--fix-the-mismatched-finance-data-keys)
4. [Admin — Wire Up the onSave Prop in Leads Page](#4-admin--wire-up-the-onsave-prop-in-leads-page)
5. [Admin — AMC Add/Edit Drawer](#5-admin--amc-addedit-drawer)
6. [Admin — Gallery Real Image Upload](#6-admin--gallery-real-image-upload)
7. [Admin — Dashboard Period Toggle (W/M)](#7-admin--dashboard-period-toggle-wm)
8. [Admin — Add New Project Flow](#8-admin--add-new-project-flow)
9. [Admin — Notifications Bell (Functional)](#9-admin--notifications-bell-functional)
10. [Admin — Project Document Upload](#10-admin--project-document-upload)
11. [Admin — Quotation Status Tracking](#11-admin--quotation-status-tracking)
12. [Admin — Project Progress % Auto-sync](#12-admin--project-progress--auto-sync)
13. [Admin — Export Reports (Projects & Finance)](#13-admin--export-reports-projects--finance)
14. [Admin — Search Across All Sections](#14-admin--search-across-all-sections)
15. [Frontend — Quote Form Submission Feedback](#15-frontend--quote-form-submission-feedback)
16. [Frontend — Calculator "Get Quote" Pre-fill](#16-frontend--calculator-get-quote-pre-fill)
17. [Frontend — City Dropdown Is Too Restrictive](#17-frontend--city-dropdown-is-too-restrictive)
18. [Frontend — Phone Number Hardcoded in Multiple Files](#18-frontend--phone-number-hardcoded-in-multiple-files)
19. [Performance — Code Splitting & Lazy Loading](#19-performance--code-splitting--lazy-loading)
20. [Performance — Image Optimisation](#20-performance--image-optimisation)
21. [Reliability — Error Boundaries](#21-reliability--error-boundaries)
22. [Reliability — No Loading State on Admin Pages](#22-reliability--no-loading-state-on-admin-pages)
23. [UX — Confirm Before Destructive Actions](#23-ux--confirm-before-destructive-actions)
24. [UX — Toast Notification System](#24-ux--toast-notification-system)
25. [UX — Keyboard Shortcuts for Admin Power Users](#25-ux--keyboard-shortcuts-for-admin-power-users)
26. [DX — Add .env.example and Setup Guide](#26-dx--add-envexample-and-setup-guide)
27. [DX — TypeScript Strict Mode & Remove `any`](#27-dx--typescript-strict-mode--remove-any)
28. [DX — Add ESLint + Prettier](#28-dx--add-eslint--prettier)
29. [SEO & Accessibility — Landing Page](#29-seo--accessibility--landing-page)
30. [Mobile — Safe Area & Bottom Nav Padding](#30-mobile--safe-area--bottom-nav-padding)

---

## 1. Architecture — Replace localStorage with a Real Backend

**Files affected:** `src/admin/hooks/usePersistedData.ts`, all admin pages

**Problem:**  
Every piece of admin data — projects, quotations, inventory, reminders, AMC — is stored in `localStorage`. This means:
- Clearing browser history deletes everything
- Multiple browsers / devices never sync
- No data backup exists
- The 5 MB localStorage limit will eventually be hit

**Solution: Integrate Supabase (free, 500 MB, real-time)**

**Step 1 — Install Supabase client:**
```bash
npm install @supabase/supabase-js
```

**Step 2 — Create `src/lib/supabase.ts`:**
```ts
import { createClient } from '@supabase/supabase-js';

const url  = import.meta.env.VITE_SUPABASE_URL  as string;
const key  = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, key);
```

**Step 3 — Create tables in Supabase dashboard (SQL):**
```sql
create table projects (
  id text primary key,
  customer text not null,
  city text,
  size text,
  status text,
  progress int default 0,
  value numeric default 0,
  expenses numeric default 0,
  start_date text,
  created_at timestamptz default now()
);

create table quotations (
  id text primary key,
  customer text not null,
  city text,
  size text,
  date text,
  status text default 'Sent',
  total text,
  created_at timestamptz default now()
);

-- Repeat for: amc_contracts, inventory_items, reminders
```

**Step 4 — Replace `usePersistedData` with `useSupabaseData`:**
```ts
// src/admin/hooks/useSupabaseData.ts
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export function useSupabaseData<T>(table: string, initialData: T[]) {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from(table).select('*').order('created_at', { ascending: false })
      .then(({ data: rows, error }) => {
        if (!error && rows) setData(rows as T[]);
        setLoading(false);
      });
  }, [table]);

  const upsert = async (row: T) => {
    const { data: updated } = await supabase.from(table).upsert(row).select();
    if (updated) setData(prev => {
      const id = (row as any).id;
      return prev.some((r: any) => r.id === id)
        ? prev.map((r: any) => r.id === id ? row : r)
        : [row, ...prev];
    });
  };

  const remove = async (id: string | number) => {
    await supabase.from(table).delete().eq('id', id);
    setData(prev => prev.filter((r: any) => r.id !== id));
  };

  return { data, setData, upsert, remove, loading };
}
```

> **Migration note:** While migrating, keep `usePersistedData` as a fallback. On first load, copy existing localStorage data into Supabase and clear localStorage.

---

## 2. Security — Proper Admin Authentication

**Files affected:** `src/admin/auth/AdminLogin.tsx`, `src/admin/AdminApp.tsx`

**Problem:**  
`VITE_ADMIN_PASSWORD` is a build-time environment variable — it gets compiled into the JavaScript bundle and is readable by anyone who opens DevTools → Sources or the Network tab. Even if you set it in Vercel, it will be visible in the deployed JS.

**Solution: Server-side authentication with Supabase Auth**

**Step 1 — Enable Email Auth in Supabase dashboard → Authentication → Providers → Email.**

**Step 2 — Replace `AdminLogin.tsx`:**
```tsx
// src/admin/auth/AdminLogin.tsx
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError('Invalid credentials');
    } else {
      onLogin();
    }
  };

  return (
    // ... existing JSX, swap form handler above
  );
};
```

**Step 3 — Update `AdminApp.tsx` to use Supabase session:**
```tsx
// src/admin/AdminApp.tsx
import { supabase } from '../lib/supabase';

export const AdminApp = () => {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = () => supabase.auth.signOut();

  if (isLoading) return null;
  if (!session) return <AdminLogin onLogin={() => {}} />;
  return <AdminLayout onLogout={handleLogout}>...</AdminLayout>;
};
```

> **Result:** The password never touches the browser. Only Supabase's servers validate it.

---

## 3. Admin — Fix the Mismatched Finance Data Keys

**Files affected:** `src/admin/pages/Dashboard/Dashboard.tsx`, `src/admin/pages/Profit/ProfitDashboard.tsx`

**Problem:**  
Dashboard reads `'finance_data'` but ProfitDashboard writes `'profit_chart_data'`. They are completely separate localStorage keys and never talk to each other.

**Solution:**  
Pick one canonical key and use it everywhere.

```ts
// Dashboard.tsx — change line:
const [financeData] = usePersistedData('finance_data', [...]);
// to:
const [financeData] = usePersistedData('profit_chart_data', [...]);
```

Or better — define the key in a shared constants file:
```ts
// src/admin/constants.ts
export const STORAGE_KEYS = {
  PROJECTS:      'projects',
  QUOTATIONS:    'quotations',
  AMC:           'amc_list',
  INVENTORY:     'inventory_items',
  REMINDERS:     'reminders',
  FINANCE:       'finance_data',          // single source of truth
  GALLERY:       'gallery_images',
  BEFORE_AFTER:  'gallery_before_after',
  TEMPLATES:     'whatsapp_templates',
} as const;
```

Then in both Dashboard and ProfitDashboard:
```ts
import { STORAGE_KEYS } from '../../constants';
const [financeData] = usePersistedData(STORAGE_KEYS.FINANCE, [...]);
```

---

## 4. Admin — Wire Up the onSave Prop in Leads Page

**File:** `src/admin/pages/Leads/Leads.tsx`

**Problem:**  
`QuotationDrawer` has an `onSave` prop that, when called, adds the quotation to the persisted list. But the Leads page never passes it. Generating a quotation from a lead creates a PDF but adds nothing to the Quotations page.

**Solution:**
```tsx
// Leads.tsx — add this import:
import { usePersistedData } from '../../hooks/usePersistedData';

// Inside the Leads component, add:
const [quotations, setQuotations] = usePersistedData('quotations', []);

const handleSaveQuotation = (newQuote: any) => {
  setQuotations((prev: any[]) => [newQuote, ...prev]);
};

// Then update the QuotationDrawer usage:
<QuotationDrawer
  isOpen={isQuoteDrawerOpen}
  onClose={() => setIsQuoteDrawerOpen(false)}
  leadData={selectedLead}
  onSave={handleSaveQuotation}   // ← add this line
/>
```

---

## 5. Admin — AMC Add/Edit Drawer

**File:** `src/admin/pages/AMC/AMC.tsx`

**Problem:**  
The "New AMC Contract" button does nothing. There is no way to add, edit, or delete AMC records.

**Solution:** Create a minimal `AMCDrawer` component:

```tsx
// Add inside AMC.tsx (or create src/admin/pages/AMC/AMCDrawer.tsx)

interface AMCRecord {
  id: string;
  customer: string;
  city: string;
  size: string;
  phone: string;
  lastService: string;
  nextService: string;
  status: 'Active' | 'Due Soon' | 'Overdue';
}

const AMCDrawer = ({ isOpen, onClose, onSave, existing }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: AMCRecord) => void;
  existing?: AMCRecord;
}) => {
  const [form, setForm] = useState<Partial<AMCRecord>>(existing || {
    customer: '', city: '', size: '', phone: '', lastService: '', nextService: '', status: 'Active',
  });

  const handleSave = () => {
    if (!form.customer || !form.phone) return;
    onSave({
      id: existing?.id || `AMC-${String(Date.now()).slice(-4)}`,
      customer: form.customer!,
      city: form.city || '',
      size: form.size || '',
      phone: form.phone!,
      lastService: form.lastService || new Date().toLocaleDateString('en-IN'),
      nextService: form.nextService || '',
      status: form.status || 'Active',
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/50 z-[300]" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-surface z-[301] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-depth">
              <h2 className="text-xl font-bold text-white">{existing ? 'Edit AMC' : 'New AMC Contract'}</h2>
              <button onClick={onClose}><X size={24} className="text-white" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {['customer', 'phone', 'city', 'size', 'lastService', 'nextService'].map((field) => (
                <div key={field}>
                  <label className="block text-xs font-bold text-white/40 uppercase mb-1">{field}</label>
                  <input
                    type={field.includes('Service') ? 'date' : 'text'}
                    value={(form as any)[field] || ''}
                    onChange={(e) => setForm(p => ({ ...p, [field]: e.target.value }))}
                    className="admin-input w-full px-4 py-2.5 rounded-xl"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm(p => ({ ...p, status: e.target.value as any }))}
                  className="admin-input w-full px-4 py-2.5 rounded-xl">
                  <option>Active</option>
                  <option>Due Soon</option>
                  <option>Overdue</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-white/5 bg-depth">
              <button onClick={handleSave}
                className="w-full bg-amber text-depth font-bold py-3 rounded-xl hover:bg-amber-light transition-colors">
                Save Contract
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
```

Then wire it up in `AMC.tsx`:
```tsx
const [showDrawer, setShowDrawer] = useState(false);
const [editingAMC, setEditingAMC] = useState<any>(null);
const [amcList, setAmcList] = usePersistedData('amc_list', [...]);

const handleSaveAMC = (record: any) => {
  setAmcList((prev: any[]) =>
    prev.some(a => a.id === record.id)
      ? prev.map(a => a.id === record.id ? record : a)
      : [record, ...prev]
  );
};

// Button:
<button onClick={() => { setEditingAMC(null); setShowDrawer(true); }}>
  <Plus /> New AMC Contract
</button>

// Add delete button per row, and edit button per row:
<button onClick={() => { setEditingAMC(amc); setShowDrawer(true); }}>Edit</button>
<button onClick={() => setAmcList((p: any[]) => p.filter(a => a.id !== amc.id))}>Delete</button>

<AMCDrawer isOpen={showDrawer} onClose={() => setShowDrawer(false)}
  onSave={handleSaveAMC} existing={editingAMC} />
```

---

## 6. Admin — Gallery Real Image Upload

**File:** `src/admin/pages/Gallery/GalleryManager.tsx`

**Problem:**  
The Upload button is a dead button. No file input, no storage, no handler.

**Solution using Supabase Storage (or Cloudinary):**

```tsx
// GalleryManager.tsx — replace Upload button with:
const fileInputRef = useRef<HTMLInputElement>(null);
const [uploading, setUploading] = useState(false);

const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  setUploading(true);

  // Option A: Supabase Storage
  const filename = `gallery/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from('solar-assets')
    .upload(filename, file, { cacheControl: '3600', upsert: false });

  if (!error && data) {
    const { data: { publicUrl } } = supabase.storage.from('solar-assets').getPublicUrl(filename);
    const newImage = {
      id: Date.now(),
      url: publicUrl,
      category: 'Residential',
      title: file.name.replace(/\.[^/.]+$/, ''),
    };
    setImages((prev: any[]) => [newImage, ...prev]);
  }

  // Option B: Cloudinary (no backend needed)
  // const formData = new FormData();
  // formData.append('file', file);
  // formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET);
  // const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD}/image/upload`, { method: 'POST', body: formData });
  // const { secure_url } = await res.json();

  setUploading(false);
  e.target.value = '';
};

// In JSX:
<input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
<button onClick={() => fileInputRef.current?.click()} disabled={uploading}
  className="flex items-center gap-2 bg-amber text-depth px-4 py-2.5 rounded-xl font-bold">
  {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
  {uploading ? 'Uploading…' : 'Upload'}
</button>
```

Also add a delete handler for images:
```tsx
const handleDeleteImage = async (id: number, url: string) => {
  if (!confirm('Delete this image?')) return;
  // Extract filename from URL and delete from storage:
  const path = url.split('/solar-assets/')[1];
  await supabase.storage.from('solar-assets').remove([path]);
  setImages((prev: any[]) => prev.filter(img => img.id !== id));
};
```

---

## 7. Admin — Dashboard Period Toggle (W/M)

**File:** `src/admin/pages/Dashboard/Dashboard.tsx`

**Problem:**  
The W/M buttons have no state, no handler, and no effect.

**Solution:**
```tsx
// Inside Dashboard component:
const [period, setPeriod] = useState<'W' | 'M'>('W');

const revenueData = useMemo(() => {
  const all = financeData as any[];
  if (period === 'W') {
    // Show last 7 data points labelled as days
    return all.slice(-7).map((m: any, i: number) => ({
      name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] ?? `D${i+1}`,
      value: m.revenue || 0,
    }));
  } else {
    // Show all points labelled as months
    return all.slice(-12).map((m: any, i: number) => ({
      name: m.month || m.name || `M${i+1}`,
      value: m.revenue || 0,
    }));
  }
}, [financeData, period]);

// In JSX, replace static buttons:
<button
  onClick={() => setPeriod('W')}
  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${period === 'W' ? 'bg-amber text-depth' : 'bg-depth text-white/40 hover:text-white'}`}
>W</button>
<button
  onClick={() => setPeriod('M')}
  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${period === 'M' ? 'bg-amber text-depth' : 'bg-depth text-white/40 hover:text-white'}`}
>M</button>
```

---

## 8. Admin — Add New Project Flow

**File:** `src/admin/pages/Projects/Projects.tsx`

**Problem:**  
`Projects.tsx` opens the drawer only when `selectedProject` is set. There is no "new project" path. The + button in the header has no effect either.

**Solution:** Add an `isNew` mode to the drawer:
```tsx
// Projects.tsx — update the + button:
const handleAddNew = () => {
  setSelectedProject({
    id: `PRJ-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
    customer: '',
    city: '',
    size: '',
    status: 'Site Survey',
    progress: 0,
    value: 0,
    expenses: 0,
    startDate: new Date().toLocaleDateString('en-IN'),
  });
  setIsDrawerOpen(true);
};

// Update handleSaveProject to also handle new projects:
const handleSaveProject = (updated: any) => {
  setProjects((prev: any[]) => {
    const exists = prev.some((p) => p.id === updated.id);
    return exists
      ? prev.map((p) => p.id === updated.id ? { ...p, ...updated } : p)
      : [updated, ...prev];  // ← prepend if new
  });
};

// In JSX header:
<button onClick={handleAddNew} className="...">
  <Plus size={18} /> New Project
</button>
```

---

## 9. Admin — Notifications Bell (Functional)

**File:** `src/admin/layout/TopBar.tsx`

**Problem:**  
The Bell icon shows a dot (implying notifications exist) but clicking it does nothing.

**Solution:** Aggregate real events from persisted data:
```tsx
// TopBar.tsx — add:
import { usePersistedData } from '../hooks/usePersistedData';

export const TopBar = ({ onLogout }: { onLogout: () => void }) => {
  const [reminders] = usePersistedData('reminders', []);
  const [amcList] = usePersistedData('amc_list', []);
  const [showNotifs, setShowNotifs] = useState(false);

  const notifications = [
    ...(reminders as any[])
      .filter((r: any) => r.status === 'Pending' && new Date(r.date) <= new Date())
      .map((r: any) => ({ type: 'Reminder', text: `${r.type} for ${r.customer} is overdue`, priority: 'high' })),
    ...(amcList as any[])
      .filter((a: any) => a.status === 'Overdue')
      .map((a: any) => ({ type: 'AMC', text: `AMC for ${a.customer} is overdue`, priority: 'high' })),
    ...(amcList as any[])
      .filter((a: any) => a.status === 'Due Soon')
      .map((a: any) => ({ type: 'AMC', text: `AMC for ${a.customer} due soon`, priority: 'medium' })),
  ];

  return (
    <header ...>
      <div className="relative">
        <button onClick={() => setShowNotifs(v => !v)} className="relative ...">
          <Bell size={16} />
          {notifications.length > 0 && (
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-amber rounded-full" />
          )}
        </button>

        {showNotifs && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <h3 className="font-bold text-white text-sm">Notifications ({notifications.length})</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0
                ? <p className="p-4 text-white/30 text-sm">All clear!</p>
                : notifications.map((n, i) => (
                    <div key={i} className="p-4 border-b border-white/5 hover:bg-white/5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${n.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-dim text-amber'}`}>
                        {n.type}
                      </span>
                      <p className="text-sm text-white/70 mt-1">{n.text}</p>
                    </div>
                  ))
              }
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
```

---

## 10. Admin — Project Document Upload

**File:** `src/admin/pages/Projects/ProjectDrawer.tsx`

**Problem:**  
The Documents tab shows hardcoded `DocCard` entries with static "Uploaded/Pending" statuses. The "Upload New" button and "Add Photo" buttons do nothing. Document state is not persisted.

**Solution:**
```tsx
// ProjectDrawer.tsx — add document state using usePersistedData:
const docsKey = `docs_${project?.id || 'new'}`;
const [documents, setDocuments] = usePersistedData(docsKey, [
  { name: 'Aadhar Card', status: 'Pending', url: null },
  { name: 'Electricity Bill', status: 'Pending', url: null },
  { name: 'Property Tax', status: 'Pending', url: null },
  { name: 'Site Photos', status: 'Pending', url: null },
  { name: 'Net Metering Form', status: 'Pending', url: null },
]);

const handleDocUpload = async (docName: string, file: File) => {
  // Upload to Supabase storage or Cloudinary
  const filename = `docs/${project.id}/${docName.replace(/ /g, '_')}_${Date.now()}`;
  const { data } = await supabase.storage.from('solar-assets').upload(filename, file);
  if (data) {
    const { data: { publicUrl } } = supabase.storage.from('solar-assets').getPublicUrl(filename);
    setDocuments((prev: any[]) =>
      prev.map(d => d.name === docName ? { ...d, status: 'Uploaded', url: publicUrl } : d)
    );
  }
};

// In JSX, for each DocCard, add a hidden file input:
<DocCard
  title={doc.name}
  status={doc.status}
  isWarning={doc.status === 'Pending'}
  onUpload={(file) => handleDocUpload(doc.name, file)}
/>
```

---

## 11. Admin — Quotation Status Tracking

**File:** `src/admin/pages/Quotations/Quotations.tsx`

**Problem:**  
Once a quotation is created it stays as "Sent" forever. There is no way to update the status to Accepted, Rejected, or Revised from the UI. The status chip is purely decorative.

**Solution:** Add an inline status dropdown per row:
```tsx
// Quotations.tsx — add update handler:
const handleStatusChange = (id: string, newStatus: string) => {
  setQuotations((prev: any[]) =>
    prev.map(q => q.id === id ? { ...q, status: newStatus } : q)
  );
};

// In the table row / card, replace the static status badge with:
<select
  value={quote.status}
  onChange={(e) => handleStatusChange(quote.id, e.target.value)}
  className={`text-[10px] font-bold px-2 py-0.5 rounded border-0 cursor-pointer ${statusColors[quote.status] || 'bg-depth text-white/40'}`}
  style={{ background: 'transparent' }}
>
  {['Sent', 'Accepted', 'Rejected', 'Revised'].map(s => (
    <option key={s} value={s}>{s}</option>
  ))}
</select>
```

---

## 12. Admin — Project Progress % Auto-sync

**File:** `src/admin/pages/Projects/ProjectDrawer.tsx`

**Problem:**  
When a project stage is advanced in `ProjectDrawer`, the `progress` percentage on the project card does not update automatically. The progress bar is a separate field that must be manually set.

**Solution:** Derive progress from the stage index automatically:
```tsx
// ProjectDrawer.tsx — update handleSave:
const handleSave = () => {
  if (onSave && project) {
    const progressMap: Record<string, number> = {
      'Site Survey': 5,
      'Material Procurement': 20,
      'Installation': 40,
      'Net Metering': 60,
      'MSEDCL Approval': 75,
      'Subsidy Claim': 90,
      'Handover': 100,
    };
    const newStatus = stages[currentStageIndex as number];
    onSave({
      ...project,
      status: newStatus,
      progress: progressMap[newStatus] ?? project.progress,
      expenses: totalExpenses,
    });
  }
  onClose();
};
```

---

## 13. Admin — Export Reports (Projects & Finance)

**Files:** `src/admin/pages/Projects/Projects.tsx`, `src/admin/pages/Profit/ProfitDashboard.tsx`

**Problem:**  
Only the Leads page has a CSV export. Projects and Finance data cannot be exported, which makes the admin panel less useful for business reporting.

**Solution:** Add a reusable export utility:
```ts
// src/admin/utils/exportCSV.ts
export function exportToCSV(filename: string, headers: string[], rows: string[][]) {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }); // \uFEFF = BOM for Excel
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
```

**Usage in Projects:**
```tsx
import { exportToCSV } from '../../utils/exportCSV';

const handleExport = () => {
  exportToCSV(
    'projects',
    ['ID', 'Customer', 'City', 'Size', 'Status', 'Progress%', 'Value', 'Expenses', 'Profit'],
    projects.map((p: any) => [
      p.id, p.customer, p.city, p.size, p.status, p.progress,
      p.value, p.expenses, p.value - p.expenses,
    ])
  );
};
```

---

## 14. Admin — Search Across All Sections

**Files:** `src/admin/layout/TopBar.tsx`

**Problem:**  
Each admin page has its own local search input. There is no global search. If an admin wants to find "Suresh Patil" they must check Leads, Quotations, Projects, and AMC separately.

**Solution:** Add a global search in `TopBar`:
```tsx
// TopBar.tsx — add global search command palette:
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePersistedData } from '../hooks/usePersistedData';

// Inside TopBar:
const [query, setQuery] = useState('');
const [results, setResults] = useState<any[]>([]);
const navigate = useNavigate();

const [projects] = usePersistedData('projects', []);
const [quotations] = usePersistedData('quotations', []);

const search = (q: string) => {
  if (!q.trim()) { setResults([]); return; }
  const lower = q.toLowerCase();
  const hits = [
    ...(projects as any[]).filter(p => p.customer?.toLowerCase().includes(lower))
      .map(p => ({ type: 'Project', label: p.customer, sub: p.id, path: '/admin/projects' })),
    ...(quotations as any[]).filter(q => q.customer?.toLowerCase().includes(lower))
      .map(q => ({ type: 'Quotation', label: q.customer, sub: q.id, path: '/admin/quotations' })),
  ];
  setResults(hits.slice(0, 6));
};

// Keyboard shortcut: Cmd/Ctrl + K to focus search
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('global-search')?.focus();
    }
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, []);
```

---

## 15. Frontend — Quote Form Submission Feedback

**File:** `src/components/sections/Quote.tsx`

**Problem:**  
After form submission the app uses `mode: 'no-cors'` which means it can never detect whether the Google Sheets write succeeded or failed. The user always sees the success screen even if the submission silently failed. There is also no retry mechanism.

**Solution:**

**Step 1:** Deploy a small Vercel serverless function to proxy the submission:
```ts
// api/submit-lead.ts (Vercel Edge function)
export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const body = await req.json();
  const SHEETS_URL = process.env.GOOGLE_SHEETS_URL!; // server-side, not VITE_

  const res = await fetch(SHEETS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return new Response(JSON.stringify({ ok: res.ok }), {
    status: res.ok ? 200 : 500,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

**Step 2:** Update `Quote.tsx` to call this proxy and handle errors:
```tsx
// Quote.tsx
const onSubmit = async (data: FormData) => {
  try {
    const res = await fetch('/api/submit-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp: new Date().toISOString(), ...data }),
    });

    if (!res.ok) throw new Error('Submission failed');
    setIsSubmitted(true);
    // ... WhatsApp redirect
  } catch (err) {
    setError('Submission failed. Please try again or call us directly.');
  }
};
```

---

## 16. Frontend — Calculator "Get Quote" Pre-fill

**File:** `src/components/sections/Calculator.tsx`, `src/components/sections/Quote.tsx`

**Problem:**  
After using the calculator the user clicks "Get Exact Quote", but the quote form starts blank. None of the calculator values (bill amount, system size, roof area) are carried over, forcing the user to re-enter the same data.

**Solution:** Use `sessionStorage` or a React context to pass values:

```tsx
// Calculator.tsx — update the button:
const handleGetExactQuote = () => {
  sessionStorage.setItem('calc_prefill', JSON.stringify({
    bill: bill,
    size: `${results.systemSize}kW`,
    roof: roof < 200 ? 'Not Sure' : 'Flat RCC',
  }));
  document.getElementById('get-quote')?.scrollIntoView({ behavior: 'smooth' });
};
```

```tsx
// Quote.tsx — read the prefill on mount:
const { reset } = useForm<FormData>({ defaultValues: { ... } });

useEffect(() => {
  const prefill = sessionStorage.getItem('calc_prefill');
  if (prefill) {
    const data = JSON.parse(prefill);
    reset(prev => ({ ...prev, bill: data.bill, size: data.size, roof: data.roof }));
    sessionStorage.removeItem('calc_prefill');
  }
}, [reset]);
```

---

## 17. Frontend — City Dropdown Is Too Restrictive

**File:** `src/components/sections/Quote.tsx`

**Problem:**  
The city dropdown only lists 5 Maharashtra cities: Mumbai, Pune, Nagpur, Nashik, Aurangabad. Maharashtra has 36 districts and solar is viable across all of them. A customer from Kolhapur, Solapur, Jalgaon, or any other city is forced to select "Other" with no value.

**Solution:** Replace with a searchable input or an expanded list:
```tsx
// Option A — free-text with datalist (HTML5, no library needed):
<div>
  <label ...>City *</label>
  <input
    id="city"
    list="city-list"
    {...register('city', { required: true })}
    placeholder="Type your city..."
    className="..."
  />
  <datalist id="city-list">
    {['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Kolhapur', 'Solapur',
      'Thane', 'Navi Mumbai', 'Amravati', 'Latur', 'Dhule', 'Jalgaon',
      'Ahmednagar', 'Akola', 'Nanded', 'Satara', 'Sangli', 'Ratnagiri',
      'Chandrapur', 'Yavatmal', 'Osmanabad'].map(city => (
      <option key={city} value={city} />
    ))}
  </datalist>
</div>
```

---

## 18. Frontend — Phone Number Hardcoded in Multiple Files

**Files:** `src/components/sections/Quote.tsx`, `src/admin/pages/Quotations/QuotationDrawer.tsx`, `src/admin/utils/generateQuotationPDF.ts`

**Problem:**  
The business phone number `918237655610` is hardcoded in at least three different files. If the phone number ever changes, it must be hunted down and updated in multiple places.

**Solution:** Centralise it:
```ts
// src/config.ts
export const BUSINESS_CONFIG = {
  name:     import.meta.env.VITE_BUSINESS_NAME    || 'Asrar Solar',
  phone:    import.meta.env.VITE_BUSINESS_PHONE   || '918237655610',
  tagline:  import.meta.env.VITE_BUSINESS_TAGLINE || 'Maharashtra Solar Specialists',
  whatsapp: `https://wa.me/${import.meta.env.VITE_BUSINESS_PHONE || '918237655610'}`,
} as const;
```

Then in every file:
```ts
import { BUSINESS_CONFIG } from '../../../config';
// Replace: window.open(`https://wa.me/918237655610?...`)
// With:    window.open(`${BUSINESS_CONFIG.whatsapp}?...`)
```

---

## 19. Performance — Code Splitting & Lazy Loading

**File:** `src/admin/AdminApp.tsx`

**Problem:**  
All admin pages — Dashboard, Leads, Quotations, Projects, ProfitDashboard, AMC, Reminders, Gallery, WhatsAppTemplates, Inventory — are imported statically at the top of `AdminApp.tsx`. This means the entire admin bundle (including `recharts`, `jspdf`, `jspdf-autotable`, `qrcode`) is loaded even when a user visits the landing page without going anywhere near the admin panel.

**Solution:**
```tsx
// AdminApp.tsx — replace all static imports with lazy ones:
import { lazy, Suspense } from 'react';

const Dashboard        = lazy(() => import('./pages/Dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const Leads            = lazy(() => import('./pages/Leads/Leads').then(m => ({ default: m.Leads })));
const Quotations       = lazy(() => import('./pages/Quotations/Quotations').then(m => ({ default: m.Quotations })));
const Projects         = lazy(() => import('./pages/Projects/Projects').then(m => ({ default: m.Projects })));
const ProfitDashboard  = lazy(() => import('./pages/Profit/ProfitDashboard').then(m => ({ default: m.ProfitDashboard })));
const AMC              = lazy(() => import('./pages/AMC/AMC').then(m => ({ default: m.AMC })));
const Reminders        = lazy(() => import('./pages/Reminders/Reminders').then(m => ({ default: m.Reminders })));
const GalleryManager   = lazy(() => import('./pages/Gallery/GalleryManager').then(m => ({ default: m.GalleryManager })));
const WhatsAppTemplates = lazy(() => import('./pages/Templates/WhatsAppTemplates').then(m => ({ default: m.WhatsAppTemplates })));
const Inventory        = lazy(() => import('./pages/Inventory/Inventory').then(m => ({ default: m.Inventory })));

// Wrap routes in Suspense:
<Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-amber" size={32} /></div>}>
  <Routes>
    {/* ...routes... */}
  </Routes>
</Suspense>
```

**Expected improvement:** Landing page JS bundle reduces by ~30–40% since `jspdf`, `jspdf-autotable`, `qrcode`, and chart libraries are excluded from the initial load.

---

## 20. Performance — Image Optimisation

**File:** `public/images/`, `src/admin/pages/Gallery/GalleryManager.tsx`

**Problem:**  
The `public/images/` directory contains `.webp` and `.jpg` files but they are served as-is with no responsive sizing, no lazy loading attribute, and no width/height specified (causes layout shift).

**Solution:**
```tsx
// Any <img> tag serving project/gallery photos:
<img
  src={image.url}
  alt={image.title}
  loading="lazy"          // ← native lazy loading
  decoding="async"        // ← non-blocking decode
  width={400}             // ← prevents layout shift
  height={400}
  className="w-full h-full object-cover"
/>
```

For the public `/images/` folder, convert large JPGs to WebP:
```bash
# Install cwebp and batch convert:
for f in public/images/*.jpg; do cwebp "$f" -o "${f%.jpg}.webp" -q 85; done
```

---

## 21. Reliability — Error Boundaries

**File:** `src/App.tsx`, `src/admin/AdminApp.tsx`

**Problem:**  
There are no React error boundaries anywhere. If any component throws an unhandled error (e.g. `JSON.parse` on corrupt localStorage data, a null reference in a chart), the entire app goes blank with no message.

**Solution:**
```tsx
// src/components/ErrorBoundary.tsx
import React from 'react';

interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
    // Optionally: send to Sentry / LogRocket
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07090F] flex flex-col items-center justify-center p-8 text-center">
          <div className="text-amber text-5xl mb-6">⚡</div>
          <h2 className="text-2xl font-bold text-white mb-3">Something went wrong</h2>
          <p className="text-white/40 mb-6 max-w-sm">{this.state.error?.message}</p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
            className="bg-amber text-depth font-bold px-6 py-3 rounded-xl hover:bg-amber-light transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

Wrap the app and admin routes:
```tsx
// App.tsx:
<ErrorBoundary>
  <LanguageProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/*" element={
          <ErrorBoundary>
            <AdminApp />
          </ErrorBoundary>
        } />
      </Routes>
    </BrowserRouter>
  </LanguageProvider>
</ErrorBoundary>
```

---

## 22. Reliability — No Loading State on Admin Pages

**Files:** `src/admin/pages/AMC/AMC.tsx`, `src/admin/pages/Inventory/Inventory.tsx`, `src/admin/pages/Reminders/Reminders.tsx`

**Problem:**  
Pages that read from `usePersistedData` render immediately with data or empty states. There is no visual indication that data is loading, which causes a flash of empty content on first render before localStorage is read.

**Solution:** Add a `loading` state to `usePersistedData`:
```ts
// usePersistedData.ts — add loading state:
export function usePersistedData<T>(key: string, initialData: T) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T>(() => {
    const saved = localStorage.getItem(`asrar_admin_${key}`);
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => { setLoading(false); }, []); // Mark loaded after mount

  // ... rest unchanged

  return [data, setData, loading] as const;
}
```

Then in pages:
```tsx
const [items, setItems, loading] = usePersistedData('inventory_items', []);

if (loading) return (
  <div className="space-y-3">
    {[1,2,3].map(i => <div key={i} className="admin-card h-20 animate-pulse" />)}
  </div>
);
```

---

## 23. UX — Confirm Before Destructive Actions

**Files:** `src/admin/pages/Quotations/Quotations.tsx`, `src/admin/pages/Inventory/Inventory.tsx`

**Problem:**  
Some delete actions use `window.confirm()` (browser native) which looks completely out of place with the app's dark design. Others use no confirmation at all.

**Solution:** Replace with a styled inline confirmation component:
```tsx
// src/admin/components/ConfirmDialog.tsx
export const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }: {
  isOpen: boolean; title: string; message: string;
  onConfirm: () => void; onCancel: () => void;
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[400]" onClick={onCancel} />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 flex items-center justify-center z-[401] p-6">
          <div className="bg-surface border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-white/40 mb-6">{message}</p>
            <div className="flex gap-3">
              <button onClick={onCancel} className="flex-1 py-2.5 bg-depth border border-white/10 text-white/70 rounded-xl font-bold hover:text-white transition-colors">
                Cancel
              </button>
              <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);
```

---

## 24. UX — Toast Notification System

**Files:** All admin pages that save/delete data

**Problem:**  
There is no feedback when operations succeed or fail. Saving a project, deleting a quotation, or adding inventory — all happen silently. The user has no way to know if the action worked.

**Solution:** Implement a lightweight toast hook:
```tsx
// src/admin/hooks/useToast.ts
import { useState, useCallback } from 'react';

interface Toast { id: number; message: string; type: 'success' | 'error' | 'info'; }

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  return { toasts, show };
};

// src/admin/components/ToastContainer.tsx
export const ToastContainer = ({ toasts }: { toasts: any[] }) => (
  <div className="fixed bottom-24 md:bottom-6 right-6 z-[500] flex flex-col gap-2">
    {toasts.map(toast => (
      <motion.div key={toast.id}
        initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }}
        className={`px-4 py-3 rounded-xl shadow-xl text-sm font-bold flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-emerald text-white' :
          toast.type === 'error'   ? 'bg-red-500 text-white' :
          'bg-sky text-depth'
        }`}>
        {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'} {toast.message}
      </motion.div>
    ))}
  </div>
);
```

Usage in `AdminLayout`:
```tsx
const { toasts, show: showToast } = useToast();
// Pass showToast down via context or props
// In child pages: showToast('Project saved successfully');
```

---

## 25. UX — Keyboard Shortcuts for Admin Power Users

**File:** `src/admin/AdminApp.tsx` or a new `useKeyboardShortcuts.ts` hook

**Problem:**  
There are no keyboard shortcuts. Power users managing many leads/projects per day must click through menus every time.

**Solution:**
```ts
// src/admin/hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'g') {
        const next = { d: '/admin/dashboard', l: '/admin/leads', q: '/admin/quotations',
                        p: '/admin/projects', i: '/admin/inventory' };
        // Wait 500ms for second key
        const timer = setTimeout(() => {}, 500);
        const secondKey = (e2: KeyboardEvent) => {
          clearTimeout(timer);
          const path = (next as any)[e2.key];
          if (path) navigate(path);
          window.removeEventListener('keydown', secondKey);
        };
        window.addEventListener('keydown', secondKey, { once: true });
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);
};
```

Register shortcuts:
- `g` then `d` → Dashboard  
- `g` then `l` → Leads  
- `g` then `q` → Quotations  
- `g` then `p` → Projects  
- `Ctrl/Cmd + K` → Global search (see #14)

---

## 26. DX — Add .env.example and Setup Guide

**Problem:**  
There is no `.env.example` and no setup documentation beyond a generic README. New developers have no way to know what environment variables are required.

**Solution — create `.env.example`:**
```env
# Google Sheets Integration (public website lead form)
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# Admin panel password (DEV ONLY — never use in production, see Security section)
VITE_ADMIN_PASSWORD=admin123

# Business info (used in PDF generation and WhatsApp messages)
VITE_BUSINESS_NAME=Your Solar Company
VITE_BUSINESS_PHONE=91XXXXXXXXXX
VITE_BUSINESS_TAGLINE=Maharashtra Solar Specialists

# Supabase (for real backend — replace localStorage)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Cloudinary (for image uploads — optional alternative to Supabase Storage)
VITE_CLOUDINARY_CLOUD=your-cloud-name
VITE_CLOUDINARY_PRESET=your-upload-preset
```

---

## 27. DX — TypeScript Strict Mode & Remove `any`

**File:** `tsconfig.json`, all admin pages

**Problem:**  
`any` is used extensively across the admin panel — `(projects as any[])`, `(p: any)`, function parameters typed as `any`. This defeats TypeScript's purpose and hides bugs.

**Solution — enable strict mode:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

**Immediately replace the most impactful `any` casts.** Example for `usePersistedData`:
```ts
// Before:
const [projects] = usePersistedData('projects', []);
(projects as any[]).filter((p: any) => ...)

// After — define types:
interface Project {
  id: string; customer: string; city: string; size: string;
  status: string; progress: number; value: number; expenses: number; startDate: string;
}
const [projects] = usePersistedData<Project[]>('projects', []);
projects.filter(p => !)  // ← fully typed, autocomplete works
```

---

## 28. DX — Add ESLint + Prettier

**Problem:**  
There is no linting configuration beyond `tsc --noEmit` in the `lint` script. Inconsistent code style, unused imports, and common React mistakes go unchecked.

**Solution:**
```bash
npm install -D eslint @eslint/js eslint-plugin-react-hooks \
  eslint-plugin-react-refresh @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser prettier eslint-config-prettier
```

**Create `eslint.config.js`:**
```js
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { parser: tsParser },
    plugins: { '@typescript-eslint': tsPlugin, 'react-hooks': reactHooks },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
```

**Create `.prettierrc`:**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

## 29. SEO & Accessibility — Landing Page

**Files:** `index.html`, `src/components/sections/`

**Problem:**  
- `index.html` has a generic `<title>` and no meta description or OG tags — the page will appear as "react-example" in Google search results and WhatsApp link previews
- Images lack `alt` text or have empty `alt=""`
- Some interactive elements are buttons styled as divs with no `aria-label`
- No `lang` attribute on the `<html>` tag

**Solution:**

**1. Fix `index.html`:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Asrar Solar — Maharashtra Solar Panel Installation & AMC</title>
  <meta name="description" content="Maharashtra's trusted solar panel installation experts. Get a free quote for residential and commercial solar systems. PM Surya Ghar subsidy assistance." />
  <meta property="og:title" content="Asrar Solar — Solar Panel Installation" />
  <meta property="og:description" content="Get a free solar quote for your home or business in Maharashtra." />
  <meta property="og:image" content="/images/og-cover.jpg" />
  <meta property="og:type" content="website" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://yourdomain.com" />
</head>
```

**2. Add `alt` text to all images in Gallery and VisualProof.**

**3. Add `aria-label` to icon-only buttons:**
```tsx
<button aria-label="Close drawer" onClick={onClose}>
  <X size={24} />
</button>
```

---

## 30. Mobile — Safe Area & Bottom Nav Padding

**Files:** `src/admin/pages/AMC/AMC.tsx`, `src/admin/pages/Reminders/Reminders.tsx`, `src/admin/pages/Inventory/Inventory.tsx`, `src/admin/pages/Leads/Leads.tsx`, `src/admin/pages/Dashboard/Dashboard.tsx`

**Problem:**  
The `BottomNav` is fixed at the bottom on mobile. The `AdminLayout` sets `pb-24` on the `<main>` tag, which should be sufficient. However, several pages add their own container with `space-y-6` that overrides the padding, and on devices with a home indicator (iPhone with notch) the `pb-24` is not enough — content is still obscured.

**Solution:**

**1. In `AdminLayout`, update the main padding to use safe area inset:**
```tsx
// AdminLayout.tsx
<main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#07090F] p-4 md:p-6"
  style={{ paddingBottom: 'max(6rem, calc(5rem + env(safe-area-inset-bottom)))' }}>
```

**2. Remove conflicting inner padding from pages and let the layout handle it:**
```tsx
// Every admin page's root div:
<motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
  {/* Remove any manual pb-20, pb-24 from here — layout handles it */}
```

**3. Add safe area support to `index.html`:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

---

## Quick Priority Matrix

| Priority | # | Topic | Effort | Impact |
|----------|---|-------|--------|--------|
| 🔴 Do First | 3 | Fix mismatched finance keys | 5 min | Fixes Dashboard profit display immediately |
| 🔴 Do First | 4 | Wire onSave in Leads | 5 min | Quotations now persist from leads |
| 🔴 Do First | 7 | Dashboard W/M toggle | 15 min | Fixes a clearly broken UI element |
| 🔴 Do First | 8 | Add new project flow | 20 min | Projects page becomes actually usable |
| 🔴 Do First | 18 | Centralise phone number | 10 min | Reduces future maintenance risk |
| 🟡 High | 5 | AMC Add/Edit drawer | 1 hour | Makes AMC section fully functional |
| 🟡 High | 11 | Quotation status tracking | 30 min | Quotation lifecycle becomes trackable |
| 🟡 High | 12 | Project progress auto-sync | 15 min | Stage changes now reflect on cards |
| 🟡 High | 13 | CSV export for all pages | 30 min | Business reporting works |
| 🟡 High | 24 | Toast notifications | 1 hour | Admin gets feedback on every action |
| 🟡 High | 21 | Error boundaries | 30 min | App no longer crashes silently |
| 🟠 Medium | 2 | Server-side auth | 2 hours | Critical security fix |
| 🟠 Medium | 1 | Supabase backend | 4 hours | Data survives browser resets |
| 🟠 Medium | 6 | Gallery upload | 2 hours | Gallery becomes fully functional |
| 🟠 Medium | 9 | Notifications bell | 1 hour | Actionable reminders from TopBar |
| 🟠 Medium | 15 | Quote form reliability | 1 hour | Submission errors surface to user |
| 🟠 Medium | 19 | Lazy loading | 30 min | Landing page loads ~35% faster |
| 🔵 Polish | 16 | Calculator pre-fill | 30 min | Better conversion UX |
| 🔵 Polish | 14 | Global search | 2 hours | Power-user admin experience |
| 🔵 Polish | 29 | SEO meta tags | 30 min | Proper Google/WhatsApp previews |
| 🔵 Polish | 25 | Keyboard shortcuts | 1 hour | Admin speed for power users |
| 🔵 Polish | 27 | TypeScript strict | Ongoing | Long-term code quality |
