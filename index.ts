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
    Authorization: process.env.GITHUB_TOKEN
      ? `Bearer ${process.env.GITHUB_TOKEN}`
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
  return m`<li><span>${new Date(item.created).toLocaleDateString(undefined, {
    dateStyle: 'short',
    timeZone,
  })} -  <a href="${
    mxSpace.url + '/posts/' + item.category.slug + '/' + item.slug
  }">${item.title}</a></span>${
    item.summary ? `<p>${item.summary}</p>` : ''
  }</li>`
}

function generateNoteItemHTML<T extends Partial<NoteModel>>(item: T) {
  return m`<li><span>${new Date(item.created).toLocaleDateString(undefined, {
    dateStyle: 'short',
    timeZone,
  })} -  <a href="${mxSpace.url + '/notes/' + item.nid}">${
    item.title
  }</a></span></li>`
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
