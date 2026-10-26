export const opensource = {
  active: [
    //'Innei/Shiro',
    'Innei/Yohaku',"innei/lody-ios",
    'Afilmory/Afilmory',
    //'Torrent-Vibe/Torrent-Vibe',
    "Innei/ryugi",
    "kansoku-trade/kansoku",
        
    'lobehub/lobe-chat',
  ],
}
export const motto = `<strong>Ich bin bereit, zu sterben, bereit, wieder geboren zu werden.</strong>`
export const github = {
  name: 'Innei',
}

export const mxSpace = {
  url: 'https://innei.in',
  api: 'https://mx.innei.in/api/v3',
  /** 传递语言代码以获取翻译后的数据，例如 'en' 获取英文 */
  lang: 'en' as string | undefined,
}

export const timeZone = 'Asia/Shanghai'

export type AgentRepoType = 'App' | 'Library' | 'Tooling' | 'System'

export type AgentRepoOverride = {
  type?: AgentRepoType
  license?: string
  copy?: string
  description?: string
}

export const agents = {
  personal: 'Innei',
  orgs: [
    'Afilmory',
    'Torrent-Vibe',
    'mx-space',
    'jwcjs',
    'reactify-component',
  ] as string[],
  extraRepos: ['lobehub/lobehub'] as string[],
  excludeFullNames: [
    'Innei/Innei',
    'Innei/.github',
    'mx-space/.github',
    'Afilmory/.github',
  ] as string[],
  excludeNames: [
    'assets',
    'demo-photos',
    'docs-images',
    'anime-wallpapers',
    'feature-log',
    'email-templates',
  ] as string[],
  includeArchived: false,
  studyMinStars: 20,
  overrides: {
    'Innei/Shiro': {
      type: 'App',
      license: 'AGPL-3.0 + additional terms',
      copy: 'Personal site architecture, CMS integration, theme system, and content rendering. Study only — AGPL with extra terms.',
    },
    'Innei/Yohaku': {
      type: 'Library',
      license: 'unlicensed',
      copy: 'Typographic design tokens, accent/neutral tiers, and whitespace-first layout system. Study only until a license is published.',
    },
    'Afilmory/afilmory': {
      type: 'App',
      license: 'ANL dual (MIT lib / AGPL app)',
      copy: 'Photo gallery product structure, S3/GitHub sync, EXIF pipeline, maps, and WebGL viewer. Library packages may be MIT; app is AGPL + attribution.',
    },
    'Torrent-Vibe/Torrent-Vibe': {
      type: 'App',
      license: 'unlicensed',
      copy: 'qBittorrent web UI architecture, performance-oriented torrent management, and cross-platform desktop shell. Study only until a license is published.',
    },
    'mx-space/core': {
      type: 'App',
      license: 'Custom dual (MIT packages / AGPL apps)',
      copy: 'AI-powered CMS core, Nest-style backend modules, and blog platform boundaries. `apps/` is AGPL; non-app packages are MIT.',
    },
    'mx-space/kami': {
      type: 'App',
      license: 'GPL-3.0',
      copy: 'Colorful flat blog theme architecture and Mix Space frontend patterns. Copyleft — study structure carefully.',
    },
    'mx-space/ProcessReporterMac': {
      type: 'App',
      copy: 'macOS activity monitoring, AppKit lifecycle, and process reporting flows.',
    },
    'Innei/ProcessReporter': {
      type: 'App',
      copy: 'macOS activity monitoring, AppKit lifecycle, and process reporting flows.',
    },
    'Innei/nvim-config-lua': {
      type: 'Tooling',
      copy: 'Neovim Lua config layout, plugin bootstrap, and editor workflow conventions.',
    },
    'Innei/markdown-to-jsx-vue3': {
      type: 'Library',
      copy: 'Markdown-to-JSX rendering bridge and Vue 3 integration patterns.',
    },
    'Innei/next-suspense': {
      type: 'Library',
      copy: 'Next.js client-route suspense wrapper and loading boundary patterns.',
    },
    'Innei/nestjs-pretty-logger': {
      type: 'Library',
      license: 'unlicensed',
      copy: 'NestJS logger adapter on consola, file redirect, and realtime log UX. Study only until a license is published.',
    },
    'Innei/apple-uikit-colors': {
      type: 'Library',
      license: 'unlicensed',
      copy: 'Cross-platform semantic color system for React Native / Web with dark mode. Study only until a license is published.',
    },
    'Innei/animate-uri': {
      type: 'Library',
      license: 'unlicensed',
      copy: 'URL transition animation technique for browser chrome flair. Study only until a license is published.',
    },
    'Innei/dotfiles': {
      type: 'Tooling',
      license: 'unlicensed',
      copy: 'Personal developer environment bootstrap across nvim, zsh, git, and related tools. Study only until a license is published.',
    },
    'Innei/exif-tools': {
      type: 'App',
      license: 'unlicensed',
      copy: 'Browser EXIF read/edit/transfer flows for photography tooling. Study only until a license is published.',
    },
    'mx-space/docs': {
      type: 'App',
      license: 'unlicensed',
      copy: 'Mix Space documentation site structure and MDX content system. Study only until a license is published.',
    },
    'Afilmory/docker': {
      type: 'Tooling',
      license: 'unlicensed',
      copy: 'Container packaging and deploy composition for Afilmory. Study only until a license is published.',
    },
    'Innei/Kagura': {
      type: 'App',
      copy: 'Slack-native agent orchestration, thread context, streaming UX, and CLI/SDK bridging.',
    },
    'Innei/Tsuki': {
      type: 'Library',
      copy: 'Hono + Nest-style decorators, DI container, and module boundaries.',
    },
    'Innei/rc-modal': {
      type: 'Library',
      copy: 'Accessible modal composition with Radix primitives and Tailwind styling.',
    },
    'Innei/lumeo': {
      type: 'Library',
      copy: 'Image zoom/lightbox interactions, album navigation, and gesture/keyboard control.',
    },
    'Innei/bump-version': {
      type: 'Tooling',
      copy: 'Version bump CLI flow, release automation, and package metadata handling.',
    },
    'Innei/book-ssg-template': {
      type: 'Tooling',
      copy: 'Document SSG template structure, content pipeline, and publishing layout.',
    },
    'Innei/media-library-organizer-skill': {
      type: 'Tooling',
      copy: 'Agent skill layout, media library cleanup rules, and TMDB verification workflows.',
    },
    'Innei/shuffle-article': {
      type: 'Library',
      license: 'unlicensed',
      copy: 'DOM text shuffling while preserving visual layout for lightweight copy protection. Study only until a license is published.',
    },
    'Innei/electron-ipc-decorator': {
      type: 'Library',
      license: 'unlicensed',
      copy: 'Type-safe Electron IPC decorators and automatic proxy generation. Study only until a license is published.',
    },
    'Innei/Pastel': {
      type: 'Library',
      license: 'unlicensed',
      copy: 'OKLCH pastel color system, Tailwind v4 tokens, and kawaii palette design. Study only until a license is published.',
    },
    'Innei/SKILL': {
      type: 'Tooling',
      license: 'unlicensed',
      copy: 'Scalable personal agent skill directory layout and packaging conventions. Study only until a license is published.',
    },
    'Innei/haklex': {
      type: 'Library',
      license: 'unlicensed',
      copy: 'Lexical editor schema, SSR path, and AI agent LiteXML protocol. Study only until a license is published.',
    },
    'Innei/kansoku': {
      type: 'App',
      license: 'unlicensed',
      copy: 'Personal market observatory, trading records, agent skills, and realtime charts. Study only until a license is published.',
    },
    'Innei/FWTI': {
      type: 'App',
      copy: 'Interactive personality-quiz product flow, scoring model, and result presentation.',
    },
    'Innei/mt-pt-keeper': {
      type: 'Tooling',
      copy: 'Playwright session keepalive daemon, alert hooks, and long-running browser automation.',
    },
    'Innei/fuji-geotag': {
      type: 'Tooling',
      copy: 'GPX geotag backfill for Fujifilm RAF/HIF/JPG while preserving MakerNotes.',
    },
    'jwcjs/core': {
      type: 'Library',
      copy: 'Web component runtime core, JSX integration surface, and package boundaries.',
    },
    'jwcjs/create-jwcjs': {
      type: 'Tooling',
      copy: 'Project scaffolding CLI and starter template wiring.',
    },
    'lobehub/lobehub': {
      type: 'App',
      license: 'custom / NOASSERTION',
      copy: 'Large multi-agent product architecture and operator console patterns. Collaborated product — study product structure, verify license before reuse.',
    },
    'reactify-component/react-shortcut-guide': {
      type: 'Library',
      license: 'unlicensed',
      copy: 'Keyboard shortcut guide UI patterns. Study only until a license is published.',
    },
    'reactify-component/react-message': {
      type: 'Library',
      license: 'unlicensed',
      copy: 'Toast/message stack component patterns. Study only until a license is published.',
    },
  } satisfies Record<string, AgentRepoOverride>,
}
