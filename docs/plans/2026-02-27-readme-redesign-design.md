# README Redesign — Design Document

## Context

Current README uses a neofetch-style terminal block with ASCII cat art, GitHub stats tree, two-column table layout with details/summary sections, and shields.io badges. Pain points: messy information architecture, lack of personal character as a Design Engineer.

## Identity

**Design Engineer** — the README should reflect design taste through clean layout and intentional typography, not through clutter.

## Design: Terminal Header + Clean Sections

### Visual Style

Terminal aesthetic for the header (identity), clean markdown for content sections below. The terminal header establishes personality; the clean sections ensure readability.

### Structure

#### 1. Terminal Header

```bash
$ whoami
innei — design engineer · digital nomad
building beautiful things with code

$ echo $STACK
TypeScript · React · Next.js · NestJS · Swift

$ rank
██████████ S
```

- No ASCII art
- No stats tree (stars/commits/PRs/issues removed — redundant with GitHub profile sidebar)
- Rank retained as a single compact line

#### 2. Motto

```html
<p align="center">
  「<strong><samp> <!-- motto --> </samp></strong>」
</p>
```

Centered, below terminal header. Dynamic injection preserved.

#### 3. Featured Work

Flat markdown list, no table, no details/summary:

```markdown
### Featured Work

- **[Shiro](link)** — A minimalist personal website ★4129
- **[Afilmory](link)** — Modern photo gallery ★2427
- **[Torrent-Vibe](link)** — Modern web interface for qBittorrent ★142
- **[LobeHub](link)** — The ultimate space for work and life ★72244
```

Dynamic injection via `<!-- opensource_dashboard:active -->`.

#### 4. Recent Writing

```markdown
### Recent Writing

- [Title](link) — date
```

Dynamic injection via `<!-- recent_posts_inject -->`.

#### 5. Sponsors

Keep as-is (sponsors SVG).

#### 6. Footer

- Social links: plain text hyperlinks (GitHub · Twitter · Blog), no shields.io badges
- Signature SVG: retained, right-aligned
- Auto-refresh timestamp: removed

### Removed Content

| Item | Reason |
|------|--------|
| ASCII cat | Clutters header, doesn't match design engineer identity |
| GitHub stats tree | Redundant with GitHub profile sidebar |
| Side Projects & Toys section | Simplify to core projects only |
| Recent Discovery section | Simplify |
| details/summary wrappers | Flat display preferred |
| shields.io badges | Dated aesthetic |
| Auto-refresh footer | Implementation detail |
| Two-column table | Poor mobile rendering, unnecessary complexity |

### Build Pipeline Changes

- `readme.template.md`: Rewrite to new structure
- `index.ts`: Remove stats fetching (getTotalStars, getTotalCommits, getTotalPRs, getTotalIssues, getContributedRepos). Keep: rank calculation, active projects, recent posts, motto injection
- `constants.ts`: Remove unused placeholder constants
- `config.ts`: Remove `toys` config; keep `active`, `motto`, `mxSpace`
