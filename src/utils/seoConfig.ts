export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
}

export const seoConfigs: Record<string, SEOConfig> = {
  '/': {
    title: 'Cloud Based Network Calculator - Professional IP & Subnet Tools',
    description: 'Professional cloud-based networking calculator for subnet planning, IP allocation, multi-cloud cost estimation, and security optimization. Advanced tools for network engineers and infrastructure professionals.',
    keywords: 'subnet calculator, IP allocation, cloud networking, network planning, CIDR calculator, cloud cost estimation, AWS networking, Azure networking, GCP networking, network security',
    ogTitle: 'Cloud Based Network Calculator - Professional Networking Tools',
    ogDescription: 'Advanced subnet calculator, IP allocation planner, and multi-cloud cost estimation tools for network engineers and cloud architects.',
    twitterTitle: 'Cloud Based Network Calculator - Pro Tools',
    twitterDescription: 'Professional networking tools for subnet calculation, IP planning, and cloud cost estimation. Used by network engineers worldwide.'
  },
  '/calculator': {
    title: 'Network Calculator Tools - Subnet & IP Allocation Calculator',
    description: 'Advanced network calculator with subnet calculation, IP allocation planning, and multi-cloud cost estimation. Professional tools for network engineers.',
    keywords: 'network calculator, subnet calculator, IP calculator, CIDR calculator, VLSM calculator, network planning tools',
    ogTitle: 'Advanced Network Calculator Tools',
    ogDescription: 'Professional subnet calculator and IP allocation tools for network engineers and cloud architects.',
    twitterTitle: 'Network Calculator Tools',
    twitterDescription: 'Advanced subnet and IP allocation calculator tools for professional network planning.'
  },
  '/how-to-use': {
    title: 'How to Use Network Calculator - Tutorial & Guide',
    description: 'Learn how to use our professional network calculator tools for subnet calculation, IP allocation, and cloud cost estimation. Step-by-step tutorials.',
    keywords: 'network calculator tutorial, subnet calculator guide, IP allocation tutorial, cloud networking guide',
    ogTitle: 'Network Calculator Tutorial & Guide',
    ogDescription: 'Complete guide on using professional network calculator tools for subnet planning and IP allocation.',
    twitterTitle: 'Network Calculator Tutorial',
    twitterDescription: 'Learn to use professional network calculation tools with our comprehensive guide.'
  },
  '/faq': {
    title: 'Network Calculator FAQ - Common Questions & Answers',
    description: 'Frequently asked questions about subnet calculation, IP allocation, cloud networking, and professional network planning tools.',
    keywords: 'network calculator FAQ, subnet calculator questions, IP allocation help, cloud networking FAQ',
    ogTitle: 'Network Calculator FAQ & Help',
    ogDescription: 'Get answers to common questions about subnet calculation, IP allocation, and cloud networking tools.',
    twitterTitle: 'Network Calculator FAQ',
    twitterDescription: 'Common questions and answers about professional network calculation tools.'
  }
};

export const getDefaultSEO = (): SEOConfig => seoConfigs['/'];