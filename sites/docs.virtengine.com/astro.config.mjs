// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://docs.virtengine.com',
  trailingSlash: 'ignore',
  integrations: [
    starlight({
      title: 'VirtEngine Docs',
      description:
        'Canonical documentation for the VirtEngine Protocol — a decentralized cloud computing marketplace built on CometBFT and the Cosmos SDK.',
      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
        replacesTitle: true,
      },
      favicon: '/favicon.svg',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/virtengine/virtengine',
        },
      ],
      customCss: [
        '@fontsource/inter/400.css',
        '@fontsource/inter/500.css',
        '@fontsource/inter/600.css',
        '@fontsource/space-grotesk/500.css',
        '@fontsource/space-grotesk/600.css',
        '@fontsource/space-grotesk/700.css',
        '@fontsource/jetbrains-mono/400.css',
        '@fontsource/jetbrains-mono/500.css',
        './src/styles/custom.css',
      ],
      head: [
        {
          tag: 'meta',
          attrs: { property: 'og:image', content: 'https://docs.virtengine.com/og.svg' },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:card', content: 'summary_large_image' },
        },
      ],
      // A custom 404 lives at src/content/docs/404.md; disabling the built-in
      // route lets the catch-all render it without an Astro route conflict.
      disable404Route: true,
      lastUpdated: false,
      sidebar: [
        {
          label: 'Protocol',
          items: [
            { label: 'Introduction', slug: 'protocol/introduction' },
            { label: 'How the Marketplace Works', slug: 'protocol/how-it-works' },
            { label: 'Architecture', slug: 'protocol/architecture' },
            { label: 'On-Chain Module Map', slug: 'protocol/modules' },
          ],
        },
        {
          label: 'Core Concepts',
          items: [
            { label: 'Marketplace & Bidding', slug: 'concepts/marketplace' },
            { label: 'Escrow & Settlement', slug: 'concepts/escrow-settlement' },
            { label: 'Usage Reporting', slug: 'concepts/usage-reporting' },
            { label: 'Tokenomics', slug: 'concepts/tokenomics' },
            { label: 'Take Rates & BME', slug: 'concepts/take-and-bme' },
            { label: 'Governance & Staking', slug: 'concepts/governance-staking' },
            { label: 'Encryption & Enclaves', slug: 'concepts/encryption-enclaves' },
            { label: 'Fraud, Audit & Oracles', slug: 'concepts/fraud-audit-oracles' },
            { label: 'HPC Workloads', slug: 'concepts/hpc' },
          ],
        },
        {
          label: 'Identity (VEID)',
          items: [
            { label: 'VEID Overview', slug: 'veid/overview' },
            { label: 'Enrollment & Capture Flow', slug: 'veid/enrollment' },
            { label: 'Hardware & Device Attestation', slug: 'veid/hardware-attestation' },
            { label: 'Consent Framework', slug: 'veid/consent-framework' },
            { label: 'Privacy Model', slug: 'veid/privacy' },
          ],
        },
        {
          label: 'For Providers',
          items: [
            { label: 'Becoming a Provider', slug: 'providers/overview' },
            { label: 'Provider Daemon', slug: 'providers/provider-daemon' },
            { label: 'Benchmarks & Audits', slug: 'providers/benchmarks-audits' },
            { label: 'Pricing & Bidding Strategy', slug: 'providers/pricing-bidding' },
            { label: 'Usage Reporting & Payouts', slug: 'providers/usage-and-payments' },
            { label: 'HPC Operations', slug: 'providers/hpc-operations' },
            { label: 'HPC Node Agent', slug: 'providers/hpc-node-agent' },
            { label: 'HPC Workload Templates', slug: 'providers/hpc-workload-templates' },
            { label: 'Security Obligations', slug: 'providers/security' },
          ],
        },
        {
          label: 'For Validators & Stakers',
          items: [
            { label: 'Running a Validator', slug: 'validators/running-a-validator' },
            { label: 'Staking Economics', slug: 'validators/staking-economics' },
            { label: 'Slashing Risks', slug: 'validators/slashing' },
            { label: 'Governance Participation', slug: 'validators/governance' },
            { label: 'Staking-as-a-Service Partners', slug: 'validators/staking-partners' },
            { label: 'Mainnet Launch Posture', slug: 'validators/mainnet-launch' },
          ],
        },
        {
          label: 'For Tenants & Deployers',
          items: [
            { label: 'Tenant Overview', slug: 'tenants/overview' },
            { label: 'Deploying Workloads', slug: 'tenants/deploying-workloads' },
            { label: 'Leases & Escrow Payments', slug: 'tenants/leases-and-escrow' },
            { label: 'Choosing Providers', slug: 'tenants/choosing-providers' },
            { label: 'Submitting HPC Jobs', slug: 'tenants/hpc-jobs' },
          ],
        },
        {
          label: 'For Developers',
          items: [
            { label: 'Building from Source', slug: 'developers/building-from-source' },
            { label: 'Development Environment', slug: 'developers/development-environment' },
            { label: 'Clients & SDKs', slug: 'developers/sdk-and-clients' },
            { label: 'Contributing', slug: 'developers/contributing' },
          ],
        },
        {
          label: 'Cloud Platform (Legacy)',
          badge: { text: 'Legacy', variant: 'caution' },
          items: [
            { label: 'Platform Overview', slug: 'cloud-platform/overview' },
            { label: 'Machines & Storage', slug: 'cloud-platform/machines-and-storage' },
            { label: 'Containers & Applications', slug: 'cloud-platform/containers-and-apps' },
            { label: 'Waldur Integration', slug: 'cloud-platform/waldur' },
          ],
        },
      ],
    }),
  ],
});
