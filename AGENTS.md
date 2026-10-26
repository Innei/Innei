# Agent Code Navigation

This page curates Innei's public repositories from the perspective of **what an agent can safely study or reuse**.

It covers both personal repositories and projects maintained under other GitHub scopes.

- Included: **48** repositories (**23** copy-friendly, **25** study-first)
- Scopes: personal `Innei`, org `Afilmory`, org `Torrent-Vibe`, org `mx-space`, org `jwcjs`, org `reactify-component`, extra `lobehub/lobehub`
- Copy-friendly licenses: `MIT`, `Apache-2.0`, `BSD`, `Unlicense`, `WTFPL`, `CC0`, `ISC`, and similar permissive licenses
- Usage: start with **Copy-Friendly** when you need reusable code; use **Study-First** for high-signal maintained projects with custom, missing, or copyleft licenses
- Reminder: keep the original `LICENSE` / `NOTICE`, and double-check third-party dependencies, assets, trademarks, and service terms before reusing code

## Legend

- `App`: complete product architecture, module splits, and interaction flows
- `Library`: reusable APIs, UI components, and module boundaries
- `Tooling`: CLIs, service interfaces, automation flows, and external integrations
- `System`: low-level parsing, protocol bridges, device interaction, and reverse-engineering toolchains

## Coverage Summary

### By type

- **App** × 17
- **Library** × 17
- **Tooling** × 14

### By license label

- **MIT** × 21
- **unlicensed** × 20
- **Apache-2.0** × 2
- **AGPL-3.0 + additional terms** × 1
- **ANL dual (MIT lib / AGPL app)** × 1
- **custom / NOASSERTION** × 1
- **Custom dual (MIT packages / AGPL apps)** × 1
- **GPL-3.0** × 1

## Copy-Friendly Repositories

These repositories declare a clear permissive SPDX license on GitHub. Prefer them when an agent needs to study **and reuse** implementation details.

| Repo | Type | License | Lang | What to copy | Description |
| --- | --- | --- | --- | --- | --- |
| [Innei/book-ssg-template](https://github.com/Innei/book-ssg-template) | `Tooling` | `MIT` | `TypeScript` | Document SSG template structure, content pipeline, and publishing layout. | Yet another template for document SSG. |
| [mx-space/ProcessReporterMac](https://github.com/mx-space/ProcessReporterMac) | `App` | `MIT` | `Swift` | macOS activity monitoring, AppKit lifecycle, and process reporting flows. | — |
| [Innei/Kagura](https://github.com/Innei/Kagura) | `App` | `MIT` | `TypeScript` | Slack-native agent orchestration, thread context, streaming UX, and CLI/SDK bridging. | A divine dance of AI in Slack — Kagura runs Claude Agent SDK and OpenAI Codex CLI natively in your workspace with thread-aware context, streaming UX, and persistent memory. |
| [Innei/rc-modal](https://github.com/Innei/rc-modal) | `Library` | `MIT` | `TypeScript` | Accessible modal composition with Radix primitives and Tailwind styling. | Beautifully designed Modal Component built with Radix UI and Tailwind CSS. |
| [Innei/nvim-config-lua](https://github.com/Innei/nvim-config-lua) | `Tooling` | `Apache-2.0` | `Lua` | Neovim Lua config layout, plugin bootstrap, and editor workflow conventions. | NVim is awesome |
| [Innei/bump-version](https://github.com/Innei/bump-version) | `Tooling` | `MIT` | `TypeScript` | Version bump CLI flow, release automation, and package metadata handling. | A more useful and easy-to-use bump version cli. |
| [Innei/media-library-organizer-skill](https://github.com/Innei/media-library-organizer-skill) | `Tooling` | `MIT` | `Shell` | Agent skill layout, media library cleanup rules, and TMDB verification workflows. | A Claude Code skill for organizing media libraries (movies, TV, anime) — clean junk, merge scattered episodes, normalize folder names, verify completeness against TMDB |
| [Innei/Tsuki](https://github.com/Innei/Tsuki) | `Library` | `MIT` | `TypeScript` | Hono + Nest-style decorators, DI container, and module boundaries. | 🌙 TypeScript on Hono: NestJS-style decorators, DI, modules. Tsuki (moon) ↔ Hono (flame). |
| [jwcjs/core](https://github.com/jwcjs/core) | `Library` | `MIT` | `TypeScript` | Web component runtime core, JSX integration surface, and package boundaries. | 🎨 Jwc.js is a JavaScript framework for using JSX to write web components on the web. |
| [Innei/ProcessReporter](https://github.com/Innei/ProcessReporter) | `App` | `MIT` | `Swift` | macOS activity monitoring, AppKit lifecycle, and process reporting flows. | A macOS application built with AppKit/Cocoa that monitors and reports real-time system activity. |
| [Innei/FWTI](https://github.com/Innei/FWTI) | `App` | `MIT` | `TypeScript` | Interactive personality-quiz product flow, scoring model, and result presentation. | 自嘲式恋爱人格测试，测测你在恋爱里是哪种废物。 |
| [Innei/mt-pt-keeper](https://github.com/Innei/mt-pt-keeper) | `Tooling` | `MIT` | `TypeScript` | Playwright session keepalive daemon, alert hooks, and long-running browser automation. | A Playwright-based session keepalive daemon for MT-PT / M-Team accounts with Telegram alerts. |
| [Innei/markdown-to-jsx-vue3](https://github.com/Innei/markdown-to-jsx-vue3) | `Library` | `MIT` | `TypeScript` | Markdown-to-JSX rendering bridge and Vue 3 integration patterns. | — |
| [Innei/next-suspense](https://github.com/Innei/next-suspense) | `Library` | `MIT` | `TypeScript` | Next.js client-route suspense wrapper and loading boundary patterns. | A suspense wrapper for NextJS when change router and fetching data in CSR. |
| [Innei/lumeo](https://github.com/Innei/lumeo) | `Library` | `MIT` | `TypeScript` | Image zoom/lightbox interactions, album navigation, and gesture/keyboard control. | Image zoom and multi-image lightbox — TypeScript fork of medium-zoom with album navigation, gestures, keyboard control, and a thumbnail strip. |
| [Innei/book-supabase-lemonsqueezy](https://github.com/Innei/book-supabase-lemonsqueezy) | `App` | `MIT` | `TypeScript` | Full product structure, module boundaries, and interaction flow. | — |
| [Innei/rayon-terminal](https://github.com/Innei/rayon-terminal) | `App` | `MIT` | `TypeScript` | Full product structure, module boundaries, and interaction flow. | A terminal implementation for Rayon. |
| [Innei/vscode-nvim-config](https://github.com/Innei/vscode-nvim-config) | `Tooling` | `Apache-2.0` | `Lua` | CLI/service interfaces, automation flows, and integration patterns. | — |
| [jwcjs/create-jwcjs](https://github.com/jwcjs/create-jwcjs) | `Tooling` | `MIT` | `TypeScript` | Project scaffolding CLI and starter template wiring. | 🔨 A Command Line Tool to create jwc.js project |
| [mx-space/mx-tg-bot](https://github.com/mx-space/mx-tg-bot) | `Tooling` | `MIT` | `TypeScript` | CLI/service interfaces, automation flows, and integration patterns. | — |
| [mx-space/netease-blil-api](https://github.com/mx-space/netease-blil-api) | `Library` | `MIT` | `TypeScript` | Reusable API design, UI components, and module boundaries. | One of Mix Space ecosystem. |
| [Innei/fuji-geotag](https://github.com/Innei/fuji-geotag) | `Tooling` | `MIT` | `Shell` | GPX geotag backfill for Fujifilm RAF/HIF/JPG while preserving MakerNotes. | Backfill GPS into Fujifilm RAF/HIF/JPG from a GPX track without losing MakerNotes |
| [Innei/pi-config](https://github.com/Innei/pi-config) | `Tooling` | `MIT` | `JavaScript` | CLI/service interfaces, automation flows, and integration patterns. | My pi coding agent configuration |

## Study-First Maintained Projects

These are actively maintained or high-signal projects under personal or org scopes, including dual-license / custom / unlicensed / copyleft work.

**Do not treat them as freely reusable by default.** Read the repository `LICENSE` first. Many are excellent for architecture study, product patterns, and interaction design.

| Repo | Type | License | Lang | What to copy | Description |
| --- | --- | --- | --- | --- | --- |
| [lobehub/lobehub](https://github.com/lobehub/lobehub) | `App` | `custom / NOASSERTION` | `TypeScript` | Large multi-agent product architecture and operator console patterns. Collaborated product — study product structure, verify license before reuse. | 🤯 LobeHub is your Chief Agent Operator, organizing your agents into 7×24 operations by hiring, scheduling, and reporting on your entire AI team. |
| [Innei/Shiro](https://github.com/Innei/Shiro) | `App` | `AGPL-3.0 + additional terms` | `TypeScript` | Personal site architecture, CMS integration, theme system, and content rendering. Study only — AGPL with extra terms. | 📜 A minimalist personal website embodying the purity of paper and freshness of snow. |
| [Afilmory/afilmory](https://github.com/Afilmory/afilmory) | `App` | `ANL dual (MIT lib / AGPL app)` | `TypeScript` | Photo gallery product structure, S3/GitHub sync, EXIF pipeline, maps, and WebGL viewer. Library packages may be MIT; app is AGPL + attribution. | Modern photo gallery for photographers, with S3/GitHub sync, EXIF details, maps, and a WebGL viewer. |
| [mx-space/core](https://github.com/mx-space/core) | `App` | `Custom dual (MIT packages / AGPL apps)` | `TypeScript` | AI-powered CMS core, Nest-style backend modules, and blog platform boundaries. `apps/` is AGPL; non-app packages are MIT. | AI-powered CMS core for personal blogs and creator websites, with AI summaries, translation, moderation, and writing workflows. |
| [mx-space/kami](https://github.com/mx-space/kami) | `App` | `GPL-3.0` | `TypeScript` | Colorful flat blog theme architecture and Mix Space frontend patterns. Copyleft — study structure carefully. | 🍰 Kami is mx-space's web frontend theme. Colorful, flat, cute and comfortable. |
| [Innei/shuffle-article](https://github.com/Innei/shuffle-article) | `Library` | `unlicensed` | `TypeScript` | DOM text shuffling while preserving visual layout for lightweight copy protection. Study only until a license is published. | Shuffle text in the DOM while preserving visual rendering for lightweight copy protection. |
| [Innei/kansoku](https://github.com/Innei/kansoku) | `App` | `unlicensed` | `TypeScript` | Personal market observatory, trading records, agent skills, and realtime charts. Study only until a license is published. | Personal US market observatory with trading records, agent skills, and realtime charts |
| [Torrent-Vibe/Torrent-Vibe](https://github.com/Torrent-Vibe/Torrent-Vibe) | `App` | `unlicensed` | `TypeScript` | qBittorrent web UI architecture, performance-oriented torrent management, and cross-platform desktop shell. Study only until a license is published. | Torrent Vibe, a modern, elegant web interface for qBittorrent that transforms your torrent management experience with enhanced performance, intuitive design, and cross-platform compatibility. |
| [Innei/Yohaku](https://github.com/Innei/Yohaku) | `Library` | `unlicensed` | `HTML` | Typographic design tokens, accent/neutral tiers, and whitespace-first layout system. Study only until a license is published. | 余白 / Yohaku — A typographic design system for written content. One accent, three neutral tiers, the rest is whitespace. |
| [Innei/electron-ipc-decorator](https://github.com/Innei/electron-ipc-decorator) | `Library` | `unlicensed` | `TypeScript` | Type-safe Electron IPC decorators and automatic proxy generation. Study only until a license is published. | A TypeScript-first decorator library that simplifies Electron IPC communication with type safety and automatic proxy generation |
| [Innei/Pastel](https://github.com/Innei/Pastel) | `Library` | `unlicensed` | `TypeScript` | OKLCH pastel color system, Tailwind v4 tokens, and kawaii palette design. Study only until a license is published. | A comprehensive kawaii-inspired color system with OKLCH color space support, TypeScript definitions, and TailwindCSS v4 integration. Features a cute & kawaii aesthetic with soft, pastel tones. |
| [Innei/SKILL](https://github.com/Innei/SKILL) | `Tooling` | `unlicensed` | `Python` | Scalable personal agent skill directory layout and packaging conventions. Study only until a license is published. | This repository stores personal AI Agent  skills in a scalable directory layout. |
| [Innei/dotfiles](https://github.com/Innei/dotfiles) | `Tooling` | `unlicensed` | `Vim Script` | Personal developer environment bootstrap across nvim, zsh, git, and related tools. Study only until a license is published. | Innei's dotfiles. nvim, zsh, fzf, git, ideavim, ranger |
| [Afilmory/docker](https://github.com/Afilmory/docker) | `Tooling` | `unlicensed` | `Dockerfile` | Container packaging and deploy composition for Afilmory. Study only until a license is published. | — |
| [Innei/zshrc](https://github.com/Innei/zshrc) | `Tooling` | `unlicensed` | `Shell` | CLI/service interfaces, automation flows, and integration patterns. | one-key to configure zsh. |
| [mx-space/docs](https://github.com/mx-space/docs) | `App` | `unlicensed` | `MDX` | Mix Space documentation site structure and MDX content system. Study only until a license is published. | 📄 Documentation v3 for Mix Space |
| [Innei/apple-uikit-colors](https://github.com/Innei/apple-uikit-colors) | `Library` | `unlicensed` | `CSS` | Cross-platform semantic color system for React Native / Web with dark mode. Study only until a license is published. | A cross-platform color system for React Native and React Native Web that provides iOS/macOS-style semantic colors with dark mode support |
| [Innei/haklex](https://github.com/Innei/haklex) | `Library` | `unlicensed` | `TypeScript` | Lexical editor schema, SSR path, and AI agent LiteXML protocol. Study only until a license is published. | AI-native Lexical rich text editor. Edit, render, SSR, and AI agent protocol (LiteXML) — all from one schema. React 19, TypeScript, Vanilla Extract, ESM. |
| [Innei/claude](https://github.com/Innei/claude) | `App` | `unlicensed` | `Shell` | Full product structure, module boundaries, and interaction flow. | Claude Code configuration |
| [Innei/animate-uri](https://github.com/Innei/animate-uri) | `Library` | `unlicensed` | `TypeScript` | URL transition animation technique for browser chrome flair. Study only until a license is published. | Animate your url transitions for that extra flair. 🔨👴 |
| [Innei/exif-tools](https://github.com/Innei/exif-tools) | `App` | `unlicensed` | `TypeScript` | Browser EXIF read/edit/transfer flows for photography tooling. Study only until a license is published. | A modern web application for reading, editing, and transferring EXIF metadata between images. |
| [Innei/nestjs-pretty-logger](https://github.com/Innei/nestjs-pretty-logger) | `Library` | `unlicensed` | `TypeScript` | NestJS logger adapter on consola, file redirect, and realtime log UX. Study only until a license is published. | 🌟 Elevate NestJS logging with stylish, file-redirected, and real-time capable logging based on consola. Compact, powerful, and easy to integrate. |
| [Innei/face-mask-web](https://github.com/Innei/face-mask-web) | `App` | `unlicensed` | `TypeScript` | Full product structure, module boundaries, and interaction flow. | An AI-based face detection and Emoji replacement web-app |
| [reactify-component/react-shortcut-guide](https://github.com/reactify-component/react-shortcut-guide) | `Library` | `unlicensed` | `TypeScript` | Keyboard shortcut guide UI patterns. Study only until a license is published. | Long-press `⌘` key or press `?` to present a shortcut guide for your Web application. |
| [reactify-component/react-message](https://github.com/reactify-component/react-message) | `Library` | `unlicensed` | `TypeScript` | Toast/message stack component patterns. Study only until a license is published. | 💬 React Message is a 🚀 React component library for displaying customizable messages and notifications to users. It's easy to integrate and supports features like animations and timeout. |

## Practical Copy Rules

1. Prefer **Copy-Friendly** repositories for direct implementation reuse.
2. For dual-license projects (for example Mix Space / Afilmory), only treat explicitly MIT (or otherwise permissive) packages/paths as copy-friendly.
3. Before copying, verify third-party dependency licenses, branding assets, screenshots, icons, API keys, and private endpoints.
4. Keep any required `LICENSE`, `NOTICE`, and attribution text from the original repository.
5. If a repository has no clear license, treat it as inspiration only and do not copy the implementation.
6. Org-scoped projects listed here are included because Innei maintains or collaborates on them; ownership still belongs to the respective organization.

---

_Generated by profile build. Edit `config.ts` (`agents`) to adjust scopes, excludes, and per-repo guidance._
