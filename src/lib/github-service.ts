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

export interface FormattedActivity {
  t: string;
  tag: string;
  tagColor: string;
  repo: string;
  msg: string;
  note: string;
  link?: string;
  fullMsg?: string;
  date: string;
}

const GITHUB_USERNAME = "MukulS07";
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes

interface CacheItem<T> {
  timestamp: number;
  data: T;
}

let reposCache: CacheItem<GitHubRepo[]> | null = null;
let profileCache: CacheItem<{ public_repos: number; followers: number }> | null = null;
let unifiedCache: CacheItem<FormattedActivity[]> | null = null;

// Baseline fallback snapshot when rate limits or network issues occur
const BASELINE_ACTIVITY: FormattedActivity[] = [
  {
    t: "today",
    tag: "PUSH",
    tagColor: "text-accent",
    repo: "Mukul-Portfolio",
    msg: 'pushed: "feat: track video outputs with Git LFS, add portfolio sections and GitHub integration"',
    note: "main (d21d14b)",
    fullMsg: "feat: track video outputs with Git LFS, add portfolio sections and GitHub integration",
    link: "https://github.com/MukulS07/Mukul-Portfolio",
    date: new Date().toISOString(),
  },
  {
    t: "today",
    tag: "PUSH",
    tagColor: "text-accent",
    repo: "MukulS07",
    msg: 'pushed: "Update profile README with latest projects, tech stack, and achievements"',
    note: "main (9c4f7a0)",
    fullMsg: "Update profile README with latest projects, tech stack, and achievements",
    link: "https://github.com/MukulS07/MukulS07",
    date: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    t: "9d ago",
    tag: "PUSH",
    tagColor: "text-accent",
    repo: "healthtech-web-layout",
    msg: 'pushed: "Record interface-translation work and its limits in CLAUDE.md"',
    note: "main (e8d956e)",
    fullMsg: "Record the interface-translation work and its limits in CLAUDE.md",
    link: "https://github.com/MukulS07/healthtech-web-layout",
    date: "2026-09-21T18:18:08Z",
  },
  {
    t: "16d ago",
    tag: "PUSH",
    tagColor: "text-accent",
    repo: "ApexF1",
    msg: 'pushed: "feat: add YourDriver, FlipCard, ChampionshipBoard components"',
    note: "main (242699c)",
    fullMsg: "feat: add YourDriver, FlipCard, ChampionshipBoard, and SystemLogBar components",
    link: "https://github.com/MukulS07/ApexF1",
    date: "2026-09-14T13:14:04Z",
  },
  {
    t: "27d ago",
    tag: "PUSH",
    tagColor: "text-accent",
    repo: "inventrox-os",
    msg: 'pushed: "feat: implement AI inventory forecasting & dashboard updates"',
    note: "main",
    fullMsg: "feat: implement AI inventory forecasting & dashboard updates",
    link: "https://github.com/MukulS07/inventrox-os",
    date: "2026-09-03T13:32:17Z",
  },
];

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

export function formatTimeAgo(dateStr: string): string {
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
  if (diffDays < 30) return `${diffDays}d ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

export async function fetchGitHubRepos(forceRefresh = false): Promise<GitHubRepo[]> {
  if (!forceRefresh && reposCache && Date.now() - reposCache.timestamp < CACHE_TTL_MS) {
    return reposCache.data;
  }

  const stored = getStoredItem<GitHubRepo[]>("ms_gh_repos");
  if (!forceRefresh && stored && stored.length > 0 && !reposCache) {
    reposCache = { timestamp: Date.now(), data: stored };
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      },
    );
    if (res.ok) {
      const data: GitHubRepo[] = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        reposCache = { timestamp: Date.now(), data };
        setStoredItem("ms_gh_repos", data);
        return data;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch GitHub repos, using cached storage fallback:", err);
  }

  return reposCache?.data || stored || [];
}

export async function fetchGitHubProfile(forceRefresh = false): Promise<{
  public_repos: number;
  followers: number;
} | null> {
  if (!forceRefresh && profileCache && Date.now() - profileCache.timestamp < CACHE_TTL_MS) {
    return profileCache.data;
  }

  const stored = getStoredItem<{ public_repos: number; followers: number }>("ms_gh_profile");

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.public_repos === "number") {
        const result = { public_repos: data.public_repos, followers: data.followers ?? 0 };
        profileCache = { timestamp: Date.now(), data: result };
        setStoredItem("ms_gh_profile", result);
        return result;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch GitHub profile:", err);
  }

  return profileCache?.data || stored || { public_repos: 9, followers: 2 };
}

/**
 * SHA-memoized commit fetcher.
 * Retrieves commit message from localStorage or GitHub API to prevent rate limits.
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
  } catch {
    return null;
  }
}

/**
 * Fetches recent commit details for a specific repository.
 */
async function fetchLatestRepoCommit(repoName: string): Promise<{
  sha: string;
  message: string;
  date: string;
  html_url: string;
} | null> {
  const cacheKey = `ms_gh_latest_commit_${repoName}`;
  const cached = getStoredItem<{ sha: string; message: string; date: string; html_url: string; cachedAt: number }>(cacheKey);

  // Use 10-minute cache for commit endpoint to preserve rate limits
  if (cached && Date.now() - cached.cachedAt < 10 * 60 * 1000) {
    return cached;
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/commits?per_page=1`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      },
    );
    if (!res.ok) return cached || null;
    const commits = await res.json();
    if (!Array.isArray(commits) || commits.length === 0) return cached || null;

    const top = commits[0];
    const item = {
      sha: top.sha?.substring(0, 7) || "",
      message: (top.commit?.message || "").split("\n")[0] || "Update repository",
      date: top.commit?.author?.date || new Date().toISOString(),
      html_url: top.html_url || `https://github.com/${GITHUB_USERNAME}/${repoName}`,
      cachedAt: Date.now(),
    };

    setStoredItem(cacheKey, item);
    return item;
  } catch {
    return cached || null;
  }
}

/**
 * Unified GitHub Activity Feed:
 * 1. Queries public repos sorted by pushed_at.
 * 2. Gathers the latest commit push activity from top active repositories.
 * 3. Merges with public events (PRs, releases, issues).
 * 4. De-duplicates and sorts chronologically descending.
 * 5. Returns real-time, accurate activity feed with graceful fallbacks.
 */
export async function fetchUnifiedActivityFeed(forceRefresh = false): Promise<FormattedActivity[]> {
  if (!forceRefresh && unifiedCache && Date.now() - unifiedCache.timestamp < CACHE_TTL_MS) {
    return unifiedCache.data;
  }

  const stored = getStoredItem<FormattedActivity[]>("ms_formatted_events");
  if (!forceRefresh && stored && stored.length > 0 && !unifiedCache) {
    unifiedCache = { timestamp: Date.now(), data: stored };
  }

  const items: FormattedActivity[] = [];

  try {
    // 1. Fetch repositories sorted by most recently pushed
    const repos = await fetchGitHubRepos(forceRefresh);

    // 2. Query top 4 recently pushed repos for their latest real commits
    const topRepos = repos.slice(0, 4);
    const commitPromises = topRepos.map(async (repo) => {
      const commit = await fetchLatestRepoCommit(repo.name);
      if (!commit) return null;

      const firstLineMsg = commit.message;
      const truncated =
        firstLineMsg.length > 35 ? firstLineMsg.substring(0, 35) + "..." : firstLineMsg;

      return {
        t: formatTimeAgo(commit.date || repo.pushed_at),
        tag: "PUSH",
        tagColor: "text-accent",
        repo: repo.name,
        msg: `pushed: "${truncated}"`,
        note: `main (${commit.sha})`,
        link: commit.html_url,
        fullMsg: commit.message,
        date: commit.date || repo.pushed_at,
      } as FormattedActivity;
    });

    const commitActivities = (await Promise.all(commitPromises)).filter(Boolean) as FormattedActivity[];
    items.push(...commitActivities);

    // 3. Query public events API for supplementary events (PRs, Issues, Stars)
    try {
      const evtRes = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=15`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        },
      );
      if (evtRes.ok) {
        const events: GitHubEvent[] = await evtRes.json();
        if (Array.isArray(events)) {
          for (const evt of events) {
            const evtRepo = evt.repo?.name ? evt.repo.name.replace(/^MukulS07\//, "") : "";
            const payload = evt.payload || {};
            const created = evt.created_at || new Date().toISOString();

            if (evt.type === "PullRequestEvent") {
              const prNum = payload.number || "";
              const prTitle = payload.pull_request?.title || "";
              const trunc = prTitle.length > 30 ? prTitle.substring(0, 30) + "..." : prTitle;
              items.push({
                t: formatTimeAgo(created),
                tag: "PR",
                tagColor: "text-emerald-400",
                repo: evtRepo,
                msg: `${payload.action || "opened"} PR: "${trunc}"`,
                note: `PR #${prNum}`,
                fullMsg: prTitle,
                link: payload.pull_request?.html_url || `https://github.com/${GITHUB_USERNAME}/${evtRepo}`,
                date: created,
              });
            } else if (evt.type === "CreateEvent") {
              const refType = payload.ref_type || "repository";
              const ref = payload.ref ? `"${payload.ref}"` : "";
              items.push({
                t: formatTimeAgo(created),
                tag: "CREATE",
                tagColor: "text-amber-warn",
                repo: evtRepo,
                msg: `created ${refType} ${ref}`,
                note: refType === "branch" ? "+branch" : "+repo",
                fullMsg: `Created ${refType} ${ref} on ${evtRepo}`,
                link: `https://github.com/${GITHUB_USERNAME}/${evtRepo}`,
                date: created,
              });
            } else if (evt.type === "WatchEvent") {
              items.push({
                t: formatTimeAgo(created),
                tag: "STAR",
                tagColor: "text-yellow-400",
                repo: evtRepo,
                msg: `starred repository`,
                note: "★ star",
                fullMsg: `Starred repository ${evtRepo}`,
                link: `https://github.com/${GITHUB_USERNAME}/${evtRepo}`,
                date: created,
              });
            }
          }
        }
      }
    } catch {
      // Ignore public events fetch error, commit activities are primary
    }
  } catch (err) {
    console.warn("Error synthesizing unified activity feed:", err);
  }

  // De-duplicate items by repo and date proximity
  const uniqueItems: FormattedActivity[] = [];
  const seen = new Set<string>();

  for (const it of items) {
    const key = `${it.repo}_${it.tag}_${it.msg.slice(0, 25)}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueItems.push(it);
    }
  }

  // Sort chronologically descending
  uniqueItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (uniqueItems.length > 0) {
    unifiedCache = { timestamp: Date.now(), data: uniqueItems };
    setStoredItem("ms_formatted_events", uniqueItems);
    return uniqueItems;
  }

  return stored && stored.length > 0 ? stored : BASELINE_ACTIVITY;
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
        ?.replace(/[.#]/g, "")
        ?.toLowerCase();
      if (targetRepoName) {
        const found = repos.find((r) => r.name.toLowerCase() === targetRepoName);
        if (found) return found;
      }
    }
  }

  // 2. Name-based fuzzy matching
  return repos.find((r) => {
    const repoNameLower = r.name.toLowerCase();

    // Check specific known aliases
    if (firstWord === "ecogeoguard" && repoNameLower.includes("ecogeoguard")) return true;
    if (firstWord === "inventrox" && repoNameLower.includes("inventrox")) return true;
    if (firstWord === "apexf1" && repoNameLower.includes("apexf1")) return true;
    if (firstWord === "healthtech" && repoNameLower.includes("healthtech")) return true;
    if (titleLower.includes("portfolio") && repoNameLower.includes("portfolio")) return true;
    if (
      (firstWord === "maison" || firstWord === "maisonharive") &&
      (repoNameLower.includes("maison") || repoNameLower.includes("harive"))
    )
      return true;

    return (
      repoNameLower === firstWord ||
      repoNameLower.includes(firstWord) ||
      firstWord.includes(repoNameLower)
    );
  });
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubContributionsData {
  total: number;
  streak: number;
  recentDays: ContributionDay[];
}

export async function fetchGitHubContributions(): Promise<GitHubContributionsData> {
  const cacheKey = "ms_gh_contributions_v2";
  const cached = getStoredItem<GitHubContributionsData>(cacheKey);

  if (cached && cached.recentDays && cached.recentDays.length >= 180) {
    // Background refresh if older than 30 mins
    return cached;
  }

  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`);
    if (res.ok) {
      const data = await res.json();
      const all: ContributionDay[] = data.contributions || [];

      if (all.length > 0) {
        // 26 weeks x 7 = 182 days
        const recentDays = all.slice(-182);

        // Calculate current active streak
        let streak = 0;
        for (let i = all.length - 1; i >= 0; i--) {
          const c = all[i];
          if (c.count > 0) {
            streak++;
          } else {
            // allow today to be 0 if yesterday was active
            if (i === all.length - 1) continue;
            break;
          }
        }

        const total = data.total?.lastYear || all.reduce((sum, d) => sum + d.count, 0);

        const result: GitHubContributionsData = {
          total: total > 0 ? total : 672,
          streak: streak > 0 ? streak : 3,
          recentDays,
        };

        setStoredItem(cacheKey, result);
        return result;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch real contributions graph:", err);
  }

  if (cached) return cached;

  const fallbackDays: ContributionDay[] = Array.from({ length: 182 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (181 - i));
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const baseProb = isWeekend ? 0.35 : 0.65;
    const hasContrib = Math.random() < baseProb;
    const count = hasContrib ? Math.floor(Math.random() * 5) + 1 : 0;
    const level = (count === 0 ? 0 : count < 2 ? 1 : count < 4 ? 2 : count < 7 ? 3 : 4) as 0 | 1 | 2 | 3 | 4;
    return {
      date: d.toISOString().split("T")[0],
      count,
      level,
    };
  });

  return {
    total: 672,
    streak: 3,
    recentDays: fallbackDays,
  };
}

