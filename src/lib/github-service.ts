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
  };
}

const GITHUB_USERNAME = "MukulS07";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

interface CacheItem<T> {
  timestamp: number;
  data: T;
}

const cache: Record<string, CacheItem<any>> = {};

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  const cacheKey = "github_repos";
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL_MS) {
    return cache[cacheKey].data;
  }

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100`, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });
    if (!res.ok) throw new Error(`GitHub API error: ${res.statusText}`);
    const data: GitHubRepo[] = await res.json();
    cache[cacheKey] = { timestamp: Date.now(), data };
    return data;
  } catch (err) {
    console.warn("Failed to fetch GitHub repos, using fallback:", err);
    return [];
  }
}

export async function fetchGitHubEvents(): Promise<GitHubEvent[]> {
  const cacheKey = "github_events";
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL_MS) {
    return cache[cacheKey].data;
  }

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=10`, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });
    if (!res.ok) throw new Error(`GitHub API error: ${res.statusText}`);
    const data: GitHubEvent[] = await res.json();
    cache[cacheKey] = { timestamp: Date.now(), data };
    return data;
  } catch (err) {
    console.warn("Failed to fetch GitHub events, using fallback:", err);
    return [];
  }
}

export async function fetchGitHubProfile(): Promise<{ public_repos: number; followers: number } | null> {
  const cacheKey = "github_profile";
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL_MS) {
    return cache[cacheKey].data;
  }

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });
    if (!res.ok) throw new Error(`GitHub API error: ${res.statusText}`);
    const data = await res.json();
    const result = { public_repos: data.public_repos, followers: data.followers };
    cache[cacheKey] = { timestamp: Date.now(), data: result };
    return result;
  } catch (err) {
    return null;
  }
}
