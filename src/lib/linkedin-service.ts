import staticUpdates from "@/data/linkedin-updates.json";

export interface LinkedInUpdate {
  id?: string;
  date: string;
  type: "MILESTONE" | "PRODUCT" | "RESEARCH" | "ARTICLE" | "ENGINEERING" | "RELEASE";
  text: string;
  link: string;
}

const STORAGE_KEY = "ms_custom_linkedin_updates";

function getStoredCustomUpdates(): LinkedInUpdate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LinkedInUpdate[]) : [];
  } catch (e) {
    return [];
  }
}

export function getLinkedInUpdates(): LinkedInUpdate[] {
  const custom = getStoredCustomUpdates();
  // Merge custom updates at the beginning (newer) and deduplicate by id/text
  const combined = [...custom, ...(staticUpdates as LinkedInUpdate[])];
  const seen = new Set<string>();
  const unique: LinkedInUpdate[] = [];

  for (const item of combined) {
    const key = item.id || item.text.slice(0, 40);
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }
  }

  // Sort by date descending
  return unique.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function addLinkedInUpdate(update: Omit<LinkedInUpdate, "id"> & { id?: string }): LinkedInUpdate[] {
  if (typeof window === "undefined") return getLinkedInUpdates();
  const custom = getStoredCustomUpdates();
  const newItem: LinkedInUpdate = {
    id: update.id || `custom-${Date.now()}`,
    date: update.date || new Date().toISOString(),
    type: update.type || "MILESTONE",
    text: update.text,
    link: update.link || "https://www.linkedin.com/in/mukul-sharma-07m",
  };

  const updated = [newItem, ...custom];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Dispatch custom event for real-time reactive re-renders
    window.dispatchEvent(new CustomEvent("ms_linkedin_updated"));
  } catch (e) {
    console.warn("Failed to save custom LinkedIn update:", e);
  }

  return getLinkedInUpdates();
}

export function formatRelativeTime(dateStr: string): string {
  const createdTime = new Date(dateStr).getTime();
  if (isNaN(createdTime)) return "recently";
  const now = Date.now();
  const diffMs = Math.max(0, now - createdTime);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}
