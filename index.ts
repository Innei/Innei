import axios from 'axios'
import dayjs from 'dayjs'
import { readFile, rm, writeFile } from 'fs/promises'
import { minify } from 'html-minifier'
import { shuffle } from 'lodash-es'
import MarkdownIt from 'markdown-it'
import * as rax from 'retry-axios'
import { github, motto, mxSpace, opensource, timeZone } from './config'
import { COMMNETS } from './constants'
import { GRepo } from './types'
import {
  AggregateController,
  createClient,
  NoteModel,
  PostModel,
} from '@mx-space/api-client'
import { axiosAdaptor } from '@mx-space/api-client/dist/adaptors/axios'

const mxClient = createClient(axiosAdaptor)(mxSpace.api, {
  controllers: [AggregateController],
})

axiosAdaptor.default.interceptors.request.use((req) => {
  req.headers && (req.headers['User-Agent'] = 'Innei profile')
  return req
})

const md = new MarkdownIt({
  html: true,
})
const githubAPIEndPoint = 'https://api.github.com'

rax.attach()
axios.defaults.raxConfig = {
  retry: 5,
  retryDelay: 4000,
  onRetryAttempt: (err) => {
    const cfg = rax.getConfig(err)
    console.log('request: \n', err.request)
    console.log(`Retry attempt #${cfg.currentRetryAttempt}`)
  },
}

const userAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'

axios.defaults.headers.common['User-Agent'] = userAgent
const gh = axios.create({
  baseURL: githubAPIEndPoint,
  timeout: 4000,
  headers: {
    Authorization:
      process.env.GITHUB_TOKEN || process.env.GH_TOKEN
        ? `Bearer ${process.env.GITHUB_TOKEN || process.env.GH_TOKEN}`
        : undefined,
  },
})

gh.interceptors.response.use(undefined, (err) => {
  console.log(err.message)
  return Promise.reject(err)
})

type GHItem = {
  name: string
  id: number
  full_name: string
  description: string
  html_url: string
  stargazers_count?: number
  homepage?: string
}

type PostItem = {
  title: string
  summary: string
  created: string
  modified: string
  id: string
  slug: string
  category: {
    name: string
    slug: string
  }
}
/**
 * 生成 `开源在` 结构
 */
function generateOpenSourceSectionHtml<T extends GHItem>(list: T[]) {
  const lis = list.reduce(
    (str, cur) =>
      str +
      `<li><a href="${cur.html_url}" target="_blank">${
        cur.full_name
      }</a> (<b>★ ${cur.stargazers_count || 0}</b>) ${
        cur.description ? `<br/>↳ <i>${cur.description}</i>` : ''
      }</li>`,
    ``,
  )

  return m`<ul>${lis}</ul>`
}

/**
 * 生成 `写过的玩具` 结构
 */

function generateToysHTML(list: GRepo[]) {
  const lis = list.reduce(
    (str, cur) =>
      str +
      `<li><a href="${cur.html_url}" target="_blank">${cur.full_name}</a> ${
        (cur as any).homepage
          ? `(<a href="${(cur as any).homepage}" target="_blank">demo</a>)`
          : ''
      } (<b>★ ${(cur as any).stargazers_count || 0}</b>) ${
        (cur as any).description
          ? `<br/>↳ <i>${(cur as any).description}</i>`
          : ''
      }</li>`,
    ``,
  )
  return m`<ul>${lis}</ul>`
}

/**
 * 生成 Repo  HTML 结构
 */

function generateRepoHTML<T extends GHItem>(item: T) {
  return `<li><a href="${item.html_url}">${item.full_name}</a>${
    item.description ? `<span>  ${item.description}</span>` : ''
  }</li>`
}

function generatePostItemHTML<T extends Partial<PostModel>>(item: T) {
  return m`<li><span><a href="${
    mxSpace.url + '/posts/' + item.category.slug + '/' + item.slug
  }">${item.title}</a></span> - ${new Date(item.created).toLocaleDateString(
    undefined,
    {
      dateStyle: 'short',
      timeZone,
    },
  )}</li>`
}

function generateNoteItemHTML<T extends Partial<NoteModel>>(item: T) {
  return m`<li><span><a href="${mxSpace.url + '/notes/' + item.nid}">${
    item.title
  }</a></span> - ${new Date(item.created).toLocaleDateString(undefined, {
    dateStyle: 'short',
    timeZone,
  })}</li>`
}

async function getTotalStars(username: string): Promise<number> {
  let stars = 0
  let page = 1
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const res = await gh.get<{ stargazers_count: number }[]>(
      `/users/${username}/repos?per_page=100&page=${page}&type=owner`,
    )
    if (res.data.length === 0) {
      break
    }
    stars += res.data.reduce((acc, repo) => acc + repo.stargazers_count, 0)
    page++
  }
  return stars
}

// Commits
async function getTotalCommits(username: string): Promise<number> {
  const year = new Date().getFullYear()
  const res = await gh.get<{ total_count: number }>(
    `/search/commits?q=author:${username}+author-date:${year}-01-01..${year}-12-31`,
    {
      headers: {
        Accept: 'application/vnd.github.cloak-preview', // needed for commit search api
      },
    },
  )
  return res.data.total_count
}

// PRs
async function getTotalPRs(username: string): Promise<number> {
  const res = await gh.get<{ total_count: number }>(
    `/search/issues?q=is:pr+author:${username}`,
  )
  return res.data.total_count
}

// Issues
async function getTotalIssues(username: string): Promise<number> {
  const res = await gh.get<{ total_count: number }>(
    `/search/issues?q=is:issue+author:${username}`,
  )
  return res.data.total_count
}

// Contribs
async function getContributedRepos(username: string): Promise<number> {
  const lastYear = new Date().getFullYear() - 1
  const repos = new Set<string>()
  let page = 1
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const res = await gh.get<{ items: { repository_url: string }[] }>(
        `/search/issues?q=is:pr+author:${username}+-user:${username}+created:${lastYear}-01-01..${lastYear}-12-31&per_page=100&page=${page}`,
      )
      if (res.data.items.length === 0) {
        break
      }
      res.data.items.forEach((item) => {
        repos.add(item.repository_url)
      })
      if (res.data.items.length < 100) {
        break
      }
      page++
    } catch {
      break
    }
  }
  return repos.size
}

async function getFollowers(username: string): Promise<number> {
  const res = await gh.get<{ followers: number }>(`/users/${username}`)
  return res.data.followers
}

async function getTotalReviews(username: string): Promise<number> {
  const res = await gh.get<{ total_count: number }>(
    `/search/issues?q=is:pr+reviewed-by:${username}`,
  )
  return res.data.total_count
}

async function getTotalRepos(username: string): Promise<number> {
  const res = await gh.get<{ public_repos: number }>(`/users/${username}`)
  return res.data.public_repos
}

/**
 * Returns the error function.
 *
 * @param {number} x The value.
 * @returns {number} The error function.
 */
function erf(x: number): number {
  // constants
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911

  // Save the sign of x
  let sign = 1
  if (x < 0) {
    sign = -1
  }
  x = Math.abs(x)

  // A&S formula 7.1.26
  const t = 1.0 / (1.0 + p * x)
  const y =
    1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

  return sign * y
}
/**
 * Returns the exponential cumulative distribution function.
 *
 * @param {number} x The value.
 * @returns {number} The exponential cumulative distribution function.
 */
function exponential_cdf(x: number): number {
  if (x < 0) {
    return 0
  }
  return 1 - 2 ** -x
}
/**
 * Returns the log-normal cumulative distribution function.
 *
 * @param {number} x The value.
 * @returns {number} The log-normal cumulative distribution function.
 */
function log_normal_cdf(x: number): number {
  if (x < 0) {
    return 0
  }
  return erf(Math.log(x) / Math.sqrt(2))
}

/**
 * Calculates the users rank.
 *
 * @param {object} params Parameters on which the user's rank depends.
 * @param {boolean} params.all_commits Whether `include_all_commits` was used.
 * @param {number} params.commits Number of commits.
 * @param {number} params.prs The number of pull requests.
 * @param {number} params.issues The number of issues.
 * @param {number} params.reviews The number of reviews.
 * @param {number} params.repos Total number of repos.
 * @param {number} params.stars The number of stars.
 * @param {number} params.followers The number of followers.
 * @returns {{level: string, percentile: number}}} The users rank.
 */
function calculateRank({
  all_commits,
  commits,
  prs,
  issues,
  reviews,
  repos,
  stars,
  followers,
}: {
  all_commits: boolean
  commits: number
  prs: number
  issues: number
  reviews: number
  repos: number
  stars: number
  followers: number
}): { level: string; percentile: number } {
  const COMMITS_MEDIAN = all_commits ? 1000 : 250,
    COMMITS_WEIGHT = 2
  const PRS_MEDIAN = 50,
    PRS_WEIGHT = 3
  const ISSUES_MEDIAN = 25,
    ISSUES_WEIGHT = 1
  const REVIEWS_MEDIAN = 2,
    REVIEWS_WEIGHT = 1
  const STARS_MEDIAN = 50,
    STARS_WEIGHT = 4
  const FOLLOWERS_MEDIAN = 10,
    FOLLOWERS_WEIGHT = 1

  const TOTAL_WEIGHT =
    COMMITS_WEIGHT +
    PRS_WEIGHT +
    ISSUES_WEIGHT +
    REVIEWS_WEIGHT +
    STARS_WEIGHT +
    FOLLOWERS_WEIGHT

  const THRESHOLDS = [1, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100]
  const LEVELS = ['S', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C']

  const rank =
    1 -
    (COMMITS_WEIGHT * exponential_cdf(commits / COMMITS_MEDIAN) +
      PRS_WEIGHT * exponential_cdf(prs / PRS_MEDIAN) +
      ISSUES_WEIGHT * exponential_cdf(issues / ISSUES_MEDIAN) +
      REVIEWS_WEIGHT * exponential_cdf(reviews / REVIEWS_MEDIAN) +
      STARS_WEIGHT * log_normal_cdf(stars / STARS_MEDIAN) +
      FOLLOWERS_WEIGHT * log_normal_cdf(followers / FOLLOWERS_MEDIAN)) /
      TOTAL_WEIGHT

  const level = LEVELS[THRESHOLDS.findIndex((t) => rank * 100 <= t)]

  return { level, percentile: rank * 100 }
}

async function main() {
  const template = await readFile('./readme.template.md', { encoding: 'utf-8' })
  let newContent = template
  // 获取活跃的开源项目详情
  const activeOpenSourceDetail: GRepo[] = await Promise.all(
    opensource.active.map((name) => {
      return gh.get('/repos/' + name).then((data) => data.data)
    }),
  )

  // 获取写过的玩具开源项目详情
  const limit = opensource.toys.limit
  const toys = opensource.toys.random
    ? shuffle(opensource.toys.repos).slice(0, limit)
    : opensource.toys.repos.slice(0, limit)
  const toysProjectDetail: GRepo[] = await Promise.all(
    toys.map((name) => {
      return gh.get('/repos/' + name).then((data) => data.data)
    }),
  )

  // Github Stats
  const [stars, commits, prs, issues, contribs, followers, reviews, repos] =
    await Promise.all([
      getTotalStars(github.name),
      getTotalCommits(github.name),
      getTotalPRs(github.name),
      getTotalIssues(github.name),
      getContributedRepos(github.name),
      getFollowers(github.name),
      getTotalReviews(github.name),
      getTotalRepos(github.name),
    ])

  const rank = calculateRank({
    stars,
    commits,
    prs,
    issues,
    reviews,
    repos,
    all_commits: false,
    followers,
  })

  newContent = newContent
    .replace(gc('GH_STARS'), stars.toString())
    .replace(gc('GH_COMMITS_THIS_YEAR'), commits.toString())
    .replace(gc('GH_PRS'), prs.toString())
    .replace(gc('GH_ISSUES'), issues.toString())
    .replace(gc('GH_CONTRIBS'), contribs.toString())
    .replace(
      gc('GH_RANK_NODE'),
      `[ PROGRESS ${'█'.repeat(
        Math.round((100 - rank.percentile) / 10),
      )}${' '.repeat(10 - Math.round((100 - rank.percentile) / 10))}] ${
        rank.level
      }`,
    )

  newContent = newContent
    .replace(
      gc('OPENSOURCE_DASHBOARD_ACTIVE'),
      generateOpenSourceSectionHtml(activeOpenSourceDetail),
    )
    .replace(gc('OPENSOURCE_TOYS'), generateToysHTML(toysProjectDetail))

  // 获取 Star
  const star: any[] = await gh
    .get('/users/' + github.name + '/starred')
    .then((data) => data.data)

  {
    // TOP 5
    const topStar5 = star
      .slice(0, 5)
      .reduce((str, cur) => str + generateRepoHTML(cur), '')

    newContent = newContent.replace(
      gc('RECENT_STAR'),
      m`
    <ul>
${topStar5}
    </ul>
    `,
    )

    // 曾经点过的 Star
    const random = shuffle(star.slice(5))
      .slice(0, 5)
      .reduce((str, cur) => str + generateRepoHTML(cur), '')

    newContent = newContent.replace(
      gc('RANDOM_GITHUB_STARS'),
      m`
      <ul>
  ${random}
      </ul>
      `,
    )
  }

  {
    const posts = await mxClient.aggregate
      .getTimeline()
      .then((data) => data.data)
      .then((data) => {
        const posts = data.posts
        const notes = data.notes
        const sorted = [
          ...posts.map((i) => ({ ...i, type: 'Post' as const })),
          ...notes.map((i) => ({ ...i, type: 'Note' as const })),
        ].sort((b, a) => +new Date(a.created) - +new Date(b.created))
        return sorted.slice(0, 5).reduce((acc, cur) => {
          if (cur.type === 'Note') {
            return acc.concat(generateNoteItemHTML(cur))
          } else {
            return acc.concat(generatePostItemHTML(cur))
          }
        }, '')
      })

    newContent = newContent.replace(
      gc('RECENT_POSTS'),
      m`
      <ul>
  ${posts}
      </ul>
      `,
    )
  }

  // 注入 FOOTER
  {
    const now = new Date()
    const next = dayjs().add(24, 'h').toDate()

    newContent = newContent.replace(
      gc('FOOTER'),
      m`
    <p align="center">This <i>README</i> <b>refreshes every 24 hours</b> automatically!
    </br>
    Refreshed at: ${now.toLocaleString(undefined, {
      timeStyle: 'short',
      dateStyle: 'short',
      timeZone,
    })}
    <br/>
    Next refresh: ${next.toLocaleString(undefined, {
      timeStyle: 'short',
      dateStyle: 'short',
      timeZone,
    })}</p>
    `,
    )
  }

  newContent = newContent.replace(gc('MOTTO'), motto)
  await rm('./readme.md', { force: true })
  await writeFile('./readme.md', newContent, { encoding: 'utf-8' })

  const result = md.render(newContent)
  await writeFile('./index.html', result, { encoding: 'utf-8' })
}

function gc(token: keyof typeof COMMNETS) {
  return `<!-- ${COMMNETS[token]} -->`
}

function m(html: TemplateStringsArray, ...args: any[]) {
  const str = html.reduce((s, h, i) => s + h + (args[i] ?? ''), '')
  return minify(str, {
    removeAttributeQuotes: true,
    removeEmptyAttributes: true,
    removeTagWhitespace: true,
    collapseWhitespace: true,
  }).trim()
}

main()
