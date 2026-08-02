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
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes cache for live dynamic syncing

interface CacheItem<T> {
  timestamp: number;
  data: T;
}

let reposCache: CacheItem<GitHubRepo[]> | null = null;
let eventsCache: CacheItem<GitHubEvent[]> | null = null;
let profileCache: CacheItem<{ public_repos: number; followers: number }> | null = null;

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  if (reposCache && Date.now() - reposCache.timestamp < CACHE_TTL_MS) {
    return reposCache.data;
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100&t=${Date.now()}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      },
    );
    if (!res.ok) throw new Error(`GitHub API error: ${res.statusText}`);
    const data: GitHubRepo[] = await res.json();
    reposCache = { timestamp: Date.now(), data };
    return data;
  } catch (err) {
    console.warn("Failed to fetch GitHub repos, using fallback:", err);
    return reposCache?.data || [];
  }
}

export async function fetchGitHubEvents(): Promise<GitHubEvent[]> {
  if (eventsCache && Date.now() - eventsCache.timestamp < CACHE_TTL_MS) {
    return eventsCache.data;
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=10&t=${Date.now()}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      },
    );
    if (!res.ok) throw new Error(`GitHub API error: ${res.statusText}`);
    const data: GitHubEvent[] = await res.json();
    eventsCache = { timestamp: Date.now(), data };
    return data;
  } catch (err) {
    console.warn("Failed to fetch GitHub events, using fallback:", err);
    return eventsCache?.data || [];
  }
}

export async function fetchGitHubProfile(): Promise<{
  public_repos: number;
  followers: number;
} | null> {
  if (profileCache && Date.now() - profileCache.timestamp < CACHE_TTL_MS) {
    return profileCache.data;
  }

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}?t=${Date.now()}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });
    if (!res.ok) throw new Error(`GitHub API error: ${res.statusText}`);
    const data = await res.json();
    const result = { public_repos: data.public_repos, followers: data.followers };
    profileCache = { timestamp: Date.now(), data: result };
    return result;
  } catch (err) {
    return profileCache?.data || null;
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
