import { defineConfig, presets } from 'sponsorkit'

export default defineConfig({
  // Providers configs
  github: {
    login: 'innei',
    type: 'user',
  },

  afdian: {
    userId: 'e97ad8460df611eab74952540025c377',
    exechangeRate: 7,
    // ...
  },
  includePastSponsors: true,
  includePrivate: true,
  force: true,
  providers: ['afdian', 'github'],
  filter: (sponsor) => {
    if (
      sponsor.provider === 'afdian' &&
      sponsor.raw?.current_plan?.plan_id === '08eb414c930711ec8d4d52540025c377'
    )
      return false
    return true
  },

  // Rendering configs
  width: 800,
  formats: ['json', 'svg', 'png'],
  tiers: [
    // Past sponsors, currently only supports GitHub
    {
      title: 'Past Sponsors',
      monthlyDollars: -1,
      preset: presets.xs,
    },
    // Default tier
    {
      title: 'Backers',
      preset: presets.base,
    },
    {
      title: 'Sponsors',
      monthlyDollars: 10,
      preset: presets.medium,
    },
    {
      title: 'Silver Sponsors',
      monthlyDollars: 50,
      preset: presets.large,
    },
    {
      title: 'Gold Sponsors',
      monthlyDollars: 100,
      preset: presets.xl,
    },
  ],
})
