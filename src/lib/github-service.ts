export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  pushed_at: string;
  topics?: string[];
  homepage?: string | null;
}

export interface GitHubEvent {
  id: string;
  type: string;
  repo: {
    name: string;
    url: string;
  };
  created_at: string;
  payload?: {
    commits?: Array<{
      sha: string;
      message: string;
    }>;
    ref?: string;
    ref_type?: string;
    head?: string;
    action?: string;
    number?: number | string;
    pull_request?: { title?: string; html_url?: string };
    issue?: { number?: number | string; title?: string; html_url?: string };
    forkee?: { name?: string; html_url?: string };
  };
}

const GITHUB_USERNAME = "MukulS07";
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes in-memory cache

interface CacheItem<T> {
  timestamp: number;
  data: T;
}

let reposCache: CacheItem<GitHubRepo[]> | null = null;
let eventsCache: CacheItem<GitHubEvent[]> | null = null;
let profileCache: CacheItem<{ public_repos: number; followers: number }> | null = null;

function getStoredItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (err) {
    return null;
  }
}

function setStoredItem<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    // Ignore storage quota errors
  }
}

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  if (reposCache && Date.now() - reposCache.timestamp < CACHE_TTL_MS) {
    return reposCache.data;
  }

  const stored = getStoredItem<GitHubRepo[]>("ms_gh_repos");
  if (stored && stored.length > 0 && (!reposCache || Date.now() - reposCache.timestamp >= CACHE_TTL_MS)) {
    reposCache = { timestamp: Date.now(), data: stored };
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100&t=${Date.now()}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      },
    );
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const data: GitHubRepo[] = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      reposCache = { timestamp: Date.now(), data };
      setStoredItem("ms_gh_repos", data);
      return data;
    }
  } catch (err) {
    console.warn("Failed to fetch GitHub repos, using cached storage fallback:", err);
  }

  return reposCache?.data || stored || [];
}

export async function fetchGitHubEvents(): Promise<GitHubEvent[]> {
  if (eventsCache && Date.now() - eventsCache.timestamp < CACHE_TTL_MS) {
    return eventsCache.data;
  }

  const stored = getStoredItem<GitHubEvent[]>("ms_gh_events");
  if (stored && stored.length > 0 && (!eventsCache || Date.now() - eventsCache.timestamp >= CACHE_TTL_MS)) {
    eventsCache = { timestamp: Date.now(), data: stored };
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=15&t=${Date.now()}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      },
    );
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const data: GitHubEvent[] = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      eventsCache = { timestamp: Date.now(), data };
      setStoredItem("ms_gh_events", data);
      return data;
    }
  } catch (err) {
    console.warn("Failed to fetch GitHub events, using cached storage fallback:", err);
  }

  return eventsCache?.data || stored || [];
}

export async function fetchGitHubProfile(): Promise<{
  public_repos: number;
  followers: number;
} | null> {
  if (profileCache && Date.now() - profileCache.timestamp < CACHE_TTL_MS) {
    return profileCache.data;
  }

  const stored = getStoredItem<{ public_repos: number; followers: number }>("ms_gh_profile");

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}?t=${Date.now()}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const data = await res.json();
    if (data && typeof data.public_repos === "number") {
      const result = { public_repos: data.public_repos, followers: data.followers };
      profileCache = { timestamp: Date.now(), data: result };
      setStoredItem("ms_gh_profile", result);
      return result;
    }
  } catch (err) {
    console.warn("Failed to fetch GitHub profile, using cached storage fallback:", err);
  }

  return profileCache?.data || stored || null;
}

/**
 * SHA-memoized commit message fetcher.
 * Saves commit messages by SHA in localStorage to avoid redundant GitHub API rate limits.
 */
export async function fetchCommitMessage(repoName: string, sha: string): Promise<string | null> {
  if (!sha || !repoName) return null;

  const storageKey = `ms_gh_commit_${sha}`;
  const cachedMsg = getStoredItem<string>(storageKey);
  if (cachedMsg) return cachedMsg;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/commits/${sha}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const msg = data.commit?.message || null;
    if (msg) {
      setStoredItem(storageKey, msg);
    }
    return msg;
  } catch (err) {
    return null;
  }
}

/**
 * Intelligent helper to match static project entries to real live GitHub repos.
 */
export function matchRepoForProject(
  repos: GitHubRepo[],
  title: string,
  links: Array<{ label: string; href: string }> = [],
): GitHubRepo | undefined {
  if (!repos || repos.length === 0) return undefined;

  const titleLower = title.toLowerCase();
  const firstWord = titleLower.split(" ")[0].replace(/[^a-z0-9]/g, "");

  // 1. Check direct link match first
  for (const link of links) {
    if (link.href && link.href.includes("github.com/MukulS07/")) {
      const targetRepoName = link.href
        .split("github.com/MukulS07/")[1]
        ?.split("/")[0]
        ?.toLowerCase();
      if (targetRepoName) {
        const found = repos.find((r) => r.name.toLowerCase() === targetRepoName);
        if (found) return found;
      }
    }
  }

  // 2. Name-based fuzzy substring matching
  return repos.find((r) => {
    const repoNameLower = r.name.toLowerCase();

    // Check specific known aliases
    if (firstWord === "ecogeoguard" && repoNameLower.includes("ecogeoguard")) return true;
    if (firstWord === "inventrox" && repoNameLower.includes("inventrox")) return true;
    if (firstWord === "apexf1" && repoNameLower.includes("apexf1")) return true;
    if (titleLower.includes("portfolio") && repoNameLower.includes("portfolio")) return true;

    // General substring match
    return (
      repoNameLower === firstWord ||
      repoNameLower.includes(firstWord) ||
      firstWord.includes(repoNameLower)
    );
  });
}
