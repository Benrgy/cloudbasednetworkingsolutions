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
    title: 'Cloud Network Calculator 2025 - Free Subnet, IP & Cost Calculator | AWS, Azure, GCP',
    description: 'Professional cloud network calculator with subnet planning, IP allocation, and multi-cloud cost comparison. Calculate CIDR, VLSM, and estimate networking costs for AWS, Azure, and GCP. Free decision helper included.',
    keywords: 'subnet calculator 2025, cloud network calculator, IP calculator free, CIDR calculator, AWS subnet calculator, Azure network calculator, GCP networking, cloud cost calculator, VLSM calculator, network planning tool, IP allocation calculator, multi-cloud comparison',
    ogTitle: 'Free Cloud Network Calculator - Subnet, IP & Cost Estimation Tool 2025',
    ogDescription: 'Calculate subnets, plan IP allocation, and compare cloud networking costs across AWS, Azure, and GCP. Professional tools with AI-powered recommendations for network engineers.',
    twitterTitle: 'Cloud Network Calculator - Free Subnet & IP Tools',
    twitterDescription: 'Professional subnet calculator, IP planner, and cloud cost estimator. Make informed networking decisions with our free calculator tools.'
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