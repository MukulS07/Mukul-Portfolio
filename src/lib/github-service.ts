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

const cache: Record<string, CacheItem<unknown>> = {};

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  const cacheKey = "github_repos";
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL_MS) {
    return cache[cacheKey].data;
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
    cache[cacheKey] = { timestamp: Date.now(), data };
    return data;
  } catch (err) {
    console.warn("Failed to fetch GitHub repos, using fallback:", err);
    return cache[cacheKey]?.data || [];
  }
}

export async function fetchGitHubEvents(): Promise<GitHubEvent[]> {
  const cacheKey = "github_events";
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL_MS) {
    return cache[cacheKey].data;
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
    cache[cacheKey] = { timestamp: Date.now(), data };
    return data;
  } catch (err) {
    console.warn("Failed to fetch GitHub events, using fallback:", err);
    return cache[cacheKey]?.data || [];
  }
}

export async function fetchGitHubProfile(): Promise<{
  public_repos: number;
  followers: number;
} | null> {
  const cacheKey = "github_profile";
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL_MS) {
    return cache[cacheKey].data;
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
    cache[cacheKey] = { timestamp: Date.now(), data: result };
    return result;
  } catch (err) {
    return cache[cacheKey]?.data || null;
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
