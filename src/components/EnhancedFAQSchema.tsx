import { Helmet } from "react-helmet-async";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is subnetting and why is it important for cloud based networking?",
    answer: "Subnetting divides a network into smaller segments for better security, performance, and organization. In cloud environments like AWS, Azure, and GCP, proper subnetting enables micro-segmentation for enhanced security, reduces broadcast domains for improved performance, and helps manage costs by minimizing expensive cross-subnet traffic. It's essential for compliance, scalability, and implementing Zero Trust security models."
  },
  {
    question: "How do I calculate the right subnet size for my needs?",
    answer: "To calculate subnet size: 1) Determine total hosts needed 2) Add 30-50% for growth 3) Account for reserved IPs (network, broadcast, gateway) 4) Use CIDR notation - /24 gives 254 hosts, /25 gives 126 hosts, /26 gives 62 hosts. Our calculator automatically determines optimal subnet sizes based on your requirements and provides VLSM recommendations for efficient IP allocation."
  },
  {
    question: "Which cloud provider has the lowest networking costs?",
    answer: "GCP typically offers the most generous free tier (1TB/month worldwide) and simpler pricing. AWS and Azure have similar data transfer costs ($0.09 vs $0.087 per GB). However, total cost depends on your specific usage patterns, regions, and services. Use our Cost Estimation tool to compare providers based on your exact requirements including data transfer volumes, regions, and instance counts."
  },
  {
    question: "How can I optimize IP allocation for multi-cloud environments?",
    answer: "For multi-cloud IP optimization: 1) Establish global IP addressing scheme to prevent overlaps 2) Divide RFC 1918 private address space into provider-specific blocks 3) Use VLSM for efficient allocation 4) Plan for VPN/interconnect requirements 5) Implement IPAM tools for visibility 6) Use Infrastructure as Code for consistency. This prevents conflicts and enables seamless connectivity across AWS, Azure, and GCP."
  },
  {
    question: "What are the essential security best practices for cloud network design?",
    answer: "Essential security practices: 1) Implement Zero Trust architecture with micro-segmentation 2) Use separate subnets for web, app, and database tiers 3) Enable encryption for all traffic (TLS 1.3, IPSec) 4) Deploy network monitoring with SIEM integration 5) Implement DDoS protection 6) Use private subnets for sensitive resources 7) Configure network ACLs and security groups 8) Enable compliance logging for audit requirements."
  },
  {
    question: "How do I troubleshoot network connectivity issues in the cloud?",
    answer: "Troubleshooting steps: 1) Verify security group and firewall rules 2) Check route tables and network ACLs 3) Confirm DNS resolution 4) Test with ping and traceroute 5) Review VPN/interconnect status 6) Check for IP conflicts 7) Verify NAT gateway configuration 8) Review cloud provider status pages 9) Enable VPC flow logs for traffic analysis 10) Use network diagnostic tools provided by your cloud provider."
  },
  {
    question: "What is CIDR notation and how do I use it?",
    answer: "CIDR (Classless Inter-Domain Routing) notation combines IP address with subnet mask using slash notation (e.g., 192.168.1.0/24). The number after the slash indicates network bits. /24 = 256 IPs (254 usable), /25 = 128 IPs (126 usable), /26 = 64 IPs (62 usable). Lower numbers = more IPs. Use our Subnet Calculator to convert between CIDR, subnet masks, and calculate available hosts automatically."
  },
  {
    question: "How do I plan for network scalability in the cloud?",
    answer: "Scalability planning: 1) Over-provision IP space by 50-100% initially 2) Use hierarchical IP addressing scheme 3) Plan separate address ranges for each environment (dev, staging, prod) 4) Design for multi-region expansion 5) Use auto-scaling groups and load balancers 6) Implement elastic IPs sparingly 7) Plan for hybrid cloud connectivity 8) Document IP allocation strategy 9) Use our calculator to model growth scenarios."
  },
  {
    question: "What is the difference between public and private subnets?",
    answer: "Public subnets have route table entries directing traffic to an Internet Gateway, making resources accessible from the internet. Private subnets lack internet gateway routes and use NAT gateways for outbound-only internet access. Best practice: Place web servers in public subnets, application servers and databases in private subnets for security. Use bastion hosts or VPN for private subnet access."
  },
  {
    question: "How can I reduce cloud networking costs?",
    answer: "Cost reduction strategies: 1) Minimize cross-region data transfer 2) Use CDN for content delivery 3) Implement data compression 4) Right-size load balancers 5) Use reserved capacity for predictable workloads 6) Consolidate VPN connections with transit gateways 7) Optimize egress traffic patterns 8) Use provider-specific free tiers 9) Implement caching layers 10) Monitor with cost alerts. Use our Cost Estimator to identify savings opportunities."
  }
];

export const EnhancedFAQSchema = () => {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqItems.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer
            }
          }))
        })}
      </script>
    </Helmet>
  );
};
