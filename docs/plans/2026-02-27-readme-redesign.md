# README Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign GitHub README from cluttered neofetch style to clean "Terminal Header + Clean Sections" layout with Design Engineer identity.

**Architecture:** Rewrite `readme.template.md` with new structure, simplify `index.ts` by removing unused sections (toys, starred repos, footer timestamp, individual stats display), clean up `constants.ts` and `config.ts`. Rank calculation retained (still needs all API data internally).

**Tech Stack:** TypeScript, markdown, HTML, GitHub Actions (unchanged)

---

### Task 1: Rewrite readme.template.md

**Files:**
- Modify: `readme.template.md` (full rewrite)

**Step 1: Replace entire template content**

```markdown
```bash
$ whoami
innei — design engineer · digital nomad
building beautiful things with code

$ echo $STACK
TypeScript · React · Next.js · NestJS · Swift

$ rank
<!-- GH_RANK_NODE -->
```

<p align="center">
  「<strong><samp> <!-- motto --> </samp></strong>」
</p>

<br />

### Featured Work

<!-- opensource_dashboard:active -->

### Recent Writing

<!-- recent_posts_inject -->

<br />

<p align="center">
  <a href="https://github.com/sponsors/innei">
    <img src="./sponsorkit/sponsors.svg" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/innei">GitHub</a> ·
  <a href="https://twitter.com/__oQuery">Twitter</a> ·
  <a href="https://innei.in">Blog</a>
</p>

<p align="right">
  <img src="./innei-signature.svg" alt="innei" width="160" />
</p>
```

Key changes from current:
- No ASCII cat, no stats tree, no `neofetch` heading
- `whoami` + `$STACK` + `rank` only in terminal block
- Flat project list (no table, no details/summary)
- Flat blog list (no details/summary)
- Plain text social links (no shields.io badges)
- No footer timestamp

**Step 2: Verify template has correct placeholder comments**

Ensure these placeholders exist (used by index.ts):
- `<!-- GH_RANK_NODE -->` — rank progress bar
- `<!-- motto -->` — motto injection
- `<!-- opensource_dashboard:active -->` — active projects
- `<!-- recent_posts_inject -->` — blog posts

---

### Task 2: Simplify index.ts — remove unused sections

**Files:**
- Modify: `index.ts:389-533` (remove toys, starred repos, footer, individual stats replacements)

**Step 1: Remove toys section fetch (lines ~389-398)**

Delete the block that fetches toy projects:
```typescript
// DELETE: lines 389-398
const limit = opensource.toys.limit
const toys = opensource.toys.random
  ? shuffle(opensource.toys.repos).slice(0, limit)
  : opensource.toys.repos.slice(0, limit)
const toysProjectDetail: GRepo[] = await Promise.all(
  toys.map((name) => {
    return gh.get('/repos/' + name).then((data) => data.data)
  }),
)
```

**Step 2: Remove individual stats replacements (lines ~424-429)**

Delete the `.replace()` calls for GH_STARS, GH_COMMITS_THIS_YEAR, GH_PRS, GH_ISSUES, GH_CONTRIBS. Keep only the GH_RANK_NODE replacement.

Before:
```typescript
newContent = newContent
  .replace(gc('GH_STARS'), stars.toString())
  .replace(gc('GH_COMMITS_THIS_YEAR'), commits.toString())
  .replace(gc('GH_PRS'), prs.toString())
  .replace(gc('GH_ISSUES'), issues.toString())
  .replace(gc('GH_CONTRIBS'), contribs.toString())
  .replace(gc('GH_RANK_NODE'), ...)
```

After:
```typescript
newContent = newContent
  .replace(
    gc('GH_RANK_NODE'),
    `${'█'.repeat(Math.round((100 - rank.percentile) / 10))} ${rank.level}`,
  )
```

Note: simplified rank display — no `[ PROGRESS ... ]` wrapper, just `██████████ S`.

**Step 3: Remove toys replacement (line ~444)**

Delete: `.replace(gc('OPENSOURCE_TOYS'), generateToysHTML(toysProjectDetail))`

**Step 4: Remove starred repos section (lines ~447-479)**

Delete the entire block that fetches and processes starred repos (RECENT_STAR and RANDOM_GITHUB_STARS).

**Step 5: Remove footer injection (lines ~511-534)**

Delete the entire footer block that generates the auto-refresh timestamp.

**Step 6: Remove unused functions**

Delete these functions (no longer referenced):
- `generateToysHTML` (lines 112-128)
- `generateRepoHTML` (lines 134-138)

Keep `generateOpenSourceSectionHtml` (used for active projects).

**Step 7: Remove unused imports**

Remove `shuffle` from lodash-es import (no longer used for toys or starred repos).
Remove `dayjs` import (no longer used for footer timestamp).

---

### Task 3: Update generateOpenSourceSectionHtml output format

**Files:**
- Modify: `index.ts:93-106`

**Step 1: Change output to markdown list instead of HTML ul/li**

The Featured Work section should output clean markdown since we're no longer inside a `<details>` block:

```typescript
function generateOpenSourceSectionHtml<T extends GHItem>(list: T[]) {
  return list
    .map(
      (cur) =>
        `- **[${cur.full_name}](${cur.html_url})** — ${cur.description || ''} ★${cur.stargazers_count || 0}`,
    )
    .join('\n')
}
```

**Step 2: Update recent posts output to markdown**

Change `generatePostItemHTML` and `generateNoteItemHTML` to produce markdown list items:

```typescript
function generatePostItemHTML<T extends Partial<PostModel>>(item: T) {
  const date = new Date(item.created).toLocaleDateString(undefined, {
    dateStyle: 'short',
    timeZone,
  })
  return `- [${item.title}](${mxSpace.url}/posts/${item.category.slug}/${item.slug}) — ${date}`
}

function generateNoteItemHTML<T extends Partial<NoteModel>>(item: T) {
  const date = new Date(item.created).toLocaleDateString(undefined, {
    dateStyle: 'short',
    timeZone,
  })
  return `- [${item.title}](${mxSpace.url}/notes/${item.nid}) — ${date}`
}
```

**Step 3: Update the injection in main() to join with newlines**

The recent posts replace call should join items with newlines:

```typescript
const posts = sorted.slice(0, 5).map((cur) => {
  if (cur.type === 'Note') {
    return generateNoteItemHTML(cur)
  } else {
    return generatePostItemHTML(cur)
  }
}).join('\n')
```

Remove the `m` tagged template wrapper (no need to minify markdown).

---

### Task 4: Clean up constants.ts

**Files:**
- Modify: `constants.ts`

**Step 1: Remove unused constants**

Keep only:
```typescript
export const COMMNETS = Object.freeze({
  OPENSOURCE_DASHBOARD_ACTIVE: 'opensource_dashboard:active',
  RECENT_POSTS: 'recent_posts_inject',
  MOTTO: 'motto',
  GH_RANK_NODE: 'GH_RANK_NODE',
})
```

Remove: `OPENSOURCE_TOYS`, `RECENT_STAR`, `RANDOM_GITHUB_STARS`, `FOOTER`, `GH_STARS`, `GH_COMMITS_THIS_YEAR`, `GH_PRS`, `GH_ISSUES`, `GH_CONTRIBS`.

---

### Task 5: Clean up config.ts

**Files:**
- Modify: `config.ts`

**Step 1: Remove toys config**

Delete `opensource.toys` entirely. Keep `opensource.active`.

```typescript
export const opensource = {
  active: [
    'Innei/Shiro',
    'Afilmory/Afilmory',
    'Torrent-Vibe/Torrent-Vibe',
    'lobehub/lobe-chat',
  ],
}
```

---

### Task 6: Verify build works

**Step 1: Run the build**

```bash
cd /Users/innei/git/innei-repo/Innei && npx tsx index.ts
```

Note: Will fail on GitHub API calls without GITHUB_TOKEN. Verify by checking that the script does not throw syntax/type errors. If API calls fail, that's expected in local dev.

**Step 2: Inspect generated readme.md**

Read `readme.md` and verify:
- Terminal header with whoami/stack/rank
- Motto centered
- Featured Work as markdown list
- Recent Writing as markdown list
- Sponsors SVG
- Plain text social links
- Signature SVG right-aligned
- No: ASCII cat, stats tree, table, details/summary, badges, footer timestamp

**Step 3: Run lint on modified files**

```bash
npx tsc --noEmit
```
