import { writeFile } from 'fs/promises'
import type { AxiosInstance } from 'axios'
import {
  agents as agentsConfig,
  type AgentRepoOverride,
  type AgentRepoType,
} from './config.js'

const PERMISSIVE_LICENSES = new Set([
  'MIT',
  'Apache-2.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'BSD-2-Clause-FreeBSD',
  'Unlicense',
  'WTFPL',
  'CC0-1.0',
  'ISC',
  '0BSD',
  'BlueOak-1.0.0',
  'Zlib',
  'MPL-2.0',
])

const DEFAULT_COPY: Record<AgentRepoType, string> = {
  App: 'Full product structure, module boundaries, and interaction flow.',
  Library: 'Reusable API design, UI components, and module boundaries.',
  Tooling: 'CLI/service interfaces, automation flows, and integration patterns.',
  System: 'Low-level parsing, protocol bridges, and platform integration.',
}

type GhRepo = {
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  fork: boolean
  private: boolean
  archived: boolean
  license: { spdx_id: string | null } | null
  owner: { login: string }
}

type AgentRow = {
  fullName: string
  url: string
  type: AgentRepoType
  license: string
  language: string
  copy: string
  description: string
  stars: number
  section: 'copy' | 'study'
}

function isPermissive(spdx: string | null | undefined): boolean {
  return Boolean(spdx && PERMISSIVE_LICENSES.has(spdx))
}

function inferType(repo: GhRepo, override?: AgentRepoOverride): AgentRepoType {
  if (override?.type) return override.type
  const hay = `${repo.name} ${repo.description || ''}`.toLowerCase()
  if (
    /\b(skill|cli|action|bot|config|dotfiles?|zshrc|nvim|keeper|scaffold|template|deploy|geotag|docker)\b/.test(
      hay,
    )
  ) {
    return 'Tooling'
  }
  if (
    /\b(component|hook|kit|sdk|library|color|modal|zoom|decorator|logger|utils|editor|theme|token|suspense|jsx|api)\b/.test(
      hay,
    )
  ) {
    return 'Library'
  }
  if (/\b(protocol|bridge|driver|firmware|device|parser)\b/.test(hay)) {
    return 'System'
  }
  return 'App'
}

function escapeCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ').trim()
}

async function paginateRepos(
  gh: AxiosInstance,
  path: string,
  extraParams: Record<string, string | number> = {},
): Promise<GhRepo[]> {
  const all: GhRepo[] = []
  let page = 1
  while (true) {
    const { data } = await gh.get<GhRepo[]>(path, {
      params: { per_page: 100, page, ...extraParams },
    })
    if (!data.length) break
    all.push(...data)
    if (data.length < 100) break
    page += 1
  }
  return all
}

function shouldExclude(repo: GhRepo): boolean {
  if (repo.private || repo.fork) return true
  if (!agentsConfig.includeArchived && repo.archived) return true
  if (agentsConfig.excludeFullNames.includes(repo.full_name)) return true
  if (agentsConfig.excludeNames.includes(repo.name)) return true
  return false
}

function toRow(repo: GhRepo, section: 'copy' | 'study'): AgentRow {
  const override = agentsConfig.overrides[repo.full_name]
  const spdx = repo.license?.spdx_id || null
  const license =
    override?.license ||
    (spdx && spdx !== 'NOASSERTION' ? spdx : spdx === 'NOASSERTION' ? 'custom' : 'unlicensed')
  const type = inferType(repo, override)
  const copy = override?.copy || DEFAULT_COPY[type]
  const description = override?.description || repo.description || '—'

  return {
    fullName: repo.full_name,
    url: repo.html_url,
    type,
    license,
    language: repo.language || '—',
    copy,
    description,
    stars: repo.stargazers_count || 0,
    section,
  }
}

function sortRows(rows: AgentRow[]): AgentRow[] {
  return [...rows].sort((a, b) => {
    if (b.stars !== a.stars) return b.stars - a.stars
    return a.fullName.localeCompare(b.fullName)
  })
}

function countBy(rows: AgentRow[], key: keyof AgentRow): Record<string, number> {
  return rows.reduce<Record<string, number>>((acc, row) => {
    const value = String(row[key])
    acc[value] = (acc[value] || 0) + 1
    return acc
  }, {})
}

function renderSummary(counts: Record<string, number>): string {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, count]) => `- **${name}** × ${count}`)
    .join('\n')
}

function renderTable(rows: AgentRow[]): string {
  const header =
    '| Repo | Type | License | Lang | What to copy | Description |\n| --- | --- | --- | --- | --- | --- |'
  const body = rows
    .map(
      (row) =>
        `| [${escapeCell(row.fullName)}](${row.url}) | \`${row.type}\` | \`${escapeCell(row.license)}\` | \`${escapeCell(row.language)}\` | ${escapeCell(row.copy)} | ${escapeCell(row.description)} |`,
    )
    .join('\n')
  return `${header}\n${body}`
}

export async function generateAgentsMarkdown(gh: AxiosInstance): Promise<string> {
  const collected = new Map<string, GhRepo>()

  const personal = await paginateRepos(
    gh,
    `/users/${agentsConfig.personal}/repos`,
    { type: 'owner', sort: 'updated' },
  )
  for (const repo of personal) collected.set(repo.full_name, repo)

  for (const org of agentsConfig.orgs) {
    try {
      const orgRepos = await paginateRepos(gh, `/orgs/${org}/repos`, {
        type: 'public',
        sort: 'updated',
      })
      for (const repo of orgRepos) collected.set(repo.full_name, repo)
    } catch (error) {
      console.warn(`skip org ${org}:`, (error as Error).message)
    }
  }

  for (const fullName of agentsConfig.extraRepos) {
    if (collected.has(fullName)) continue
    try {
      const { data } = await gh.get<GhRepo>(`/repos/${fullName}`)
      collected.set(data.full_name, data)
    } catch (error) {
      console.warn(`skip extra repo ${fullName}:`, (error as Error).message)
    }
  }

  const copyRows: AgentRow[] = []
  const studyRows: AgentRow[] = []
  const forcedStudy = new Set(Object.keys(agentsConfig.overrides))

  for (const repo of collected.values()) {
    if (shouldExclude(repo)) continue

    const spdx = repo.license?.spdx_id || null
    const override = agentsConfig.overrides[repo.full_name]
    const permissive = isPermissive(spdx) && !override?.license?.toLowerCase().includes('agpl')

    if (permissive && (!override?.license || isPermissive(override.license))) {
      copyRows.push(toRow(repo, 'copy'))
      continue
    }

    const forced =
      forcedStudy.has(repo.full_name) ||
      agentsConfig.extraRepos.includes(repo.full_name)
    const autoStudy =
      repo.stargazers_count >= agentsConfig.studyMinStars &&
      Boolean(repo.description?.trim())

    if (forced || autoStudy) {
      studyRows.push(toRow(repo, 'study'))
    }
  }

  const copySorted = sortRows(copyRows)
  const studySorted = sortRows(studyRows)
  const all = [...copySorted, ...studySorted]

  const typeCounts = countBy(all, 'type')
  const licenseCounts = countBy(all, 'license')
  const scopes = [
    `personal \`${agentsConfig.personal}\``,
    ...agentsConfig.orgs.map((org) => `org \`${org}\``),
    ...agentsConfig.extraRepos.map((name) => `extra \`${name}\``),
  ]

  const markdown = `# Agent Code Navigation

This page curates Innei's public repositories from the perspective of **what an agent can safely study or reuse**.

It covers both personal repositories and projects maintained under other GitHub scopes.

- Included: **${all.length}** repositories (**${copySorted.length}** copy-friendly, **${studySorted.length}** study-first)
- Scopes: ${scopes.join(', ')}
- Copy-friendly licenses: \`MIT\`, \`Apache-2.0\`, \`BSD\`, \`Unlicense\`, \`WTFPL\`, \`CC0\`, \`ISC\`, and similar permissive licenses
- Usage: start with **Copy-Friendly** when you need reusable code; use **Study-First** for high-signal maintained projects with custom, missing, or copyleft licenses
- Reminder: keep the original \`LICENSE\` / \`NOTICE\`, and double-check third-party dependencies, assets, trademarks, and service terms before reusing code

## Legend

- \`App\`: complete product architecture, module splits, and interaction flows
- \`Library\`: reusable APIs, UI components, and module boundaries
- \`Tooling\`: CLIs, service interfaces, automation flows, and external integrations
- \`System\`: low-level parsing, protocol bridges, device interaction, and reverse-engineering toolchains

## Coverage Summary

### By type

${renderSummary(typeCounts)}

### By license label

${renderSummary(licenseCounts)}

## Copy-Friendly Repositories

These repositories declare a clear permissive SPDX license on GitHub. Prefer them when an agent needs to study **and reuse** implementation details.

${copySorted.length ? renderTable(copySorted) : '_No permissive repositories matched the current filters._'}

## Study-First Maintained Projects

These are actively maintained or high-signal projects under personal or org scopes, including dual-license / custom / unlicensed / copyleft work.

**Do not treat them as freely reusable by default.** Read the repository \`LICENSE\` first. Many are excellent for architecture study, product patterns, and interaction design.

${studySorted.length ? renderTable(studySorted) : '_No study-first repositories matched the current filters._'}

## Practical Copy Rules

1. Prefer **Copy-Friendly** repositories for direct implementation reuse.
2. For dual-license projects (for example Mix Space / Afilmory), only treat explicitly MIT (or otherwise permissive) packages/paths as copy-friendly.
3. Before copying, verify third-party dependency licenses, branding assets, screenshots, icons, API keys, and private endpoints.
4. Keep any required \`LICENSE\`, \`NOTICE\`, and attribution text from the original repository.
5. If a repository has no clear license, treat it as inspiration only and do not copy the implementation.
6. Org-scoped projects listed here are included because Innei maintains or collaborates on them; ownership still belongs to the respective organization.

---

_Generated by profile build. Edit \`config.ts\` (\`agents\`) to adjust scopes, excludes, and per-repo guidance._
`

  return markdown
}

export async function writeAgentsMarkdown(gh: AxiosInstance): Promise<void> {
  const markdown = await generateAgentsMarkdown(gh)
  await writeFile('./AGENTS.md', markdown, { encoding: 'utf-8' })
  console.log('AGENTS.md updated')
}
