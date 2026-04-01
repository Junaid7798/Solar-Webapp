import { GOOGLE_SHEETS_URL } from './constants';

export interface RawLead {
  timestamp?: string;
  Timestamp?: string;
  name?: string;
  Name?: string;
  phone?: string;
  Phone?: string;
  email?: string;
  Email?: string;
  city?: string;
  City?: string;
  address?: string;
  Address?: string;
  services?: string;
  Services?: string;
  bill?: string;
  Bill?: string;
  size?: string;
  Size?: string;
  roof?: string;
  Roof?: string;
  time?: string;
  Time?: string;
  message?: string;
  Message?: string;
  [key: number]: string;
}

export interface LeadRecord {
  id: string;
  timestamp: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  services: string;
  bill: string;
  size: string;
  roof: string;
  time: string;
  message: string;
  raw: RawLead;
}

function field(raw: RawLead, ...keys: Array<keyof RawLead | number>) {
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return '';
}

export function normalizeLead(raw: RawLead, index = 0): LeadRecord {
  const timestamp = field(raw, 'timestamp', 'Timestamp', 0);
  const phone = field(raw, 'phone', 'Phone', 2);

  return {
    id: `${timestamp || 'lead'}-${phone || index}`,
    timestamp,
    name: field(raw, 'name', 'Name', 1),
    phone,
    email: field(raw, 'email', 'Email', 3),
    city: field(raw, 'city', 'City', 4),
    address: field(raw, 'address', 'Address', 5),
    services: field(raw, 'services', 'Services', 6),
    bill: field(raw, 'bill', 'Bill', 7),
    size: field(raw, 'size', 'Size', 8),
    roof: field(raw, 'roof', 'Roof', 9),
    time: field(raw, 'time', 'Time', 10),
    message: field(raw, 'message', 'Message', 11),
    raw,
  };
}

export async function fetchLeadSubmissions(signal?: AbortSignal) {
  if (!GOOGLE_SHEETS_URL) {
    return [];
  }

  const response = await fetch(GOOGLE_SHEETS_URL, { signal });

  if (!response.ok) {
    throw new Error(`Lead feed request failed with ${response.status}`);
  }

  const payload = (await response.json()) as RawLead[];

  if (!Array.isArray(payload)) {
    throw new Error('Lead feed returned an invalid payload');
  }

  return payload.map((lead, index) => normalizeLead(lead, index));
}

export function formatLeadDate(value: string, options?: Intl.DateTimeFormatOptions) {
  if (!value) {
    return 'Recently';
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString('en-IN', options);
}

export function leadSubmittedWithinDays(lead: LeadRecord, days: number) {
  if (!lead.timestamp) {
    return false;
  }

  const parsed = new Date(lead.timestamp);

  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
  return parsed.getTime() >= threshold;
}

export function parseSystemSize(size: string | undefined | null): number {
  if (!size) return 0;
  return parseFloat(size.replace(/[^0-9.]/g, '')) || 0;
}

function escapeCsv(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export function buildLeadCsv(leads: LeadRecord[]) {
  const headers = ['Date', 'Name', 'Phone', 'Email', 'City', 'Address', 'Services', 'Bill', 'Size', 'Roof', 'Time', 'Message'];

  const rows = leads.map((lead) => [
    escapeCsv(formatLeadDate(lead.timestamp, { dateStyle: 'medium' })),
    escapeCsv(lead.name),
    escapeCsv(lead.phone),
    escapeCsv(lead.email),
    escapeCsv(lead.city),
    escapeCsv(lead.address),
    escapeCsv(lead.services),
    escapeCsv(lead.bill),
    escapeCsv(lead.size),
    escapeCsv(lead.roof),
    escapeCsv(lead.time),
    escapeCsv(lead.message),
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
}
